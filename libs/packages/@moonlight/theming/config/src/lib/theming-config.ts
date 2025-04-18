
import { InjectionToken } from '@angular/core';
import { DARK_MODE_CLASS, DEFAULT_COLOR_TONES, LIGHT_MODE_CLASS, THEME_CLASS_PREFIX } from './constants';
import { defaultPresetSelectorThemes, ThemeOption } from './theme-option.model';

//##################################################//

export const ThemeConfigService = new InjectionToken<ThemeConfig>(
  'ThemeConfig',
  {
    factory: () => ThemeConfig.Create()
  }
)

export type ThemeMode = 'light' | 'dark';

//##################################################//

export class ThemeConfig {

  themeOptions: ThemeOption[] = []
  darkModeClass = DARK_MODE_CLASS
  lightModeClass = LIGHT_MODE_CLASS
  themeClassPrefix = THEME_CLASS_PREFIX
  defaultMode: ThemeMode = 'light'
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
  static Create(
    themeOptions?: ThemeOption[],
    darkModeClass?: string,
    lightModeClass?: string,
    themeClassPrefix?: string,
    defaultMode?: ThemeMode,
    customColorTones?: number[]): ThemeConfig {

    const config = new ThemeConfig(themeOptions)

    if (!!darkModeClass)
      config.darkModeClass = darkModeClass

    if (!!lightModeClass)
      config.lightModeClass = lightModeClass

    if (!!themeClassPrefix)
      config.themeClassPrefix = themeClassPrefix

    if (!!defaultMode)
      config.defaultMode = defaultMode

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

  //------------------------------//   

} //Cls
