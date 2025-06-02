import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';
import { provideClientHydration, withEventReplay, } from '@angular/platform-browser';
import { SeoSetup } from '@spider-baby/utils-seo/config';
import { SEO_CONFIG } from './config/seo.config';
import { MaterialThemingSetup } from '@spider-baby/material-theming/config';
import { HIGHLIGHT_OPTIONS } from 'ngx-highlightjs';
import { THEME_CONFIG } from './config/app-theme.config';

export const appConfig: ApplicationConfig = {
  providers: [
    provideClientHydration(withEventReplay()),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(appRoutes),
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
          json: () => import('highlight.js/lib/languages/json'),          
          csharp: () => import('highlight.js/lib/languages/csharp'),
          yaml: () => import('highlight.js/lib/languages/yaml')
        }
      }
    }
  ],
};
