//##################################################//

export const COLOR_TONES = [0, 4, 6, 10, 12, 17, 20, 22, 24, 25, 30, 35, 40, 50, 60, 70, 80, 87, 90, 92, 94, 95, 96, 98, 99, 100];
export const DEFAULT_PRIMARY = '#4682B4';
export const DEFAULT_SECONDARY = '#D2691E';
export const DEFAULT_TERTIARY = '#B58392';
export const DEFAULT_ERROR = '#B3261E'; // Material Design's standard error color
export const DEFAULT_NEUTRAL = '#F5F5F5'; // Light mode neutral color

/**
 * Will be appened to the theme class name.
 * Example class="theme-mysuffix0" 
 * And to find the theme in the theme map or dropdowns
*/
export type ThemeValue = string | number;

export const defaultThemeValue: ThemeValue = 'default';

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
   * @default false
   */
  fallbackIsDarkMode: boolean = false

  /**
   * The human-readable name of the theme displayed in the UI.
   * Used in theme selection components and settings panels.
   */
  label?: string

  /**
   * The unique identifier or value associated with this theme.
   * Used internally to reference and apply the theme.
   * @default defaultThemeValue
   */
  value: ThemeValue = defaultThemeValue

}

//##################################################//

export const defaultThemeOption: ThemeOption = {
  primaryColor: DEFAULT_PRIMARY,
  secondaryColor: DEFAULT_SECONDARY,
  tertiaryColor: DEFAULT_TERTIARY,
  errorColor: DEFAULT_ERROR,
  fallbackIsDarkMode: false,
  label: 'Default',
  value: 'default',
}

//##################################################//