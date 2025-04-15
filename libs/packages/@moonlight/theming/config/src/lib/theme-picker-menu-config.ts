
// import { ThemeData, ThemeDataUtils, ThemeSuffix } from './theme-data';
// import { SsrLocalStorage } from '../../../../ssr/storage/src/lib/ssr-local-storage.service';
// import { ThemeConfig, ThemeConfigService } from '../../../config/src/lib/theme-picker-menu-config';

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
  defaultMode: ThemeMode = 'light'

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
    defaultMode?: ThemeMode): ThemeConfig{

    const config = new ThemeConfig(themeOptions)

    if (!!darkModeClass)
      config.darkModeClass = darkModeClass

    if (!!lightModeClass)
      config.lightModeClass = lightModeClass

    if (!!themeClassPrefix)
      config.themeClassPrefix = themeClassPrefix
    
    if (!!defaultMode)
      config.defaultMode = defaultMode
    
    return config
    
  }



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
