import { DestroyRef, Injectable, effect, inject } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { DarkModeType, DynamicThemeConfigService, ThemeOption, ThemeValue, defaultThemeOption } from '@spider-baby/material-theming/config';
import { consoleDev } from '@spider-baby/material-theming/utils';
import { SsrLocalStorage } from '@spider-baby/ssr-storage';
import { devLog } from '@spider-baby/utils-rxjs';
import { BehaviorSubject, Observable, combineLatest, debounceTime, distinctUntilChanged, map, of, startWith, switchMap } from 'rxjs';
import { ThemeGeneratorService } from './generator/theme-generator.service';
import { SystemPrefsService } from './generator/utils/sytem-prefs/sytem-prefs.service';
import { ThemeData, ThemeDataUtils } from './theme-data';
import { ThemeTransitionService } from './transitions/transitions.service';

//##################################################//

const THEME_KEY = 'spider-baby_theme_key'

//##################################################//


/**
 * Core service for managing theme application and persistence in the application.
 * 
 * ThemeService provides methods for getting, setting, and toggling themes and dark mode.
 * It handles persistence of user preferences and synchronizes with system preferences
 * when appropriate.
 * 
 * @example
 * ```typescript
 * // Toggle dark mode
 * themeService.toggleDarkMode();
 * 
 * // Apply a specific theme
 * themeService.setTheme('ocean-blue');
 * 
 * // Get reactive access to the current theme
 * const currentTheme = themeService.currentTheme;
 * ```
 */
