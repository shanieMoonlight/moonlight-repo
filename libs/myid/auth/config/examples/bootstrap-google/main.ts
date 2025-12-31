import { bootstrapApplication } from '@angular/platform-browser';
import { Component, provideZoneChangeDetection } from '@angular/core';
import { MyIdOAuthBuilder } from '@spider-baby/myid-auth/config';

/**
 * Minimal standalone AppComponent used for this example.
 * Replace the `GOOGLE_CLIENT_ID` value with your real client id.
 */
@Component({
  selector: 'app-root',
  standalone: true,
  template: `<h1>MyId OAuth demo (Google only)</h1>`
})
class AppComponent {}

const GOOGLE_CLIENT_ID = 'YOUR_GOOGLE_CLIENT_ID_HERE';

bootstrapApplication(AppComponent, {
  providers: [
    // Configure only Google login at bootstrap using the builder API
    provideZoneChangeDetection(),...MyIdOAuthBuilder.create()
      .provideGoogleLogin(GOOGLE_CLIENT_ID)
      .buildProviders()
  ]
}).catch(err => console.error('Bootstrap error', err));

// To run this example in a real app, copy the providers array into your
// `main.ts` or `bootstrapApplication` call and replace the placeholder client
// id above with a real Google OAuth client id.
