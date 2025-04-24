import { EnvironmentProviders, Provider } from "@angular/core"
import { ThemingConfig, ThemeConfigService } from "./theming-config"

/**
 * Utility class for configuring theme providers in Angular applications.
 * 
 * Provides methods for setting up the necessary providers to use the theming system.
 * 
 * @example
 * ```typescript
 * // In app.config.ts
 * import { ThemeAndModeSetup } from '@moonlight/material-theming/config';
 * 
 * export const appConfig: ApplicationConfig = {
 *   providers: [
 *     // Use default theme configuration
 *     ...ThemeAndModeSetup.getThemeProviders(),
 *     
 *     // Or with custom configuration
 *     ...ThemeAndModeSetup.getThemeProviders(ThemeConfig.create([
 *       { value: 'custom-theme', label: 'Custom', primaryColor: '#ff0000' }
 *     ]))
 *   ]
 * };
 * ```
 */
export class ThemeAndModeSetup {

    /**
     * Gets an array of providers needed to set up the theming system.
     * 
     * @param config Optional custom theme configuration. Defaults to a basic 
     *               configuration with standard themes if not provided.
     * @returns An array of providers to include in an application's provider array.
     */
    static provideThemingModule = (config: ThemingConfig = ThemingConfig.create())
        : (Provider | EnvironmentProviders)[] =>
        {            
            return [
                {
                    provide: ThemeConfigService,
                    useValue: config,
                },
            ]
        }

} //Cls