import { DEFAULT_COLOR_ERROR, DEFAULT_COLOR_PRIMARY, DEFAULT_COLOR_SECONDARY, DEFAULT_COLOR_TERTIARY, DEFAULT_THEME_LABEL, DEFAULT_THEME_VALUE } from "./constants";

//##################################################//

/**
 * Will be appened to the theme class name.
 * Example class="theme-mysuffix0" 
 * And to find the theme in the theme map or dropdowns
*/
export type ThemeValue = string | number;

export type DarkModeType = true | false | 'system';

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
  fallbackIsDarkMode = false

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


export const defaultPresetSelectorThemes: ThemeOption[] = [
  defaultThemeOption,
  {
    label: 'Halloween',
    value: 'halloween',
    primaryColor: '#FF7518',
    secondaryColor: '#31004a',
    tertiaryColor: '#556B2F',
    errorColor: DEFAULT_COLOR_ERROR, // Add error color
    fallbackIsDarkMode: true // Add fallback mode
  },
  {
    label: 'Ocean',
    value: 'ocean',
    primaryColor: '#006C7F',
    secondaryColor: '#526773',
    tertiaryColor: '#6C939B',
    errorColor: DEFAULT_COLOR_ERROR,
    fallbackIsDarkMode: false
  },
  {
    label: 'Xmas',
    value: 'xmas',
    primaryColor: '#C8102E',
    secondaryColor: '#006747',
    tertiaryColor: '#FFD700',
    errorColor: DEFAULT_COLOR_ERROR,
    fallbackIsDarkMode: true
  },
  {
    label: 'Sugar',
    value: 'sugar',
    primaryColor: '#1be7ff',
    secondaryColor: '#f61067',
    tertiaryColor: '#e4ff1a',
    errorColor: DEFAULT_COLOR_ERROR,
    fallbackIsDarkMode: false
  },
  {
    label: 'Sunset',
    value: 'sunset',
    primaryColor: '#FF4500',
    secondaryColor: '#FFD700',
    tertiaryColor: '#FF69B4',
    errorColor: DEFAULT_COLOR_ERROR,
    fallbackIsDarkMode: false
  },
  {
    label: 'Starry Night',
    value: 'starry-night',
    primaryColor: '#1E3A8A', // Deep blue
    secondaryColor: '#F0C420', // Bright yellow star
    tertiaryColor: '#8496B0', // Misty blue
    errorColor: DEFAULT_COLOR_ERROR,
    fallbackIsDarkMode: true
  },
  {
    label: 'Dark Raspberry',
    value: 'dark-raspberry',
    primaryColor: '#46000D',
    secondaryColor: '#5E0009',
    tertiaryColor: '#720137',
    errorColor: DEFAULT_COLOR_ERROR,
    fallbackIsDarkMode: true
  },
  {
    label: 'Coffee Beans',
    value: 'coffee-beans',
    primaryColor: '#48312B',
    secondaryColor: '#603A28',
    tertiaryColor: '#522D17',
    errorColor: DEFAULT_COLOR_ERROR,
    fallbackIsDarkMode: true
  },
  {
    label: 'Dark Forrest',
    value: 'dark-forrest',
    primaryColor: '#0D3A32',
    secondaryColor: '#245B47',
    tertiaryColor: '#223546',
    errorColor: DEFAULT_COLOR_ERROR,
    fallbackIsDarkMode: true
  },
  {
    label: 'Walnut',
    value: 'walnut',
    primaryColor: '#615545',
    secondaryColor: '#9B773D',
    tertiaryColor: '#646263',
    errorColor: DEFAULT_COLOR_ERROR,
    fallbackIsDarkMode: true
  },
  {
    label: 'Deep Purple',
    value: 'deep-purple',
    primaryColor: '#161638',
    secondaryColor: '#493F3D',
    tertiaryColor: '#563457',
    errorColor: DEFAULT_COLOR_ERROR,
    fallbackIsDarkMode: true
  }
];

//##################################################//