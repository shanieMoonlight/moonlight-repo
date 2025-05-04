import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withInMemoryScrolling, withRouterConfig } from '@angular/router';
import { appRoutes } from './app.routes';
import { provideClientHydration, withEventReplay, } from '@angular/platform-browser';
import { MaterialThemingSetup } from '@spider-baby/material-theming/config';
import { THEME_CONFIG } from './config/app-theme.config';
import { HIGHLIGHT_OPTIONS } from 'ngx-highlightjs';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { FirebaseProviders } from './firebase/firebase-init';

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
