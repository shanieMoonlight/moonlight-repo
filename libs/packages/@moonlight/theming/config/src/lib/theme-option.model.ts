import { DEFAULT_COLOR_PRIMARY, DEFAULT_THEME_LABEL, DEFAULT_COLOR_ERROR, DEFAULT_COLOR_NEUTRAL, DEFAULT_COLOR_SECONDARY, DEFAULT_COLOR_TERTIARY, DEFAULT_THEME_VALUE } from "./constants";

//##################################################//

/**
 * Will be appened to the theme class name.
 * Example class="theme-mysuffix0" 
 * And to find the theme in the theme map or dropdowns
*/
export type ThemeValue = string | number;

// export const defaultThemeValue: ThemeValue = 'default';

//##################################################//

/**
 * Represents the configuration options for a theme.
 * 
 * This class defines the properties that can be set to customize a theme's appearance
 * and behavior within the application.
 */
export class ThemeOption {

  /**
   * The primary color of the theme.
   * Used for styling prominent UI elements and establishing the main color identity.
   */
  primaryColor?: string

  /**
   * The secondary color of the theme.
   * Used for styling supporting UI elements and providing contrast to the primary color.
   */
  secondaryColor?: string

  /**
   * The tertiary color of the theme.
   * Used for additional accent elements and further visual hierarchy in the UI.
   */
  tertiaryColor?: string

  /**
   * The color used to indicate errors or destructive actions.
   * Provides consistent error state visualization across the theme.
   */
  errorColor?: string

  /**
   * Determines if dark mode should be used by default.
   * When true, the theme initializes in dark mode; when false, it initializes in light mode.
   * User may manually change dark mode later.
   * @default false
   */
  fallbackIsDarkMode: boolean = false

  /**
   * The human-readable name of the theme displayed in the UI.
   * Used in theme selection components and settings panels.
   */
  label?: string = DEFAULT_THEME_LABEL

  /**
   * The unique identifier or value associated with this theme.
   * Used internally to reference and apply the theme.
   * @default DEFAULT_THEME_VALUE
   */
  value: ThemeValue = DEFAULT_THEME_VALUE

}

//##################################################//

export const defaultThemeOption: ThemeOption = {
  primaryColor: DEFAULT_COLOR_PRIMARY,
  secondaryColor: DEFAULT_COLOR_SECONDARY,
  tertiaryColor: DEFAULT_COLOR_TERTIARY,
  errorColor: DEFAULT_COLOR_ERROR,
  fallbackIsDarkMode: false,
  value: DEFAULT_THEME_VALUE,
  label: DEFAULT_THEME_LABEL,
}

//##################################################//