import { defaultThemeOption, ThemeOption } from "@moonlight/ng/theming/config";


//##################################################//

/**
 * Data for persisting theme and dark mode settings.
 * This data is used to store the current theme suffix, value, and dark mode status.
 */
export interface ThemeData {

  theme: ThemeOption
  isDarkMode: boolean

}//int


//##################################################//


export const ThemeDataUtils = {

  create(option: ThemeOption, isDark: boolean): ThemeData {
    return {
      isDarkMode: isDark,
      theme: option
    };
  },

  default(): ThemeData {
    return {
      isDarkMode: false,
      theme: defaultThemeOption
    };
  }

}


//##################################################//