# @spider-baby/auth-signal

A powerful Angular library that converts JWT tokens into reactive Angular signals, making it easy to build authentication-aware applications with automatic token expiry handling, type-safe claim access, and seamless integration with Angular's signal-based architecture.

## Features

- 🎯 **Reactive JWT Authentication** - Convert JWT tokens into Angular signals for reactive UI updates
- 🔒 **Type-Safe Claims Access** - Strongly typed JWT payload with extensible interfaces
- ⏰ **Automatic Token Expiry** - Built-in token expiry detection and handling with overflow protection
- 🔄 **Cross-Platform Storage** - Supports both synchronous and asynchronous storage (browser, Ionic, etc.)
- 🛡️ **Auth Guards & Role-Based Access** - Easy role and permission checking for route guards and UI components
- 🌐 **Universal Support** - Works in browser, Node.js, and mobile environments (Ionic/Capacitor)
- 🎨 **Multiple Implementations** - Ready-to-use implementations for Firebase, custom auth systems, and more

## Installation

```bash
npm install @spider-baby/auth-signal
```

## Quick Start

### 1. Basic Implementation

Create your own auth service by extending `BaseAuthSignalService`:

```typescript
import { Injectable, inject } from '@angular/core';
import { BaseAuthSignalService, JwtPayload, LogErrorContext } from '@spider-baby/auth-signal';
import { JwtStorageService } from '@spider-baby/auth-jwt-utils/storage';

@Injectable({
  providedIn: 'root',
})
export class MyAuthService extends BaseAuthSignalService<JwtPayload> {
  
  protected jwtStore = inject(JwtStorageService);

  constructor() {
    super();
    this.initAsync(); // Load stored token on startup
  }

  protected override async storeJwt(accessToken: string): Promise<void> {
    this.jwtStore.storeJwt(accessToken);
  }

  protected override async removeJwt(): Promise<void> {
    this.jwtStore.removeJwt();
  }

  protected override async getStoredToken(): Promise<string | null> {
    return this.jwtStore.getStoredToken();
  }

  protected override logError(logData: LogErrorContext): void {
    console.error('Auth Error:', logData);
  }
}
```

### 2. Use in Components

```typescript
@Component({
  template: `
    <div *ngIf="authService.isLoggedIn()">
      <h1>Welcome, {{authService.userName()}}!</h1>
      <p>Email: {{authService.email()}}</p>
      <p>Roles: {{authService.roles() | json}}</p>
      
      <div *ngIf="authService.hasRole('admin')">
        <p>Admin-only content</p>
      </div>
      
      <button (click)="authService.logOut()">Log Out</button>
    </div>
    
    <div *ngIf="authService.isNotLoggedIn()">
      <button (click)="login()">Log In</button>
    </div>
  `
})
export class MyComponent {
  constructor(public authService: MyAuthService) {}
  
  login() {
    // After successful authentication, call:
    this.authService.logIn('your-jwt-token-here');
  }
}
```

## Advanced Usage

### Custom JWT Payload

Extend the JWT payload interface to include your custom claims:

```typescript
// my-jwt-payload.ts
import { JwtPayload } from '@spider-baby/auth-signal';

export interface MyJwtPayload extends JwtPayload {
  "company.team_id": string;
  "company.team_role": string;
  "company.permissions": string[];
}

// my-auth.service.ts
export class MyAuthService extends BaseAuthSignalService<MyJwtPayload> {
  // Type-safe access to custom claims
  teamId = computed(() => this.getClaimValue('company.team_id'));
  teamRole = computed(() => this.getClaimValue('company.team_role'));
  permissions = computed(() => this.getClaimValue('company.permissions') || []);
  
  // Custom role checking
  hasPermission = (permission: string) => 
    this.permissions().includes(permission);
}
```

### Firebase Integration

Use the pre-built Firebase implementation:

