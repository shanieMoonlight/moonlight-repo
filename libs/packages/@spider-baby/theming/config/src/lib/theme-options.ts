import { DEFAULT_COLOR_ERROR, DEFAULT_COLOR_PRIMARY, DEFAULT_COLOR_SECONDARY, DEFAULT_COLOR_TERTIARY, DEFAULT_THEME_LABEL, DEFAULT_THEME_VALUE } from "./constants";

//##################################################//

/**
 * Will be appened to the theme class name.
 * Example class="theme-mysuffix0" 
 * And to find the theme in the theme map or dropdowns
*/
export type ThemeValue = string | number;

export type DarkModeType = 'light' | 'dark' | 'system';

//##################################################//


/**
 * Represents a theme configuration with color settings and dark mode preference.
 * 
 * ThemeOption objects define the colors and appearance of a theme and can be
 * used with ThemeService to apply consistent styling across the application.
 * 
 * @example
 * ```typescript
 * const myCustomTheme = ThemeOption.create({
 *   label: 'Ocean Blue',
 *   value: 'ocean-blue',
 *   primaryColor: '#0277bd',
 *   secondaryColor: '#00b0ff',
 *   darkMode: 'system'
 * });
 * ```
 */
export class ThemeOption {
  /**
   * Private constructor to prevent direct instantiation.
   * Use ThemeOption.create() factory method instead.
   * 
   * @param label The human-readable name of the theme displayed in the UI.
   * Used in theme selection components and settings panels.
   * 
   * @param value The unique identifier or value associated with this theme.
   * Used internally to reference and apply the theme.
   * 
   * @param primaryColor The primary color of the theme.
   * Used for styling prominent UI elements and establishing the main color identity.
   * 
   * @param secondaryColor The secondary color of the theme.
   * Used for styling supporting UI elements and providing contrast to the primary color.
   * 
   * @param tertiaryColor The tertiary color of the theme.
   * Used for additional accent elements and further visual hierarchy in the UI.
   * 
   * @param errorColor The color used to indicate errors or destructive actions.
   * Provides consistent error state visualization across the theme.
   * 
   * @param darkMode Determines if dark mode should be used by default.
   * When true, the theme initializes in dark mode; when false, it initializes in light mode, 
   * when 'system' will default to system preferences.
   */
  private constructor(
    public readonly label: string,
    public readonly value: ThemeValue,
    public readonly primaryColor: string,
    public readonly secondaryColor: string,
    public readonly tertiaryColor: string | null,
    public readonly errorColor: string,
    public darkMode: DarkModeType
  ) { }

  //------------------------------//

  /**
   * Creates a new ThemeOption with validation and default values.
   * This is the recommended way to instantiate theme options.
   *
   * @param options Configuration object for creating a theme
   * @returns A new validated ThemeOption instance
   * @throws Error if required fields are missing
   */
  static create(options: {
    /** The human-readable name of the theme displayed in the UI */
    label: string;

    /** The unique identifier for this theme */
    value: ThemeValue;

    /** The primary color of the theme */
    primaryColor: string;

    /** The secondary color of the theme */
    secondaryColor: string;

    /** Optional tertiary color for additional accent elements */
    tertiaryColor?: string|null

    /** Optional color for error states and destructive actions */
    errorColor?: string|null

    /** Optional dark mode setting (true, false, or 'system') */
    darkMode?: DarkModeType;

  }): ThemeOption {
    // Validate required fields
    if (!options.label) throw new Error('Theme label is required');
    if (options.value === undefined) throw new Error('Theme value is required');
    if (!options.primaryColor) throw new Error('Primary color is required');
    if (!options.secondaryColor) throw new Error('Secondary color is required');

    // Apply defaults and sanitization
    return new ThemeOption(
      options.label,
      options.value,
      options.primaryColor,
      options.secondaryColor,
      options.tertiaryColor || DEFAULT_COLOR_TERTIARY,
      options.errorColor || DEFAULT_COLOR_ERROR,
      options.darkMode ?? 'system'
    )
  }
}

//##################################################//

export const defaultThemeOption: ThemeOption = {
  primaryColor: DEFAULT_COLOR_PRIMARY,
  secondaryColor: DEFAULT_COLOR_SECONDARY,
  tertiaryColor: DEFAULT_COLOR_TERTIARY,
  errorColor: DEFAULT_COLOR_ERROR,
  darkMode: 'system',
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
    darkMode: 'dark' // Add fallback mode
  },
  {
    label: 'Ocean',
    value: 'ocean',
    primaryColor: '#006C7F',
    secondaryColor: '#526773',
    tertiaryColor: '#6C939B',
    errorColor: DEFAULT_COLOR_ERROR,
    darkMode: 'light'
  },
  {
    label: 'Xmas',
    value: 'xmas',
    primaryColor: '#C8102E',
    secondaryColor: '#006747',
    tertiaryColor: '#FFD700',
    errorColor: DEFAULT_COLOR_ERROR,
    darkMode: 'dark'
  },
  {
    label: 'Sugar',
    value: 'sugar',
    primaryColor: '#1be7ff',
    secondaryColor: '#f61067',
    tertiaryColor: '#e4ff1a',
    errorColor: DEFAULT_COLOR_ERROR,
    darkMode: 'light'
  },
  {
    label: 'Sunset',
    value: 'sunset',
    primaryColor: '#FF4500',
    secondaryColor: '#FFD700',
    tertiaryColor: '#FF69B4',
    errorColor: DEFAULT_COLOR_ERROR,
    darkMode: 'light'
  },
  {
    label: 'Starry Night',
    value: 'starry-night',
    primaryColor: '#1E3A8A', // Deep blue
    secondaryColor: '#F0C420', // Bright yellow star
    tertiaryColor: '#8496B0', // Misty blue
    errorColor: DEFAULT_COLOR_ERROR,
    darkMode: 'dark'
  },
  {
    label: 'Dark Raspberry',
    value: 'dark-raspberry',
    primaryColor: '#46000D',
    secondaryColor: '#5E0009',
    tertiaryColor: '#720137',
    errorColor: DEFAULT_COLOR_ERROR,
    darkMode: 'dark'
  },
  {
    label: 'Coffee Beans',
    value: 'coffee-beans',
    primaryColor: '#48312B',
    secondaryColor: '#603A28',
    tertiaryColor: '#522D17',
    errorColor: DEFAULT_COLOR_ERROR,
    darkMode: 'dark'
  },
  {
    label: 'Dark Forrest',
    value: 'dark-forrest',
    primaryColor: '#0D3A32',
    secondaryColor: '#245B47',
    tertiaryColor: '#223546',
    errorColor: DEFAULT_COLOR_ERROR,
    darkMode: 'dark'
  },
  {
    label: 'Walnut',
    value: 'walnut',
    primaryColor: '#615545',
    secondaryColor: '#9B773D',
    tertiaryColor: '#646263',
    errorColor: DEFAULT_COLOR_ERROR,
    darkMode: 'dark'
  },
  {
    label: 'Deep Purple',
    value: 'deep-purple',
    primaryColor: '#161638',
    secondaryColor: '#493F3D',
    tertiaryColor: '#563457',
    errorColor: DEFAULT_COLOR_ERROR,
    darkMode: 'dark'
  }
];

//##################################################//