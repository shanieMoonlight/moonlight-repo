import { defaultThemeOption, ThemeOption } from "@moonlight/material-theming/config";

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
}

/**
 * Utility functions for creating and working with ThemeData instances.
 * Provides factory methods for creating properly structured theme data.
 */
export const ThemeDataUtils = {
  /**
   * Creates a ThemeData object with the specified current theme and custom themes.
   * 
   * @param option The theme to set as current
   * @param customThemes Optional array of user-defined custom themes
   * @returns A new ThemeData object
   */
  create(option: ThemeOption, customThemes: ThemeOption[] = []): ThemeData {
    return {
      currentTheme: option, 
      customThemes: customThemes,      
    };
  },

  /**
   * Creates a ThemeData object with default values.
   * Uses the default theme option and an empty array of custom themes.
   * 
   * @returns A new ThemeData object with default values
   */
  default(): ThemeData {
    return {
      currentTheme: defaultThemeOption,
      customThemes: [], 
    };
  }
}

//##################################################//