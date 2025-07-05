import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, isDevMode, provideZoneChangeDetection } from '@angular/core';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter, withComponentInputBinding, withInMemoryScrolling, withRouterConfig, withViewTransitions } from '@angular/router';
import { provideServiceWorker } from '@angular/service-worker';
import { MaterialThemingSetup } from '@spider-baby/material-theming/config';
import { MyIdIoSetup } from '@spider-baby/myid-io/config';
import { SeoSetup } from '@spider-baby/utils-seo/config';
import { HIGHLIGHT_OPTIONS } from 'ngx-highlightjs';
import { environment } from '../environments/environment';
import { appRoutes } from './app.routes';
import { appViewTransition } from './app.view-transitions';
import { THEME_CONFIG } from './config/app-theme.config';
import { SocialAuthSetup } from './config/oauth.config';
import { SEO_CONFIG } from './config/seo.config';
import { authHttpInterceptors } from './shared/auth/interceptors/auth-http-interceptors';

export const appConfig: ApplicationConfig = {
  providers: [
    provideClientHydration(
      withEventReplay()
    ),
    provideHttpClient(
      withFetch(),
      withInterceptors([
        ...authHttpInterceptors
      ])
    ),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideAnimationsAsync(),
    provideRouter(appRoutes,
       withComponentInputBinding(),
      // Use withInMemoryScrolling for scroll options
      withInMemoryScrolling({
        scrollPositionRestoration: 'enabled' // Or 'top'
      }),
      withRouterConfig({}),
      withViewTransitions(appViewTransition)),
    MaterialThemingSetup.provideThemingModule(THEME_CONFIG),
    SeoSetup.provideSeoModule(SEO_CONFIG),
    SocialAuthSetup.provideSocialLoginConfig(),
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
    },
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000'
    }),
    MyIdIoSetup.provideMyIdIo({ baseUrl: environment.identityServerUrl }),
  ],
};
