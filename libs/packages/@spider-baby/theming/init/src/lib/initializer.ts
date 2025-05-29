import { EnvironmentProviders, Provider, APP_INITIALIZER } from "@angular/core";
import { MaterialThemingSetup, ThemingConfig } from "@spider-baby/material-theming/config";
import { ThemeService } from '@spider-baby/material-theming/service'; // Adjust path as needed

// Export a provider function for use in app.config.ts or bootstrapApplication
function _provideThemeInitializer(): Provider {
  // Use APP_INITIALIZER for compatibility with Angular 17+
  // Note: APP_INITIALIZER is deprecated in Angular 19+ in favor of provideAppInitializer
  return {
    provide: APP_INITIALIZER,
    useFactory: (themeService: ThemeService) => {
      return () => {
        // Initialize ThemeService at app startup
        themeService.refreshTheme?.();
      };
    },
    deps: [ThemeService],
    multi: true,
  };
}

/**
 * Sets up SpiderBaby Material Theming in one line.
 * 
 * @param config Optional theme config. If omitted, defaults will be used.
 * @returns Providers for both config and theme initialization.
 * 
 * ⚠️ Only use this if you are NOT using any SpiderBaby theming components or injecting ThemeService directly.
 * This will eagerly include all theming services in your bundle, which may increase bundle size.
 * For most apps, using a theming component or ThemeService using MaterialThemingSetup.provideThemingModule(config) 
 * is sufficient and more efficient.
 */
export function provideThemeInitializer(config?: ThemingConfig): (Provider | EnvironmentProviders)[] {
  return [
    MaterialThemingSetup.provideThemingModule(config),
    _provideThemeInitializer()
  ]
}
