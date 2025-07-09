// export const AuthSignalServiceCode = `@Injectable({
//   providedIn: 'root',
// })
// export class AuthSignalService extends BaseAuthSignalService<JwtPayload> {
//   protected jwtStore = inject(JwtStorageService);
  
//   constructor() {
//     super();
//     this.initAsync();
//   }
  
//   protected override storeJwt(accessToken: string): Promise<void> {
//     this.jwtStore.storeJwt(accessToken);
//     return Promise.resolve();
//   }
  
//   protected override removeJwt(): Promise<void> {
//     this.jwtStore.removeJwt();
//     return Promise.resolve();
//   }
  
//   protected override getStoredToken(): Promise<string | null> {
//     return Promise.resolve(this.jwtStore.getStoredToken());
//   }
  
//   protected override logError(logData: LogErrorContext): void {
//     return console.log('AuthSignalService.logError', logData);
//   }
// }`;

export const UsageExampleCode = `// In your Angular component or guard
constructor(private auth: AuthSignalService) {}

// Check if user is logged in
if (this.auth.isLoggedIn()) {
  console.log('User is authenticated');
}

// Get user claims
const email = this.auth.email();
const roles = this.auth.roles();
const userName = this.auth.userName();

// Check specific roles
if (this.auth.hasRole('admin')) {
  console.log('User has admin privileges');
}

// Log in/out
this.auth.logIn(token);
this.auth.logOut();

// Use in templates with signals
@Component({
  template: \`
    @if (auth.isLoggedIn()) {
      <p>Welcome, {{ auth.userName() }}!</p>
      <p>Email: {{ auth.email() }}</p>
      <p>Roles: {{ auth.roles().join(', ') }}</p>
    } @else {
      <p>Please log in</p>
    }
  \`
})
export class MyComponent {
  constructor(protected auth: AuthSignalService) {}
}`;

export const GuardExampleCode = `
export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthSignalService);
  return auth.isReady$.pipe(
    filter(Boolean),
    take(1),
    map(() => auth.isLoggedIn())
  );
};

export const simpleAuthGuard: CanActivateFn = () => {
  const auth = inject(AuthSignalService);
  return auth.isLoggedIn();
};

// Using with specific roles
@Injectable()
export class AdminGuard implements CanActivate {
  private auth = inject(AuthSignalService);
  
  canActivate(): boolean {
    return this.auth.isLoggedIn() && this.auth.hasRole('admin');
  }
}`;
