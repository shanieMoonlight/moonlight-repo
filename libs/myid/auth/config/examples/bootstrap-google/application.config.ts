import { ApplicationConfig } from '@angular/core';
import { MyIdOAuthBuilder } from '@spider-baby/myid-auth/config';

/**
 * Example `ApplicationConfig` demonstrating how to include the
 * `MyIdOAuthBuilder` output in an application's `providers` array.
 *
 * This file can be imported directly into a `bootstrapApplication` call
 * (spread the `providers` or pass the config object). Replace the
 * placeholder client id with a real one for a working demo.
 */
export const MYID_APP_CONFIG: ApplicationConfig = {
  providers: [
    // Configure Google login at app bootstrap using the builder API
    ...MyIdOAuthBuilder.create()
      .provideGoogleLogin('YOUR_GOOGLE_CLIENT_ID_HERE')
      .buildProviders()
  ]
};

// Usage example (in your `main.ts`):
// import { bootstrapApplication } from '@angular/platform-browser';
// import { AppComponent } from './app/app.component';
// import { MYID_APP_CONFIG } from './libs/myid/auth/config/examples/bootstrap-google/application.config';
//
// bootstrapApplication(AppComponent, MYID_APP_CONFIG).catch(console.error);
