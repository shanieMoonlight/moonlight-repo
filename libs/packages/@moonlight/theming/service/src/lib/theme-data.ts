import { defaultThemeOption, ThemeOption } from "@moonlight/ng/theming/config";


//##################################################//


/**
 * Data for persisting theme and dark mode settings.
 * This data is used to store the current theme suffix, value, and dark mode status.
 */
export interface ThemeData {

  /** Hardcoded system themes */
  themes: ThemeOption[]
  /** User defined themes */
  customThemes: ThemeOption[]
  /** The most recent dark moded setting */
  currentDarkMode: boolean
  /** The most recent theme option selected */
  currentTheme: ThemeOption | null

}//int


//##################################################//


export const ThemeDataUtils = {

  create(option: ThemeOption, isDark: boolean): ThemeData {
    return {
      currentDarkMode: isDark,
      themes: [option],
      currentTheme: option, 
      customThemes: [],      
    };
  },

  default(): ThemeData {
    return {
      currentDarkMode: false,
      themes: [defaultThemeOption],
      currentTheme: defaultThemeOption,
      customThemes: [], 
    };
  }

}


//##################################################//