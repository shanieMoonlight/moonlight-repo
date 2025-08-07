import { provideHttpClient, withFetch } from '@angular/common/http';
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideClientHydration, withEventReplay, } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { MaterialThemingSetup } from '@spider-baby/material-theming/config';
import { appRoutes } from './app.routes';
import { THEME_CONFIG } from './config/app-theme.config';

export const appConfig: ApplicationConfig = {
  providers: [
    provideClientHydration(withEventReplay()),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(appRoutes),
    provideHttpClient(withFetch()),
    MaterialThemingSetup.provideTheming(THEME_CONFIG)
  ],
};
