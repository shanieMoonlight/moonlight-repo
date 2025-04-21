import { DestroyRef, Injectable, inject, isDevMode } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { DarkModeType, ThemeConfig, ThemeConfigService, ThemeOption, ThemeValue, defaultThemeOption } from '@moonlight/material/theming/config';
import { SsrLocalStorage } from '@moonlight/ssr-storage';
import { BehaviorSubject, combineLatest, debounceTime, distinctUntilChanged, map, Observable, of, switchMap, tap } from 'rxjs';
import { ThemeGeneratorService } from './generator/theme-generator.service';
import { SystemPrefsService } from './generator/utils/sytem-prefs/sytem-prefs.service';
import { ThemeData, ThemeDataUtils } from './theme-data';

//##################################################//

const THEME_KEY = 'moonlight_theme_key'

//##################################################//

// filepath: c:\Users\Shaneyboy\VsCode\moonlight-repo\libs\packages\@moonlight\theming\service\src\lib\theme.service.ts
/**
 * Service responsible for managing application theming including:
 * - Light/dark mode management
 * - Theme switching and persistence
 * - Custom theme management
 * - System and user preference handling
 */
@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  private _localStorage = inject(SsrLocalStorage)
  private _systemPrefs = inject(SystemPrefsService)
  private _destroyor = inject(DestroyRef)
  private _config: ThemeConfig = inject(ThemeConfigService)
  private _themeGenerator = inject(ThemeGeneratorService)

  //- - - - - - - - - - - - - - -//

  private _systemDarkMode$ = this._systemPrefs.prefersDarkMode$

  private _isDarkModeBs = new BehaviorSubject<DarkModeType>(false)
  /** Current dark mode status (Observable)*/
  isDarkMode$: Observable<boolean> = this._isDarkModeBs.pipe(
    switchMap(mode => mode === 'system'
      ? this._systemDarkMode$
      : of(mode))
  )
  
  /** Current dark mode status (Signal)*/
  isDarkMode = toSignal(this.isDarkMode$, { initialValue: this._config.defaultDarkMode === 'dark' })


  private _currentThemeBs = new BehaviorSubject<ThemeOption>(this._config.themeOptions[0] ?? defaultThemeOption) // Initialize with a default
  /** Current theme  (Observable)*/
  currentTheme$ = this._currentThemeBs.asObservable();
  /** Current theme (Signal)*/
  currentTheme = toSignal(this.currentTheme$, { initialValue: this._config.themeOptions[0] ?? defaultThemeOption })


  private _customThemesBs = new BehaviorSubject<ThemeOption[]>([])
  /** User defined themes  (Observable)*/
  customThemes$ = this._customThemesBs.asObservable();
  /** User defined themes  (Signal)*/
  customThemes = toSignal(this.customThemes$, { initialValue: [] })


  private _systemThemesBs = new BehaviorSubject<ThemeOption[]>(this._config.themeOptions)
  /** Developer defined themes (Observable)*/
  systemThemes$ = this._systemThemesBs.asObservable();
  /** Developer defined themes (Signal)*/
  systemThemes = toSignal(this.systemThemes$, { initialValue: this._config.themeOptions })


  private _currentDataBs = combineLatest([this.currentTheme$, this._isDarkModeBs, this.customThemes$])
    .pipe(
      // tap((data) => isDevMode() && console.log('initializePersistence data:', data)),
      debounceTime(100),
      distinctUntilChanged(),
      map(([themeOption, darkMode, customThemes]) => {
        const themeWithCurrentDarkMode = {
          ...themeOption,
          darkMode: darkMode
        }
        return ThemeDataUtils.create(themeWithCurrentDarkMode, customThemes);
      })
    )


  //- - - - - - - - - - - - - - -//

  constructor() {
    this.initialize()
  }

  //-----------------------------//
  // PUBLIC API METHODS
  //-----------------------------//

  /**
   * Sets the application's light/dark mode 
   * 
   * @param darkMode When true, applies dark mode class; when false, applies light mode class
   */
  setDarkMode = (darkMode: DarkModeType) =>
    this._isDarkModeBs.next(darkMode)

  //-----------------------------//

  /**
   * Sets the current theme based on the provided ThemeOption.
   * Applies the appropriate CSS class and updates dark mode if specified in the option.
   * If the provided theme is null or undefined, it falls back to the default theme.
   *
   * @param theme The ThemeOption to apply, or null/undefined to apply the default.
   */
  setTheme = (theme: ThemeOption | null | undefined) =>
    this._currentThemeBs.next(theme ?? this._config.themeOptions[0] ?? defaultThemeOption)

  //-----------------------------//

  /**
 * Exports the current theme settings as a serializable object
 * that can be shared or imported later
 */
  exportThemeSettings = (): { theme: ThemeOption, isDark: boolean } => ({
    theme: this.currentTheme(),
    isDark: this.isDarkMode()
  })

  //-----------------------------//

  /**
   * Adds a custom theme to the list of available themes
   * 
   * @param theme The custom theme to add
   * @returns The updated list of custom themes
   */
  addCustomTheme(theme: ThemeOption): ThemeOption[] {
    const currentThemes = this.customThemes();
    const sanitizedValue = this.sanitizeValue(theme.value);

    const safeTheme = {
      ...theme,
      value: sanitizedValue
    };

    const existingIndex = currentThemes.findIndex(t => t.value === sanitizedValue);

    let updatedThemes: ThemeOption[];

    if (existingIndex > -1) {
      // Update existing theme
      updatedThemes = [
        ...currentThemes.slice(0, existingIndex), // Themes before the updated one
        safeTheme,                                // The updated theme
        ...currentThemes.slice(existingIndex + 1) // Themes after the updated one
      ];
    } else {
      // Add new theme
      updatedThemes = [...currentThemes, safeTheme];
    }

    this._customThemesBs.next(updatedThemes);
    return updatedThemes;
  }

  //-----------------------------//

  /**
   * Removes a custom theme by value
   * 
   * @param value The value of the custom theme to remove
   * @returns The updated list of custom themes
   */
  removeCustomTheme(value: ThemeValue): ThemeOption[] {
    const current = this._customThemesBs.value;
    const updated = current.filter(t => t.value !== value)
    this._customThemesBs.next(updated);
    return updated;
  }

  //-----------------------------//

  /**
   * Resets all theme settings to system defaults
   * - Clears all custom themes
   * - Sets current theme to first system theme
   * - Sets dark mode based on theme's default
   */
  resetToDefaults = (): void => {
    // Clear custom themes
    this._customThemesBs.next([]);

    // Get default system theme
    const defaultTheme = this._config.themeOptions[0] ?? defaultThemeOption;

    // Reset dark mode using system preference if applicable
    const prefersDark = defaultTheme.darkMode;

    this._isDarkModeBs.next(prefersDark);
    this._currentThemeBs.next(defaultTheme);

    // Clear stored preferences
    this._localStorage.removeItem(THEME_KEY);
  }

  //-----------------------------//
  // PRIVATE METHODS
  //-----------------------------//

  private initialize(): void {

    try {
      //Get this running first sin case something goes wrong below
      this._currentDataBs
        .pipe(takeUntilDestroyed(this._destroyor))
        .subscribe(data => {
          if (isDevMode())
            console.log('ThemeService', data)
          this.applyCurrentTheme(data)
          this._localStorage.setItemObject(THEME_KEY, data)
        })


      const themeData = this._localStorage.getItemObject<ThemeData>(THEME_KEY)
      const currentTheme = themeData?.currentTheme ?? this._config.themeOptions[0] ?? defaultThemeOption
      this._currentThemeBs.next(currentTheme)

      const darkMode = currentTheme?.darkMode ?? this._config.defaultDarkMode === 'dark'
      this._isDarkModeBs.next(darkMode)

      this._customThemesBs.next(themeData?.customThemes ?? [])
      
      console.log('ThemeService initialize Complete')

    } catch (error) {

      console.log('THemeServiceerror', error);

      // More specific error handling
      if (error instanceof SyntaxError)
        console.error('Error parsing stored theme data:', error);
      else if (error instanceof TypeError)
        console.error('Theme structure error - possible version mismatch:', error);
      else if (error instanceof Error)
        console.error(`Theme initialization error (${error.name}): ${error.message}`);
      else
        console.error('Unknown error initializing theme:', error)

      // Apply fallback theme
      this.setDefaultTheme()
    }

  }

  //- - - - - - - - - - - - - - -//

  private applyCurrentTheme = (themeData: ThemeData, element?: HTMLElement) =>
    this._themeGenerator.applyTheme(
      themeData.currentTheme,
      undefined,
      element)

  //- - - - - - - - - - - - - - -//

  private setDefaultTheme() {
    // No need to call clear() here
    const defaultOption = this._config.themeOptions[0] ?? defaultThemeOption // Get first theme or a hardcoded default
    console.log('Setting default theme:this._config.themeOptions[0]', this._config.themeOptions[0]);
    console.log('Setting default theme:', defaultOption);

    this.setDarkMode(defaultOption.darkMode)
    this.setTheme(defaultOption)
  }

  //- - - - - - - - - - - - - - -//

  private sanitizeValue(value: ThemeValue): ThemeValue {
    // Ensure value is a string before calling methods
    const stringValue = String(value ?? '');
    const lwrValue = stringValue.toLowerCase();
    // Replace whitespace with hyphens and remove any characters
    // that are not alphanumeric or hyphens to create a safe value.
    let sanitized = lwrValue.replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

    // Add 'custom-' prefix if not already present
    if (!sanitized.startsWith('custom-'))
      sanitized = `custom-${sanitized}`

    return sanitized;
  }

  //-----------------------------//

}//Cls
