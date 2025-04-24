import { EnvironmentProviders, inject, provideAppInitializer, Provider } from "@angular/core";
import { MaterialThemingSetup, ThemingConfig } from "@moonlight/material-theming/config";
import { ThemeService } from '@moonlight/material-theming/service'; // Adjust path as needed


// Export a provider function for use in app.config.ts or bootstrapApplication
function _provideThemeInitializer() {

  return provideAppInitializer(() => {
    // inject ThemeService at app startup
    const themeService = inject(ThemeService);
    themeService.refreshTheme?.();
  })

}

/**
 * Sets up Moonlight Material Theming in one line.
 * 
 * @param config Optional theme config. If omitted, defaults will be used.
 * @returns Providers for both config and theme initialization.
 * 
 * ⚠️ Only use this if you are NOT using any Moonlight theming components or injecting ThemeService directly.
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
