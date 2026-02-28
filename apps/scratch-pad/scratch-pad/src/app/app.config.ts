import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';
import { provideThemeInitializer } from '@spider-baby/material-theming/init';
import { THEME_CONFIG } from './config/app-theme.config';

export const appConfig: ApplicationConfig = {
  providers: [provideBrowserGlobalErrorListeners(), provideRouter(appRoutes),
  provideThemeInitializer(THEME_CONFIG)],
};
