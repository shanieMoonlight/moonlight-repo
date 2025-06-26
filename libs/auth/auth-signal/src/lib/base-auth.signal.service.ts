import { isPlatformBrowser } from '@angular/common';
import { Directive, OnDestroy, PLATFORM_ID, WritableSignal, computed, effect, inject, isDevMode, signal } from '@angular/core';
import { devConsole } from '@spider-baby/dev-console';
import { DateHelpers } from '@spider-baby/utils-common/dates';
import { Claim } from './claims/claim';
import { JwtHelper } from './jwt/jwt-helper';
import { JwtPayload } from './jwt/jwt-payload';
import { LogErrorContext } from './logging/log-error-context';

@Directive({})
/**
 * Base class for JWT authentication using Angular signals.
 * Provides type-safe, reactive access to claims and handles token expiry.
 */
export abstract class BaseAuthSignalService<JWT extends JwtPayload = JwtPayload> implements OnDestroy {

  protected _platformId = inject(PLATFORM_ID)

  //- - - - - - - - - -//

  protected isPlatformBrowser = computed(() => isPlatformBrowser(this._platformId))
  private expiryTimeout?: ReturnType<typeof setTimeout>;

  private _accessToken: WritableSignal<string | null> = signal(null)

  /** Current access token value (signal) */
  accessToken = computed(() => this._accessToken())

  /** Decoded JWT payload (signal) */
  jwtPayload = computed(() => this.decodeToken(this._accessToken()))

  /** All claims as a record (signal) */
  allClaimsRecord = computed(() => this.extractAllClaimsRecord(this.jwtPayload()))
  /** All claims as an array (signal) */
  allClaims = computed(() => Object.values(this.allClaimsRecord()))

  /** Roles claim as a string array (signal, always defined) */
  roles = computed(() => {
    const roles = this.getClaimValue('role');
    if (!roles)
      return new Array<string>()
    return Array.isArray(roles)
      ? roles as string[]
      : [roles] as string[]
  });

  //- - - - - - - - - -//

  /** True if a valid JWT is present (signal) */
  isLoggedIn = computed(() => !!this.jwtPayload());
  /** True if no valid JWT is present (signal) */
  isNotLoggedIn = computed(() => !this.isLoggedIn());

  //- - - - - - - - - -//

  /** User's name claim (signal) */
  userName = computed(() => this.getClaimValue('name'))
  /** User's ID claim (signal) */
  userId = computed(() => this.getClaimValue('sub'))
  /** User's email claim (signal) */
  email = computed(() => this.getClaimValue('email'))

  /** JWT issuer (signal) */
  issuer = computed(() => this.getClaimValue('iss'))
  /** JWT audience (signal) */
  audience = computed(() => this.getClaimValue('aud'))


  /** Email verified claim (signal, always boolean) */
  emailVerified = computed(() => this.getClaimValue('email_verified') ?? false)

  /** Issued-at date (signal, Date or undefined) */
  issuedAt = computed(() =>
    DateHelpers.fromSeconds(this.getClaimValue('iat') as number | undefined)
  )
  /** Expiry date (signal, Date or undefined) */
  expiry = computed(() =>
    DateHelpers.fromSeconds(this.getClaimValue('exp') as number | undefined)
  )
  /** Not-before date (signal, Date or undefined) */
  notBefore = computed(() =>
    DateHelpers.fromSeconds(this.getClaimValue('nbf') as number | undefined)
  )
  /** Authentication time (signal, Date or undefined) */
  authTime = computed(() =>
    DateHelpers.fromSeconds(this.getClaimValue('auth_time') as number | undefined)
  )

  /** User's given name (signal) */
  firstName = computed(() => this.getClaimValue('given_name'))
  /** User's family name (signal) */
  lastName = computed(() => this.getClaimValue('family_name'))
  /** User's profile picture URL (signal) */
  picture = computed(() => this.getClaimValue('picture'))
  /** User's locale (signal) */
  locale = computed(() => this.getClaimValue('locale'))
  /** User's updated_at claim (signal) */
  updatedAt = computed(() => this.getClaimValue('updated_at'))
  /** User's birthdate claim (signal) */
  birthdate = computed(() => this.getClaimValue('birthdate'))
  /** User's gender claim (signal) */
  gender = computed(() => this.getClaimValue('gender'))
  /** User's address claim (signal) */
  address = computed(() => this.getClaimValue('address'))
  /** User's profile page URL (signal) */
  profile = computed(() => this.getClaimValue('profile'))
  /** User's website URL (signal) */
  website = computed(() => this.getClaimValue('website'))

  //- - - - - - - - - -//

  /** True if running in Angular dev mode (signal) */
  isDevMode = signal(isDevMode())

  //-------------------//

