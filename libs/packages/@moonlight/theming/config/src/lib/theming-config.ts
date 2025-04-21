
import { InjectionToken } from '@angular/core';
import { DARK_MODE_CLASS, DEFAULT_COLOR_TONES, LIGHT_MODE_CLASS, THEME_CLASS_PREFIX } from './constants';
import { defaultPresetSelectorThemes, ThemeOption } from './theme-option.model';

//##################################################//

export const ThemeConfigService = new InjectionToken<ThemeConfig>(
  'ThemeConfig',
  {
    factory: () => ThemeConfig.create()
  }
)

export type ThemeMode = 'light' | 'dark';

//##################################################//

/**
 * Configuration settings for the theming system.
 * 
 * ThemeConfig provides centralized configuration for theme options, default values,
 * CSS class names, and other theme-related settings. It's typically provided at the
 * application level and consumed by various theming services.
 * 
 * @example
 * ```typescript
 * // Basic configuration with default themes
 * const config = ThemeConfig.create();
 * 
 * // Custom configuration with specific themes
 * const customConfig = ThemeConfig.create([
 *   ThemeOption.create({ value: 'custom-theme', label: 'Custom', primaryColor: '#ff0000' })
 * ]);
 * ```
 */
export class ThemeConfig {

  themeOptions: ThemeOption[] = []
  darkModeClass = DARK_MODE_CLASS
  lightModeClass = LIGHT_MODE_CLASS
  themeClassPrefix = THEME_CLASS_PREFIX
  defaultDarkMode: ThemeMode = 'light'
  colorTones: number[] = DEFAULT_COLOR_TONES
  /**Used in theme-selector */
  presetSelectorThemes: ThemeOption[] = defaultPresetSelectorThemes

  //- - - - - - - - - - - - - - - //

  /**
   * Set paramater to null to use default values.
   * Enter no paramaters to use default values on everything
   * @param themeOptions Different themes to choose from - Default = all themes
   */
  private constructor(themeOptions?: ThemeOption[]) {
    this.themeOptions = themeOptions ?? []
  }

  //------------------------------//

  /**
   * Create new instance of BgAngledSplitConfig
   * @param colorLhs Color for Left Hand Side of background - default colorPrimary
   * @param colorRhs Color for Right Hand Side of background - default colorPrimaryLight
   */
  static create(
    themeOptions?: ThemeOption[],
    darkModeClass?: string,
    lightModeClass?: string,
    themeClassPrefix?: string,
    defaultMode?: ThemeMode,
    customColorTones?: number[]): ThemeConfig {

    const config = new ThemeConfig(themeOptions)

    if (darkModeClass)
      config.darkModeClass = darkModeClass

    if (lightModeClass)
      config.lightModeClass = lightModeClass

    if (themeClassPrefix)
      config.themeClassPrefix = themeClassPrefix

    if (defaultMode)
      config.defaultDarkMode = defaultMode

    if (customColorTones?.length)
      config.colorTones = customColorTones;

    return config
  }

  //------------------------------//    

  setDarkModeClass(className: string) {
    this.darkModeClass = className
    return this
  }

  //- - - - - - - - - - - - - - - //     

  setLightModeClass(className: string) {
    this.lightModeClass = className
    return this
  }

  //- - - - - - - - - - - - - - - //   

  setThemeClassPrefix(prefix: string) {
    this.themeClassPrefix = prefix
    return this
  }

  //- - - - - - - - - - - - - - - //   

  setSelectorPresetThemes(presetThemes: ThemeOption[]) {
    this.presetSelectorThemes = presetThemes
    return this
  }

  //------------------------------//   

} //Cls
