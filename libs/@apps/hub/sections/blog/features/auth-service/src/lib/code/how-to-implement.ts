export const HowToImplementCode = `// Step 1: Create your custom auth service
import { Injectable, inject } from '@angular/core';
import { BaseAuthSignalService, JwtPayload } from '@spider-baby/auth-signal';
import { JwtStorageService } from '@your-package/jwt-storage';

@Injectable({
  providedIn: 'root',
})
export class MyAuthService extends BaseAuthSignalService<JwtPayload> {
  private jwtStore = inject(JwtStorageService);
  
  constructor() {
    super();
    this.initAsync(); // Initialize the service
  }
  
  // Implement required abstract methods
  protected override storeJwt(accessToken: string): Promise<void> {
    this.jwtStore.storeJwt(accessToken);
    return Promise.resolve();
  }
  
  protected override removeJwt(): Promise<void> {
    this.jwtStore.removeJwt();
    return Promise.resolve();
  }
  
  protected override getStoredToken(): Promise<string | null> {
    return Promise.resolve(this.jwtStore.getStoredToken());
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
