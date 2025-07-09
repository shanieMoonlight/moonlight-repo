export const HowToImplementCode = `

import { Injectable, inject } from '@angular/core';
import { BaseAuthSignalService, JwtPayload } from '@spider-baby/auth-signal';
import { SsrLocalStorage } from '@spider-baby/ssr-storage';

//###########################//

/** Storage Key*/
export const JWT_AUTH_KEY = 'spider_baby_auth_key'

//###########################//

@Injectable({
  providedIn: 'root',
})
export class MyAuthService extends BaseAuthSignalService<JwtPayload> {
  protected _localStorage = inject(SsrLocalStorage)
  
  constructor() {
    super();
    this.initAsync(); // Initialize the service
  }
  
  // Implement required abstract methods
  protected override storeJwt(accessToken: string): Promise<void> {
    this._localStorage.setItem(JWT_AUTH_KEY, accessToken)  ;
    return Promise.resolve();
  }
  
  protected override removeJwt(): Promise<void> {
    this._localStorage.removeItem(JWT_AUTH_KEY);
    return Promise.resolve();
  }
  
  protected override getStoredToken(): Promise<string | null> {
    return Promise.resolve(this._localStorage.getItem(JWT_AUTH_KEY));
  }
  
  // Optional: Implement error logging
  protected override logError(logData: LogErrorContext): void {
    console.error('Auth Error:', logData);
    // Send to your logging service
  }
}`;

export const InstallationCode = `# Install the package
npm install @spider-baby/auth-signal

# Install peer dependencies if needed
npm install @angular/core rxjs`;

export const SetupCode = `// app.config.ts or main.ts
import { ApplicationConfig } from '@angular/core';
import { AuthSignalService } from './auth/auth-signal.service';

export const appConfig: ApplicationConfig = {
  providers: [
    // ... other providers
    AuthSignalService,
  ],
};`;
