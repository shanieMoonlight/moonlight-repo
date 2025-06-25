import { InjectionToken } from '@angular/core';
import { DARK_MODE_CLASS, DEFAULT_COLOR_TONES, LIGHT_MODE_CLASS, THEME_CLASS_PREFIX } from './constants';
import { DarkModeType, defaultPresetSelectorThemes, ThemeOption } from './theme-options';
import { DEFAULT_TRANSITION_OPTIONS, ThemeTransitionOptions } from './theme-transition-options';

//##################################################//

export const ThemeConfigService = new InjectionToken<ThemingConfig>(
  'ThemeConfig',
  {
    factory: () => ThemingConfig.create()
  }
)


//##################################################//

/** Interface for ThemeConfig creation options */
export interface ThemingConfigOptions {

  /** List of available theme options */
  themeOptions?: ThemeOption[];
  /** CSS class for dark mode */
  darkModeClass?: string;
  /** CSS class for light mode */
  lightModeClass?: string;
  /** Prefix for theme-specific CSS classes */
  themeClassPrefix?: string;
  /** Default theme mode ('light' or 'dark') */
  defaultDarkModeType?: DarkModeType;
  /** Custom color tones for palette generation */
  customColorTones?: number[];
  /** Preset themes for selectors */
  presetSelectorThemes?: ThemeOption[];
  /** Options specific to theme transitions */
  transitionOptions?: ThemeTransitionOptions; 
}

//##################################################//

/**
 * Configuration settings for the theming system.
 * 
 * ThemeConfig provides centralized configuration for theme options, default values,
 * CSS class names, and other theme-related settings. It's typically provided at the
 * application level and consumed by various theming services.
 * 
 * @example
 * ```typescript
 * // Basic configuration with default themes
 * const config = ThemeConfig.create();
 * 
 * // Custom configuration using options object
 * const customConfig = ThemeConfig.create({
 *   themeOptions: [
 *     ThemeOption.create({ value: 'custom-theme', label: 'Custom', primaryColor: '#ff0000' })
 *   ],
 *   defaultMode: 'dark',
 *   showTransitions: true
 * });
 * ```
 */
export class ThemingConfig {

  themeOptions: ThemeOption[] = []
  darkModeClass = DARK_MODE_CLASS
  lightModeClass = LIGHT_MODE_CLASS
  themeClassPrefix = THEME_CLASS_PREFIX
  defaultDarkModeType: DarkModeType = 'light'
  colorTones: number[] = DEFAULT_COLOR_TONES
  /**Used in theme-selector */
  presetCustomizerThemes: ThemeOption[] = defaultPresetSelectorThemes

  // Replace showThemeTrasitions with the new options object
  transitionOptions: ThemeTransitionOptions = DEFAULT_TRANSITION_OPTIONS

  //- - - - - - - - - - - - - - - //

  /**
   * Private constructor to prevent direct instantiation.
   * Use ThemeConfig.create() factory method instead.
   */
  private constructor(options: ThemingConfigOptions = {}) {
    this.themeOptions = options.themeOptions ?? [];
    this.darkModeClass = options.darkModeClass ?? DARK_MODE_CLASS;
    this.lightModeClass = options.lightModeClass ?? LIGHT_MODE_CLASS;
    this.themeClassPrefix = options.themeClassPrefix ?? THEME_CLASS_PREFIX;
    this.defaultDarkModeType = options.defaultDarkModeType ?? 'light';
    this.colorTones = options.customColorTones ?? DEFAULT_COLOR_TONES;
    this.presetCustomizerThemes = options.presetSelectorThemes ?? defaultPresetSelectorThemes;
 // Merge provided transition options with defaults
 this.transitionOptions = {
  ...this.transitionOptions, // Start with defaults
  ...(options.transitionOptions ?? {}) // Override with provided options
};
  }

  //------------------------------//

  /**
   * Creates a new ThemeConfig instance using an options object.
   * This is the recommended way to instantiate theme configurations.
   *
   * @param options Configuration object for creating the theme config
   * @returns A new validated ThemeConfig instance
   */
  static create(options: ThemingConfigOptions = {}): ThemingConfig {
    return new ThemingConfig(options);
  }

  //------------------------------//    
  // Fluent API methods remain the same
  setDarkModeClass(className: string) {
    this.darkModeClass = className
    return this
  }

  //- - - - - - - - - - - - - - - //     

  setLightModeClass(className: string) {
    this.lightModeClass = className
    return this
  }

  //- - - - - - - - - - - - - - - //   

  setThemeClassPrefix(prefix: string) {
    this.themeClassPrefix = prefix
    return this
  }

  //- - - - - - - - - - - - - - - //   

  setSelectorPresetThemes(presetThemes: ThemeOption[]) {
    this.presetCustomizerThemes = presetThemes
    return this
  }
  
  //- - - - - - - - - - - - - - - //   

  setTransitionOptions(opts: ThemeTransitionOptions) {
    this.transitionOptions = opts
    return this
  }

  //------------------------------//   

} //Cls
