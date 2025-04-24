import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter } from '@angular/router';
import { ThemeAndModeSetup } from '@moonlight/material-theming/config';
import { appRoutes } from './app.routes';
import { THEME_CONFIG } from './config/app-theme.config';

export const appConfig: ApplicationConfig = {
  providers: [
    // provideClientHydration(withEventReplay()),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(appRoutes),
    provideAnimationsAsync(), // Add animation providers
    ThemeAndModeSetup.provideThemingModule(THEME_CONFIG)
  ],
};
