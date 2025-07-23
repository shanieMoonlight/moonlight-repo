import { provideHttpClient, withFetch } from '@angular/common/http';
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideClientHydration, withEventReplay, } from '@angular/platform-browser';
import { provideRouter, withInMemoryScrolling, withRouterConfig } from '@angular/router';
import { MaterialThemingSetup } from '@spider-baby/material-theming/config';
import { HIGHLIGHT_OPTIONS } from 'ngx-highlightjs';
import { appRoutes } from './app.routes';
import { THEME_CONFIG } from './config/app-theme.config';
import { FirebaseProviders } from './firebase/firebase-init';
import { SeoSetup } from '@spider-baby/utils-seo/config';
import { SEO_CONFIG } from './config/seo.config';
import { provideFirebaseApp } from '@angular/fire/app';
import { initializeApp } from 'firebase/app';
import { environment } from '../environments/environment';
import { provideAnalytics, getAnalytics } from '@angular/fire/analytics';

const app = initializeApp(environment.firebaseConfig)
// const analytics = getAnalytics(app);


export const appConfig: ApplicationConfig = {
  providers: [
    provideClientHydration(withEventReplay()),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(appRoutes,
      // Use withInMemoryScrolling for scroll options
      withInMemoryScrolling({
        scrollPositionRestoration: 'enabled' // Or 'top'
      }),
      withRouterConfig({})),
    provideHttpClient(withFetch()),
    ...FirebaseProviders.all,
    // provideFirebaseApp(() => app), // Initialize Firebase App
    // provideAnalytics((injector) => getAnalytics(injector.get(provideFirebaseApp))),
    SeoSetup.provideSeoModule(SEO_CONFIG),
    MaterialThemingSetup.provideThemingModule(THEME_CONFIG),
    {
      provide: HIGHLIGHT_OPTIONS,
      useValue: {
        coreLibraryLoader: () => import('highlight.js/lib/core'),
        lineNumbers: true,
        languages: {
          typescript: () => import('highlight.js/lib/languages/typescript'),
          xml: () => import('highlight.js/lib/languages/xml'),
          html: () => import('highlight.js/lib/languages/xml'),
          scss: () => import('highlight.js/lib/languages/scss'),
          css: () => import('highlight.js/lib/languages/css'),
          json: () => import('highlight.js/lib/languages/json')
        }
      }
    }
  ],
};
// MAT_THEME_