```typescript
import { SbFirebaseSignalService } from '@spider-baby/auth-signal/firebase';

@Component({...})
export class MyComponent {
  constructor(private authService: SbFirebaseSignalService) {}
  
  ngOnInit() {
    // Access Firebase-specific properties
    console.log('Firebase UID:', this.authService.uid());
    console.log('Firebase Metadata:', this.authService.firebaseMetadata());
  }
}
```

## Available Signals

The `BaseAuthSignalService` provides these reactive signals:

### Authentication State
- `isLoggedIn()` - True if user is authenticated
- `isNotLoggedIn()` - True if user is not authenticated
- `accessToken()` - Current JWT token string

### User Information
- `userName()` - User's display name
- `userId()` - User ID (sub claim)
- `email()` - User's email address
- `emailVerified()` - Email verification status
- `firstName()` - Given name
- `lastName()` - Family name
- `picture()` - Profile picture URL

### Token Information
- `issuer()` - Token issuer (iss)
- `audience()` - Token audience (aud)
- `issuedAt()` - Token issued date
- `expiry()` - Token expiry date
- `notBefore()` - Token not-before date
- `authTime()` - Authentication time

### Roles & Permissions
- `roles()` - Array of user roles
- `hasRole(role: string)` - Check if user has specific role
- `hasClaimType(claim: string)` - Check if claim exists
- `hasClaim(claim: string, value: any)` - Check claim value
- `getClaimValue(claim: string)` - Get claim value

### Claims Access
- `allClaims()` - All claims as array of Claim objects
- `allClaimsRecord()` - All claims as key-value record
- `jwtPayload()` - Raw decoded JWT payload

## Built-in Implementations

### Default Auth Service
```typescript
import { SbAuthSignalService } from '@spider-baby/auth-signal/default';
```

### Firebase Auth Service  
```typescript
import { SbFirebaseSignalService } from '@spider-baby/auth-signal/firebase';
```

## Route Guards

Create authentication guards using the signals:

```typescript
import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';

export const authGuard: CanActivateFn = () => {
  const authService = inject(MyAuthService);
  return authService.isLoggedIn();
};

export const adminGuard: CanActivateFn = () => {
  const authService = inject(MyAuthService);
  return authService.isLoggedIn() && authService.hasRole('admin');
};
```

## Features

### Automatic Token Expiry
- Automatically detects when tokens expire and calls `onExpiry()`
- Handles JavaScript setTimeout overflow for long-lived tokens (>24 days)
- Configurable expiry behavior via `onExpiry()` override

### Cross-Platform Storage
- Abstract storage methods support both sync and async operations
- Works with localStorage, IndexedDB, Ionic Storage, etc.
- Fire-and-forget storage operations for better performance

### Type Safety
- Strongly typed JWT claims with TypeScript generics
- Extensible payload interfaces for custom claims
- IntelliSense support for all claim properties

## API Reference

### BaseAuthSignalService<JWT>

#### Abstract Methods (must be implemented)
```typescript
protected abstract storeJwt(accessToken: string): Promise<void>;
protected abstract removeJwt(): Promise<void>;
protected abstract getStoredToken(): Promise<string | null>;
protected abstract logError?(logData: LogErrorContext): void;
```

#### Public Methods
```typescript
logIn(accessToken: string): void;
logOut(): void;
hasRole(role: string): boolean;
hasClaimType<K extends keyof JWT>(claimType: K): boolean;
hasClaim<K extends keyof JWT>(claimType: K, value: unknown): boolean;
getClaimValue<K extends keyof JWT>(claimName: K): JWT[K] | undefined;
```

#### Protected Methods
```typescript
onExpiry(): void; // Override to customize expiry behavior
isTokenStillValid(): boolean;
```

## Requirements

- Angular 16+ (signals support)
- TypeScript 4.7+
- Peer dependencies:
  - `@angular/core`
  - `@angular/common`
  - `@spider-baby/dev-console`
  - `@spider-baby/utils-common`
  - `@spider-baby/auth-jwt-utils`

## Contributing

This library is part of the Spider Baby ecosystem. Please follow the contribution guidelines in the main repository.

## License

MIT License - see LICENSE file for details.
