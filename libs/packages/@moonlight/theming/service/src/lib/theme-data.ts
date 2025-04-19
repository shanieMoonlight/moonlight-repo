import { defaultThemeOption, ThemeOption } from "@moonlight/ng/theming/config";


//##################################################//


/**
 * Data for persisting theme and dark mode settings.
 * This data is used to store the current theme suffix, value, and dark mode status.
 */
export interface ThemeData {

  /** User defined themes */
  customThemes: ThemeOption[]
  /** The most recent theme option selected */
  currentTheme: ThemeOption

}//int


//##################################################//


export const ThemeDataUtils = {

  create(option: ThemeOption, customThemes: ThemeOption[] = []): ThemeData {
    return {
      currentTheme: option, 
      customThemes: customThemes,      
    };
  },

  default(): ThemeData {
    return {
      currentTheme: defaultThemeOption,
      customThemes: [], 
    };
  }

}


//##################################################//