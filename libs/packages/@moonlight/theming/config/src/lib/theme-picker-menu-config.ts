import { InjectionToken } from '@angular/core';
import { ThemeOption } from './theme-option.model';

//===================================================================//

export const ThemeConfigService = new InjectionToken<ThemeConfig>('ThemeConfig');
export type ThemeMode = 'light' | 'dark';

//===================================================================//

export class ThemeConfig {


  themeOptions: ThemeOption[] = []
  darkModeClass = 'ml-mode-dark'
  lightModeClass = 'ml-mode-light'
  themeClassPrefix = 'theme'
  defaultMode: ThemeMode = 'dark'

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
  static Create = (themeOptions?: ThemeOption[]): ThemeConfig =>
    new ThemeConfig(themeOptions)

  //------------------------------//    

  setDarkModeClass(className: string) {
    this.darkModeClass = className
    return this
  }

  //------------------------------//     

  setLightModeClass(className: string) {
    this.lightModeClass = className
    return this
  }

  //------------------------------//   

  setThemeClassPrefix(prefix: string) {
    this.themeClassPrefix = prefix
    return this
  }

} //Cls
