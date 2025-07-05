# @spider-baby/auth-signal

A modern, type-safe, and extensible Angular authentication foundation using signals and generics for JWT/OIDC authentication.

## Features

- **Type-safe JWT claim access** with autocompletion and generics
- **Angular signals** for all claims and authentication state
- **Extensible**: Easily add custom claims and business logic
- **Cross-platform**: Works in browser and server environments
- **Idiomatic Angular**: Uses computed, effect, and signal
- **Easy to integrate**: Compose with your own storage, guards, and UI

## Installation

```sh
npm install @spider-baby/auth-signal
```

## Usage

### 1. Extend the Base Service with Your JWT Payload

Create your own JWT payload interface extending the provided `JwtPayload`:

```typescript
// myapp-jwt-payload.ts
import { JwtPayload } from '@spider-baby/auth-signal';

export interface MyCustomJwtPayload extends JwtPayload {
  'myapp.team_id': string;
  'myapp.team_type': string;
  'myapp.team_position': number;

}
```

### 2. Create a Custom Auth Service

Extend `BaseAuthSignalService` with your payload type. Implement storage and error logging as needed:

```typescript
import { Injectable, effect, inject } from '@angular/core';
import { JwtStorageService } from './jwt-storage.service';
import { BaseAuthSignalService, LogErrorContext } from '@spider-baby/auth-signal';
import { MyCustomJwtPayload } from './myapp-jwt-payload';

@Injectable({ providedIn: 'root' })
export class MyAppAuthService extends BaseAuthSignalService<MyCustomJwtPayload> {

    protected jwtStore = inject(JwtStorageService);


    teamId = computed(() => this.getClaimValue('myapp.team_id') ?? '');
    position = computed(() => this.getTeamPositionValue());
    isSpr = computed(() => this.hasTeamTypeClaim('super'));
    isMntc = computed(() => this.hasTeamTypeClaim('maintenance'));
    isCus = computed(() => this.hasTeamTypeClaim('customer'));


    constructor() {
        super();
        if (!this.isPlatformBrowser()) 
            return;

        const storedToken = this.jwtStore.getStoredToken();
        if (storedToken) 
            this.logIn(storedToken);

        effect(() => {
            const accessToken = this.accessToken();
            if (!accessToken) 
            this.jwtStore.removeJwt();
            else 
            this.jwtStore.storeJwt(accessToken);
        });
    }

    protected override storeJwt = (accessToken: string): void =>
        this.jwtStore.storeJwt(accessToken);

    protected override logError = (logData: LogErrorContext): void =>
        console.error('Auth error:', logData);


    protected hasTeamTypeClaim = (type: TeamType): boolean =>
        this.hasClaim('myapp.team_type', type)

    protected getTeamPositionValue() {
        const posStr = this.getClaimValue("myapp.team_position") ?? '';
        const posNum = Number(posStr);
        return Number.isNaN(posNum) ? -1 : posNum;
    }
}


```

## API Highlights

- `accessToken`: Signal for the current JWT access token
- `decodedToken`: Signal for the decoded JWT payload
- `allClaims`: Signal for all claims as an array
- `roles`: Signal for the user's roles (always a string array)
- `isLoggedIn`, `isNotLoggedIn`: Signals for authentication state
- `getClaimValue<K extends keyof JWT>(key: K)`: Type-safe claim access
- `hasClaimType<K extends keyof JWT>(key: K)`: Type-safe claim existence check
- `hasClaim<K extends keyof JWT>(key: K, value: unknown)`: Type-safe claim value check

## Example: Using in a Component

```typescript
@Component({
  // ...
})
export class MyComponent {
  auth = inject(MyAppAuthService);
 
 

  // Signals for template binding
  isLoggedIn = this.auth.isLoggedIn;
  userName = this.auth.userName;
  roles = this.auth.roles;

  // Example: computed signal for admin role
  isAdmin = computed(() => this.roles().includes('admin'));

  toggle() {
    if (this.isLoggedIn()) {
      this.auth.logOut();
    } else {
      // Your login logic here
    }
  }
 
}



<!-- Show login/logout button based on authentication state -->
<button (click)="toggle()">
  {{ isLoggedIn() ? 'Logout' : 'Login' }}
</button>

@if(isLoggedIn()) {
  <div>
    Welcome, {{ userName() }}!
  </div>
}

@if(isAdmin()) {
  <button>
    Admin Panel
  </button>
}
```

## License

MIT

---

**@spider-baby/auth-signal** is designed for modern Angular apps that want robust, type-safe, and extensible authentication using signals. Extend, compose, and build your own auth logic with confidence!
