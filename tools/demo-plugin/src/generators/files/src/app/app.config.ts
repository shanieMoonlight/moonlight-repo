import { provideHttpClient } from '@angular/common/http';
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideRouter, withInMemoryScrolling, withRouterConfig } from '@angular/router';
import { MaterialThemingSetup } from '@spider-baby/material-theming/config';
import { SeoSetup } from '@spider-baby/utils-seo/config';
import { HIGHLIGHT_OPTIONS } from 'ngx-highlightjs';
import { appRoutes } from './app.routes';
import { THEME_CONFIG } from './config/app-theme.config';
import { SEO_CONFIG } from './config/seo.config';

export const appConfig: ApplicationConfig = {
  providers: [
    provideClientHydration(
      withEventReplay()
    ),
    provideHttpClient(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(appRoutes),
    provideRouter(appRoutes,
      // Use withInMemoryScrolling for scroll options
      withInMemoryScrolling({
        scrollPositionRestoration: 'enabled' // Or 'top'
      }),
      withRouterConfig({})),
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
          json: () => import('highlight.js/lib/languages/json')
        }
      }
    }
  ],
};
