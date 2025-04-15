/**
 * will be appened to the theme class name.
 * Example class="theme-mysuffix0" 
 */
export type ThemeSuffix = string | number;

//##################################################//

export interface ThemeData {

  suffix: ThemeSuffix
  isDarkMode: boolean

}//int


//##################################################//


export const ThemeDataUtils = {

  create(idx: string | number, isDark: boolean): ThemeData {
    return { suffix: idx, isDarkMode: isDark };
  },

  default(): ThemeData {
    return { suffix: 0, isDarkMode: false };
  }

}


//##################################################//