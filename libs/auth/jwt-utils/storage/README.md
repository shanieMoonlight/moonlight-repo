# @spider-baby/auth-jwt-utils/storage

Secondary entry point of `@spider-baby/auth-jwt-utils`. It can be used by importing from `@spider-baby/auth-jwt-utils/storage`.

## What does this library do?

This package provides utilities for handling JWT (JSON Web Token) storage and HTTP authentication in Angular applications.

- **JwtStorageService**: A simple service for storing, retrieving, and deleting JWT tokens from `localStorage` (or a compatible storage abstraction). It provides a consistent API for managing authentication tokens on the client.

- **JWT Interceptor**: An Angular HTTP interceptor that automatically attaches the stored JWT to outgoing HTTP requests as an `Authorization` header. It uses `JwtStorageService` to retrieve the token and ensures authenticated requests are seamless throughout your app.

## Usage

Import the storage service or interceptor in your Angular app or library:

```typescript
import { JwtStorageService } from '@spider-baby/auth-jwt-utils/storage';
import { jwtInterceptorFn } from '@spider-baby/auth-jwt-utils/interceptor';
```

Register the interceptor in your providers:

```typescript
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { jwtInterceptorFn } from '@spider-baby/auth-jwt-utils/interceptor';

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(withInterceptors([jwtInterceptorFn]))
  ]
});
```

## Features
- Store and remove JWT tokens in browser storage
- Automatically attach JWTs to outgoing HTTP requests
- Designed for use in Angular and Nx monorepos

---

See the main `@spider-baby/auth-jwt-utils` README for more advanced usage and configuration options.
