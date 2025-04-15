import { DOCUMENT } from '@angular/common';
import { DestroyRef, Injectable, RendererFactory2, inject } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { ThemeConfig, ThemeConfigService } from '@moonlight/ng/theming/config';
import { SsrLocalStorage } from '@moonlight/ssr-storage';
import { BehaviorSubject, combineLatest, debounceTime, distinctUntilChanged } from 'rxjs';
import { ThemeData, ThemeDataUtils, ThemeSuffix } from './theme-data';

//##################################################//

const THEME_KEY = 'moonlight_theme_key'

//##################################################//

/**
 * Angular service for managing themes and dark/light mode with SSR support.
 * 
 * Features:
 * - Toggle between dark and light modes
 * - Switch between multiple themes
 * - Persists user preferences
 * - Respects system theme preference
 * - Server-side rendering compatible
 * 
 * Usage:
 * ```typescript
 * // In component
 * constructor(private themeService: ThemeService) {
 *   // Check current mode
 *   const isDark = this.themeService.isDarkMode();
 *   
 *   // Toggle dark mode
 *   this.themeService.setDarkMode(!isDark);
 *   
 *   // Change theme
 *   this.themeService.setThemeIndex('blue');
 * }
 * ```
 * 
 * Configure by providing ThemeConfig:
 * ```typescript
 * providers: [
 *   ThemeAndModeSetup.getThemeProviders(myThemeConfig)
 * ]
 * ```
 */
@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  private _localStorage = inject(SsrLocalStorage)
  private _destroyor = inject(DestroyRef)
  private _document = inject(DOCUMENT)
  //We can't inject Render2 Directly here. So have to use factory
  private _rendererFactory = inject(RendererFactory2)
  private _config: ThemeConfig = inject(ThemeConfigService, { optional: true }) ?? ThemeConfig.Create()

  //- - - - - - - - - - - - - - -//

  private _isDarkModeBs = new BehaviorSubject<boolean>(false)
  isDarkMode$ = this._isDarkModeBs.asObservable()
  isDarkMode = toSignal(this.isDarkMode$)

  private _themeSuffixBs = new BehaviorSubject<ThemeSuffix>(1)
  themeSuffix$ = this._themeSuffixBs.asObservable()
  themeSuffix = toSignal(this.themeSuffix$)

  //- - - - - - - - - - - - - - -//

  private _renderer = this._rendererFactory.createRenderer(this._document.body, null)

  private _currentShadeTheme = this._config.lightModeClass
  private _currentThemeSfx: ThemeSuffix = 0

  //- - - - - - - - - - - - - - -//

  constructor() {
    this.initializeTheme()
  }

  //-----------------------------//

  /**
   * Sets the application's light/dark mode
   * 
   * @param isDarkMode When true, applies dark mode class; when false, applies light mode class
   */
  setDarkMode(isDarkMode: boolean) {

    this._renderer.removeClass(this._document.body, this._currentShadeTheme)
    this._currentShadeTheme = isDarkMode ? this._config.darkModeClass : this._config.lightModeClass

    this._renderer.addClass(this._document.body, this._currentShadeTheme)
    this._isDarkModeBs.next(isDarkMode)
  }

  //-----------------------------//

  /**
   * Sets the current theme by applying the appropriate CSS class
   * 
   * @param suffix Theme identifier that will be appended to class name prefix
   * @example setThemeSuffix('blue') applies class "theme-blue" to body
   */
  setThemeSuffix(suffix: ThemeSuffix = 1) {

    this._renderer.removeClass(this._document.body, this.generateThemeClass(this._currentThemeSfx))
    this._currentThemeSfx = suffix
    this._renderer.addClass(this._document.body, this.generateThemeClass(this._currentThemeSfx))
    this._themeSuffixBs.next(this._currentThemeSfx)
  }

  //-----------------------------//

  retrieveTheme = (): ThemeData | null => 
    this._localStorage.getItemObject<ThemeData>(THEME_KEY) ?? null

  //-----------------------------//

  private initializeTheme(): void {

    try {
      const themeData = this.retrieveTheme()

      // Determine dark mode with this priority:
      // 1. User's saved preference
      // 2. System preference
      // 3. Default setting
      const isDarkMode = themeData?.isDarkMode ??
        this.isSystemDarkModeEnabled() ??
        this._config.defaultMode === 'dark'

      // Validate theme ID exists in config
      const validThemeSfx = this._config.themeOptions
        .map(opt => opt.classSuffix)
        .find(idx => idx === themeData?.suffix);

      this.clear()
      this.setDarkMode(isDarkMode)
      this.setThemeSuffix(validThemeSfx ?? 0)

      this.initializePersistence()

    } catch (error) {

      console.error('Error initializing theme:', error);
      // Apply fallback theme
      this.setDefaultTheme()
    }
  }

  //- - - - - - - - - - - - - - -//

  private initializePersistence(): void {

    combineLatest([this._themeSuffixBs, this._isDarkModeBs])
      .pipe(
        takeUntilDestroyed(this._destroyor),
        debounceTime(100),
        distinctUntilChanged()
      )
      .subscribe(
        ([themeIdx, isDark]) => this.storeTheme(themeIdx, isDark)
      )
  }

  //- - - - - - - - - - - - - - -//

  private storeTheme(themSfx: ThemeSuffix, isDark: boolean) {

    const themeData = ThemeDataUtils.create(themSfx, isDark)
    this._localStorage.setItemObject(THEME_KEY, themeData)
  }

  //- - - - - - - - - - - - - - -//

  private clear() {

    this._renderer.removeClass(this._document.body, this._config.darkModeClass)
    this._renderer.removeClass(this._document.body, this._config.lightModeClass)
  }

  //- - - - - - - - - - - - - - -//

  private generateThemeClass = (suffix: ThemeSuffix) =>
    `${this._config.themeClassPrefix}-${suffix}`

  //- - - - - - - - - - - - - - -//

  private setDefaultTheme() {
    this.clear()
    const theme = ThemeDataUtils.default()
    this.setDarkMode(theme.isDarkMode)
    this.setThemeSuffix(theme.suffix)
  }

  //- - - - - - - - - - - - - - -//

  private isSystemDarkModeEnabled = (): boolean | undefined =>
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-color-scheme: dark)').matches
      : undefined

  //-----------------------------//

}//Cls