  /**
   * Store the JWT access token (must be implemented by subclass)
   */
  protected abstract storeJwt(accessToken: string): void

  /**
   * Remove the JWT the storage (must be implemented by subclass)
   */
  protected abstract removeJwt(): void

  /**
   * Get the stored JWT access token (must be implemented by subclass)
   */
  protected abstract getStoredToken(): Promise<string | null>;

  /**
   * Log an error with context (must be implemented by subclass)
   */
  protected abstract logError?(logData: LogErrorContext): void

  //-------------------//

  /**
   * Construct the service. Sets up expiry timer if in browser.
   */
  constructor() {

    if (!this.isPlatformBrowser())
      return

    effect(() => {
      this.setupExpiryTimer(this.expiry());
    })

  }

  //- - - - - - - - - -//

  async initAsync(): Promise<void> {
    if (!this.isPlatformBrowser())
      return;

    const storedToken = await this.getStoredToken();
    devConsole.log('init, storedToken', storedToken);
    if (storedToken)
      this.logIn(storedToken);
  }

  //- - - - - - - - - -//

  ngOnDestroy(): void {
    clearTimeout(this.expiryTimeout);
  }

  //-------------------//

  /**
   * Log in with a new JWT access token
   */
  logIn(accessToken: string): void {
    devConsole.log('Logged in successfully with token:', accessToken.substring(0, 15) + '...');
    this.storeJwt(accessToken)
    this._accessToken.set(accessToken ?? null)
  }

  //-------------------//

  /**
   * Log out the current user, clearing the JWT and all claims
   */
  logOut(): void {
    devConsole.log('Logged out successfully');
    this.removeJwt();
    return this._accessToken.set(null);
  }

  //-------------------//

  /**
   * True if the user has the given role
   */
  hasRole = (role: string): boolean =>
    this.roles().includes(role);

  //- - - - - - - - - -//

  /**
   * True if the current JWT is still valid (not expired)
   */
  protected isTokenStillValid = (): boolean => {
    const expiry = this.expiry();
    return !!expiry && new Date() < expiry
  }

  //-------------------//

  /**
   * True if a claim type exists in the JWT.
   * @template K extends keyof JWT
   * @param claimType The claim key to check for existence (must be a key of JWT).
   * @returns True if the claim exists in the decoded token.
   */
  hasClaimType = <K extends keyof JWT>(claimType: K): boolean =>
    !!claimType && !!this.jwtPayload()?.[claimType]

  //- - - - - - - - - -//

  /**
   * True if a claim has a specific value.
   * @template K extends keyof JWT
   * @param claimType The claim key to check (must be a key of JWT).
   * @param value The value to compare against the claim's value.
   * @returns True if the claim exists and equals the given value.
   */
  hasClaim = <K extends keyof JWT>(claimType: K, value: unknown): boolean =>
    this.jwtPayload()?.[claimType] == value

  //- - - - - - - - - -//

  /**
   * Get the value of a claim by name.
   * @template K extends keyof JWT
   * @param claimName The claim key to retrieve (must be a key of JWT).
   * @returns The value of the claim, or undefined if not present.
   */
  getClaimValue = <K extends keyof JWT>(claimName: K): JWT[K] | undefined =>
    this.jwtPayload()?.[claimName];

  //-------------------//

  /**
   * Decode a JWT access token into its payload object
   */
  private decodeToken(accessToken?: string | null): JWT | null {
    try {

      return accessToken
        ? JwtHelper.decodeToken(accessToken) as JWT
        : null;

    } catch (error) {
      this.logError?.({
        error,
        method: 'decodeToken',
        accessToken
      });
      return null
    }
  }

  //-------------------//

  /**
   * Extract all claims from a parsed JWT token into a record of Claim objects
   */
  private extractAllClaimsRecord<T extends object = JWT>(parsedToken?: T | null): Record<string, Claim> {

    const claimsRecord: Record<string, Claim> = {}
    if (!parsedToken)
      return claimsRecord

    for (const key in parsedToken)
      claimsRecord[key] = Claim.Create(key, parsedToken[key])

    return claimsRecord
  }


  //-------------------//

  /**
   * Called when the JWT expires (default: logs out)
   */
  protected onExpiry() {
    devConsole.log('onExpiry');
    this.logOut();
  }

  //-------------------//

  /**
   * Sets a timer to call onExpiry() when the JWT expires
   */
  private setupExpiryTimer(expiry?: Date) {
    clearTimeout(this.expiryTimeout);
    if (!expiry)
      return

    const msUntilExpiry = expiry.getTime() - Date.now();
    if (msUntilExpiry > 0)
      this.expiryTimeout = setTimeout(() => this.onExpiry(), msUntilExpiry);
    else
      this.onExpiry()
  }


} //Cls
