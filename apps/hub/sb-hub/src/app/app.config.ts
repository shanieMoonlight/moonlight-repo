import { provideHttpClient } from '@angular/common/http';
import { ApplicationConfig, isDevMode, provideZoneChangeDetection, } from '@angular/core';
import { provideRouter, withInMemoryScrolling, withRouterConfig, } from '@angular/router';
import { provideServiceWorker } from '@angular/service-worker';
import { MaterialThemingSetup } from '@spider-baby/material-theming/config';
import { SeoSetup } from '@spider-baby/utils-seo/config';
import { HIGHLIGHT_OPTIONS } from 'ngx-highlightjs';
import { appRoutes } from '@sb-hub/app/entry-point';
import { SEO_CONFIG , THEME_CONFIG} from '@sb-hub/core-config';
import { provideClientHydration, withEventReplay, } from '@angular/platform-browser';

export const appConfig: ApplicationConfig = {
  providers: [
    provideClientHydration(withEventReplay()),
    provideHttpClient(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(appRoutes),
    provideRouter(
      appRoutes,
      // Use withInMemoryScrolling for scroll options
      withInMemoryScrolling({
        scrollPositionRestoration: 'top', // Or 'top'
      }),
      withRouterConfig({})
    ),
    MaterialThemingSetup.provideThemingModule(THEME_CONFIG),
    SeoSetup.provideSeoModule(SEO_CONFIG),
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
          json: () => import('highlight.js/lib/languages/json'),
        },
      },
    },
     provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000'
    }),
  ],
};