@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  private _localStorage = inject(SsrLocalStorage)
  private _systemPrefs = inject(SystemPrefsService)
  private _destroyor = inject(DestroyRef)
  private _config = inject(DynamicThemeConfigService)
  private _themeGenerator = inject(ThemeGeneratorService)
  private _themeTransition = inject(ThemeTransitionService)

  //- - - - - - - - - - - - - - -//

  private _previousTheme: ThemeOption | null = null;
  private _systemDarkMode$ = this._systemPrefs.prefersDarkMode$


  private _darkModeTypeBs = new BehaviorSubject<DarkModeType | null | undefined>('light')
  darkModeType$: Observable<DarkModeType> = this._darkModeTypeBs.pipe(
    map(mode => mode ?? this._config.defaultDarkModeType() ?? 'system'))
  darkModeType = toSignal(this.darkModeType$, { initialValue: this._config.defaultDarkModeType() ?? 'system' })


  /** Current dark mode status (Observable)*/
  isDarkMode$: Observable<boolean> = this.darkModeType$.pipe(
    switchMap(mode => mode === 'system'
      ? this._systemDarkMode$
      : of(mode === 'dark')))
  /** Current dark mode status (Signal)*/
  isDarkMode = toSignal(this.isDarkMode$, { initialValue: this._config.defaultDarkModeType() === 'dark' })


  private _currentThemeBs = new BehaviorSubject<ThemeOption | undefined | null>(null) // Initialize with a default
  /** Current theme  (Observable)*/
  currentTheme$ = this._currentThemeBs.pipe(
    map(theme => theme ?? this._config.systemThemes()[0] ?? defaultThemeOption))
  /** Current theme (Signal)*/
  currentTheme = toSignal(this.currentTheme$, { initialValue: this._config.systemThemes()[0] ?? defaultThemeOption })


  private _customThemesBs = new BehaviorSubject<ThemeOption[]>([])
  /** User defined themes  (Observable)*/
  customThemes$ = this._customThemesBs.asObservable();
  /** User defined themes  (Signal)*/
  customThemes = toSignal(this.customThemes$, { initialValue: [] })


  /** Developer defined themes (Observable)*/
  systemThemes$ = this._config.systemThemes$.pipe(map(themes => themes));
  /** Developer defined themes (Signal)*/
  systemThemes = toSignal(this.systemThemes$, { initialValue: this._config.systemThemes() })


  availableThemes$ = combineLatest([this.systemThemes$, this.customThemes$]).pipe(
    map(([systemThemes, customThemes]) => [...systemThemes, ...customThemes]),
    startWith([]))
  availableThemes = toSignal(this.availableThemes$, { initialValue: [] })

  private _currentData$ = combineLatest([this.currentTheme$, this.darkModeType$, this.customThemes$])
    .pipe(
      devLog('ThemeService:currentData', (data) => data),
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

    effect(() => {
      // consoleDev.log('This is the effect')
      const currentSystemThemes = this.systemThemes();
      const currentThemeValue = this.currentTheme().value;
      // consoleDev.log('ThemeService: System themes changed, checking current theme validity.');
      if (!this.customThemes().some(t => t.value === currentThemeValue) &&
        !currentSystemThemes.some(t => t.value === currentThemeValue)) {
        consoleDev.warn(`ThemeService: Current theme "${currentThemeValue}" no longer exists in system themes. Resetting to default.`);
        this._currentThemeBs.next(currentSystemThemes[0] ?? defaultThemeOption);
      }
    })


    this.initialize()
  }

  //-----------------------------//
  // PUBLIC API METHODS
  //-----------------------------//

  /**
   * Sets the application's light/dark mode 
   * 
   * @param darkMode null| undefine will use system config defaults then preference
   */
  setDarkMode = (darkMode: DarkModeType | null | undefined) =>
    this._darkModeTypeBs.next(darkMode)

  //-----------------------------//

  /**
   * Sets the  theme based on the provided ThemeValue.
   * Applies the appropriate CSS class and updates dark mode if specified in the option.
   * If the provided theme is null or undefined, it falls back to the default theme.
   * 
   * 
   * Must be the value valid predefined ThemeOption, either System or Custom theme.
   * To apply/preview a new/dynamic theme, use the applyTheme method instead.
   *
   * @param theme The ThemeOption to apply, or null/undefined to apply the default. 
   * 
   */
  setThemeByValue(themeValue: ThemeValue): boolean {
    const theme = this.availableThemes().find(t => t.value === themeValue);
    if (theme)
      this.setTheme(theme)

    return !!theme
  }

  //-----------------------------//

  /**
   * Sets the  theme based on the provided ThemeOption.
   * Applies the appropriate CSS class and updates dark mode if specified in the option.
   * If the provided theme is null or undefined, it falls back to the default theme.
   * 
   * 
   * Must be a valid predefined ThemeOption, either System or Custom theme.
   * To apply/preview a new/dynamic theme, use the applyTheme method instead.
   *
   * @param theme The ThemeOption to apply, or null/undefined to apply the default. 
   * 
   */
  setTheme = (theme: ThemeOption | null | undefined) =>
    this._currentThemeBs.next(theme);

  //-----------------------------//

  /**
   * Apply theme to the document. 
   * 
   * This is useful when temporarily previewing other themes without having to create and store first.
   * 
   * @example
   * ```typescript
   * // In a component that temporarily previews themes
   * ngOnDestroy() {
   *   // Restore the application's theme when this component is destroyed
   *   this.themeService.reapplyCurrentTheme();
   * }
   * ```
   */
  applyTheme = (theme: ThemeOption, targetElement?: HTMLElement) => {
    if (!theme) return
    this._themeGenerator.applyTheme(theme, theme.value, targetElement);
  }

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
    const defaultTheme = this._config.systemThemes()[0] ?? defaultThemeOption;

    // Reset dark mode using system preference if applicable
    const prefersDark = defaultTheme.darkMode;

    this._darkModeTypeBs.next(prefersDark);

    this._currentThemeBs.next(undefined);

    // Clear stored preferences
    this._localStorage.removeItem(THEME_KEY);
  }

  //-----------------------------//

  /**
   * Reapplies the current application theme to the document.
   * 
   * This is useful when temporarily previewing other themes and then needing to
   * restore the application's actual theme. For example, when a theme selector
   * component is destroyed, it should call this method to ensure the application
   * returns to its proper theme.
   * 
   * @example
   * ```typescript
   * // In a component that temporarily previews themes
   * ngOnDestroy() {
   *   // Restore the application's theme when this component is destroyed
   *   this.themeService.reapplyCurrentTheme();
   * }
   * ```
   */
  reapplyCurrentTheme = (): void =>
    this.applyTheme(this.currentTheme())

  //-----------------------------//

  refreshTheme = (): void => this.initialize()

  //-----------------------------//
  // PRIVATE METHODS
  //-----------------------------//

  protected initialize(): void {

    try {
      //Get this running first in case something goes wrong below
      this._currentData$
        .pipe(
          takeUntilDestroyed(this._destroyor),
          // devLog('ThemeService:currentData')
        )
        .subscribe(data => {
          // consoleDev.log('subscribe - Theme data:', data);
          this.applyCurrentTheme(data)
          this._localStorage.setItemObject(THEME_KEY, data)
        })


      const themeData = this._localStorage.getItemObject<ThemeData>(THEME_KEY)
      const currentTheme = themeData?.currentTheme ?? this._config.systemThemes()[0] ?? defaultThemeOption
      this._currentThemeBs.next(currentTheme)

      const darkMode = currentTheme?.darkMode
        ?? this._config.defaultDarkModeType()
        ?? 'system'
      this._darkModeTypeBs.next(darkMode)

      this._customThemesBs.next(themeData?.customThemes ?? [])

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

  protected applyCurrentTheme(themeData: ThemeData, element?: HTMLElement) {

    // Direct application to specific element - no transition needed
    if (element || !this._config.transitionOptions().showTransitions)
      return this._themeGenerator.applyTheme(
        themeData.currentTheme,
        undefined,
        element
      );
    // Get previous theme for transition
    const previousTheme = this._previousTheme;

    // Store current theme for next transition
    this._previousTheme = themeData.currentTheme;

    consoleDev.log('Applying theme with transition:', themeData.currentTheme);
    // Use transition service for document-level theme changes
    this._themeTransition.transitionThemes(
      previousTheme,
      themeData.currentTheme,
      themeData.currentTheme.darkMode
    );
  }

  //- - - - - - - - - - - - - - -//

  protected setDefaultTheme() {
    // No need to call clear() here
    const defaultOption = this._config.systemThemes()[0] ?? defaultThemeOption // Get first theme or a hardcoded default

    consoleDev.log('Setting default theme:', defaultOption);

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
