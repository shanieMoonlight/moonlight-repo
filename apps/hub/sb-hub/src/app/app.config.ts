import { provideHttpClient, withFetch } from '@angular/common/http';
import { ApplicationConfig, isDevMode, provideZoneChangeDetection, } from '@angular/core';
import { provideClientHydration, withEventReplay, } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter, withInMemoryScrolling, withRouterConfig, withViewTransitions, } from '@angular/router';
import { provideServiceWorker } from '@angular/service-worker';
import { appRoutes } from '@sb-hub/app/entry-point';
import { SEO_CONFIG, THEME_CONFIG } from '@sb-hub/core-config';
import { provideAppErrorHandler } from '@sb-hub/core-config/error-handling';
import { MaterialThemingSetup } from '@spider-baby/material-theming/config';
import { matToastConfig, ToastSetup } from '@spider-baby/ui-toast/setup';
import { SeoSetup } from '@spider-baby/utils-seo/config';
import { HIGHLIGHT_OPTIONS } from 'ngx-highlightjs';
import { appViewTransition } from './app.view-transitions';

export const appConfig: ApplicationConfig = {
  providers: [
    provideClientHydration(withEventReplay()),
    provideHttpClient(withFetch()),
    provideAnimationsAsync(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(appRoutes,
      withViewTransitions(appViewTransition)
    ),
    provideRouter(
      appRoutes,
      withInMemoryScrolling({
        scrollPositionRestoration: 'top',
      }),
      withRouterConfig({})
    ),
    MaterialThemingSetup.provideTheming(THEME_CONFIG),
    //  provideThemeInitializer(THEME_CONFIG),
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
          csharp: () => import('highlight.js/lib/languages/csharp'),
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
    provideAppErrorHandler(),
    ToastSetup.getProviders(matToastConfig)
    //   .setPositionConfig(ToastPositionConfig.Create(undefined, undefined, undefined, undefined)))
  ],
};
