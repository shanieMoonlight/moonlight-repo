export const BaseAuthSignalServiceCode = `@Directive({})
export abstract class BaseAuthSignalService<JWT extends JwtPayload = JwtPayload> implements OnDestroy {
  protected _platformId = inject(PLATFORM_ID);
  private _isReady = signal(false);
  isReady = computed(() => this._isReady());
  isReady$ = toObservable(this.isReady);
  protected isPlatformBrowser = computed(() => isPlatformBrowser(this._platformId));
  
  private expiryTimeout?: ReturnType<typeof setTimeout>;
  private _accessToken: WritableSignal<string | null> = signal(null);
  accessToken = computed(() => this._accessToken());
  accessToken$ = toObservable(this.accessToken);
  
  jwtPayload = computed(() => this.decodeToken(this._accessToken()));
  allClaimsRecord = computed(() => this.extractAllClaimsRecord(this.jwtPayload()));
  allClaims = computed(() => Object.values(this.allClaimsRecord()));
  
  roles = computed(() => {
    const roles = this.getClaimValue('role');
    if (!roles) return new Array<string>();
    return Array.isArray(roles) ? roles as string[] : [roles] as string[];
  });
  
  isLoggedIn = computed(() => !!this.jwtPayload());
  isNotLoggedIn = computed(() => !this.isLoggedIn());
  userName = computed(() => this.getClaimValue('name'));
  userId = computed(() => this.getClaimValue('sub'));
  email = computed(() => this.getClaimValue('email'));
  issuer = computed(() => this.getClaimValue('iss'));
  audience = computed(() => this.getClaimValue('aud'));
  emailVerified = computed(() => this.getClaimValue('email_verified') ?? false);
  
  issuedAt = computed(() => DateHelpers.fromSeconds(this.getClaimValue('iat') as number | undefined));
  expiration = computed(() => this.getClaimValue('exp') || 0);
  expiration$ = toObservable(this.expiration);
  expiryDate = computed(() => DateHelpers.fromSeconds(this.getClaimValue('exp') as number | undefined));
  notBefore = computed(() => DateHelpers.fromSeconds(this.getClaimValue('nbf') as number | undefined));
  authTime = computed(() => DateHelpers.fromSeconds(this.getClaimValue('auth_time') as number | undefined));
  
  firstName = computed(() => this.getClaimValue('given_name'));
  lastName = computed(() => this.getClaimValue('family_name'));
  picture = computed(() => this.getClaimValue('picture'));
  locale = computed(() => this.getClaimValue('locale'));
  updatedAt = computed(() => this.getClaimValue('updated_at'));
  birthdate = computed(() => this.getClaimValue('birthdate'));
  gender = computed(() => this.getClaimValue('gender'));
  address = computed(() => this.getClaimValue('address'));
  profile = computed(() => this.getClaimValue('profile'));
  website = computed(() => this.getClaimValue('website'));
  
  isDevMode = signal(isDevMode());
  
  // Abstract methods that must be implemented by subclasses
  protected abstract storeJwt(accessToken: string): Promise<void>;
  protected abstract removeJwt(): Promise<void>;
  protected abstract getStoredToken(): Promise<string | null>;
  protected abstract logError?(logData: LogErrorContext): void;
  
  constructor() {
    if (!this.isPlatformBrowser()) return;
    effect(() => { this.setupExpiryTimer(this.expiryDate()); });
  }
  
  async initAsync(): Promise<void> {
    if (!this.isPlatformBrowser()) { this._isReady.set(true); return; }
    const storedToken = await this.getStoredToken();
    devConsole.log('init, storedToken', storedToken?.substring(0, 15) + '...');
    if (storedToken) this.logIn(storedToken);
    this._isReady.set(true);
  }
  
  ngOnDestroy(): void { clearTimeout(this.expiryTimeout); }
  
  logIn(accessToken: string): void { 
    this.storeJwt(accessToken); 
    this._accessToken.set(accessToken ?? null); 
  }
  
  logOut(): void { 
    this.removeJwt(); 
    return this._accessToken.set(null); 
  }
  
  hasRole = (role: string): boolean => this.roles().includes(role);
  
  protected isTokenStillValid = (): boolean => { 
    const expiry = this.expiryDate(); 
    return !!expiry && new Date() < expiry; 
  };
  
  hasClaimType = <K extends keyof JWT>(claimType: K): boolean => 
    !!claimType && !!this.jwtPayload()?.[claimType];
    
  hasClaim = <K extends keyof JWT>(claimType: K, value: unknown): boolean => 
    this.jwtPayload()?.[claimType] == value;
    
  getClaimValue = <K extends keyof JWT>(claimName: K): JWT[K] | undefined => 
    this.jwtPayload()?.[claimName];
  
  private decodeToken(accessToken?: string | null): JWT | null {
    try {
      return accessToken ? JwtHelper.decodeToken(accessToken) as JWT : null;
    } catch (error) {
      this.logError?.({ error, method: 'decodeToken', accessToken });
      return null;
    }
  }
  
  private extractAllClaimsRecord<T extends object = JWT>(parsedToken?: T | null): Record<string, Claim> {
    const claimsRecord: Record<string, Claim> = {};
    if (!parsedToken) return claimsRecord;
    for (const key in parsedToken) claimsRecord[key] = Claim.Create(key, parsedToken[key]);
    return claimsRecord;
  }
  
  protected onExpiry() { this.logOut(); }
  
  private setupExpiryTimer(expiry?: Date) {
    clearTimeout(this.expiryTimeout);
    if (!expiry) return;
    const msUntilExpiry = expiry.getTime() - Date.now();
    if (msUntilExpiry <= 0) { this.onExpiry(); return; }
    const MAX_TIMEOUT_MS = 2147483647;
    const timeoutDelay = Math.min(msUntilExpiry, MAX_TIMEOUT_MS);
    this.expiryTimeout = setTimeout(() => {
      if (timeoutDelay === MAX_TIMEOUT_MS) this.setupExpiryTimer(expiry);
      else this.onExpiry();
    }, timeoutDelay);
  }
}`;
