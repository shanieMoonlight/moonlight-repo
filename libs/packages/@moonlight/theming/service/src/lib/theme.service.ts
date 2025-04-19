import { DestroyRef, Injectable, inject, isDevMode } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { ThemeConfig, ThemeConfigService, ThemeOption, ThemeValue, defaultThemeOption } from '@moonlight/ng/theming/config';
import { SsrLocalStorage } from '@moonlight/ssr-storage';
import { BehaviorSubject, combineLatest, debounceTime, distinctUntilChanged, map, tap } from 'rxjs';
import { ThemeGeneratorService } from './generator/theme-generator.service';
import { ThemeData, ThemeDataUtils } from './theme-data';

//##################################################//

const THEME_KEY = 'moonlight_theme_key'

//##################################################//

/**

 */
@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  private _localStorage = inject(SsrLocalStorage)
  private _destroyor = inject(DestroyRef)
  private _config: ThemeConfig = inject(ThemeConfigService)
  private _themeGenerator = inject(ThemeGeneratorService)

  //- - - - - - - - - - - - - - -//

  private _isDarkModeBs = new BehaviorSubject<boolean>(false)
  /** Current dark mode status (Observable)*/
  isDarkMode$ = this._isDarkModeBs.asObservable()
  /** Current dark mode status (Signal)*/
  isDarkMode = toSignal(this.isDarkMode$, { initialValue: this._config.defaultDarkMode === 'dark' })


  private _currentThemeBs = new BehaviorSubject<ThemeOption>(this._config.themeOptions[0] ?? defaultThemeOption) // Initialize with a default
  /** Current theme  (Observable)*/
  currentTheme$ = this._currentThemeBs.asObservable();
  /** Current theme Signal)*/
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
  systemThemes = toSignal(this.systemThemes$)

  private _currentDataBs = combineLatest([this.currentTheme$, this.isDarkMode$, this.customThemes$])
    .pipe(
      tap((data) => isDevMode() && console.log('initializePersistence data:', data)),
      takeUntilDestroyed(this._destroyor),
      debounceTime(100),
      distinctUntilChanged(),
      map(([themeOption, isDark, customThemes]) =>
        ThemeDataUtils.create(
          themeOption,
          isDark ?? themeOption.fallbackIsDarkMode,
          customThemes
        ))
    )


  //- - - - - - - - - - - - - - -//

  constructor() {
    this.initialize()
  }

  //-----------------------------//

  /**
   * Sets the application's light/dark mode 
   * 
   * @param isDarkMode When true, applies dark mode class; when false, applies light mode class
   */
  setDarkMode = (isDarkMode: boolean) =>
    this._isDarkModeBs.next(isDarkMode)
 
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
    const current = this.customThemes();
    // Prevent duplicates by value
    const filtered = current.filter(t => t.value !== theme.value);
    const updated = [...filtered, theme];
    this._customThemesBs.next(updated);
    return updated;
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
    const prefersDark = defaultTheme.fallbackIsDarkMode;
    
    this._isDarkModeBs.next(prefersDark);
    this._currentThemeBs.next(defaultTheme);

    // Clear stored preferences
    this._localStorage.removeItem(THEME_KEY);
  }

  //-----------------------------//

  private initialize(): void {

    try {
      const themeData = this.retrieveTheme()

      const darkMode = themeData?.currentDarkMode ?? this._config.defaultDarkMode === 'dark'
      this._isDarkModeBs.next(darkMode)

      const currentTheme = themeData?.currentTheme ?? this._config.themeOptions[0] ?? defaultThemeOption
      this._currentThemeBs.next(currentTheme)

      this._customThemesBs.next(themeData?.customThemes ?? [])

      this._currentDataBs
        .pipe(takeUntilDestroyed(this._destroyor))
        .subscribe(data => {
          this.applyCurrentTheme(data)
          this.storeTheme(data)
        })

    } catch (error) {

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
      themeData.currentDarkMode,
      undefined,
      element)

  //- - - - - - - - - - - - - - -//

  private storeTheme = (themeData: ThemeData) =>
    this._localStorage.setItemObject(THEME_KEY, themeData)

  //- - - - - - - - - - - - - - -//

  private retrieveTheme = (): ThemeData | null =>
    this._localStorage.getItemObject<ThemeData>(THEME_KEY) ?? null

  //- - - - - - - - - - - - - - -//

  private setDefaultTheme() {
    // No need to call clear() here
    const defaultOption = this._config.themeOptions[0] ?? defaultThemeOption // Get first theme or a hardcoded default
    this.setDarkMode(!!defaultOption.fallbackIsDarkMode)
    this.setTheme(defaultOption)
  }

  //- - - - - - - - - - - - - - -//

  private isSystemDarkModeEnabled = (): boolean | undefined =>
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-color-scheme: dark)').matches
      : undefined

  //-----------------------------//

}//Cls
