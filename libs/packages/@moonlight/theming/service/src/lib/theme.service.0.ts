// import { DOCUMENT } from '@angular/common';
// import { DestroyRef, Injectable, RendererFactory2, inject } from '@angular/core';
// import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
// import { DEFAULT_THEME_VALUE, ThemeConfig, ThemeConfigService, ThemeOption, ThemeValue, defaultThemeOption } from '@moonlight/ng/theming/config';
// import { SsrLocalStorage } from '@moonlight/ssr-storage';
// import { BehaviorSubject, combineLatest, debounceTime, distinctUntilChanged, map } from 'rxjs';
// import { ThemeData, ThemeDataUtils } from './theme-data';

// //##################################################//

// const THEME_KEY = 'moonlight_theme_key'

// //##################################################//

// /**
//  * Angular service for managing themes and dark/light mode with SSR support.
//  * 
//  * Features:
//  * - Toggle between dark and light modes
//  * - Switch between multiple themes
//  * - Persists user preferences
//  * - Respects system theme preference
//  * - Server-side rendering compatible
//  * 
//  * Usage:
//  * ```typescript
//  * // In component
//  * constructor(private themeService: ThemeService) {
//  *   // Check current mode
//  *   const isDark = this.themeService.isDarkMode();
//  *   
//  *   // Toggle dark mode
//  *   this.themeService.setDarkMode(!isDark);
//  *   
//  *   // Change theme
//  *   this.themeService.setThemeIndex('blue');
//  * }
//  * ```
//  * 
//  * Configure by providing ThemeConfig:
//  * ```typescript
//  * providers: [
//  *   ThemeAndModeSetup.getThemeProviders(myThemeConfig)
//  * ]
//  * ```
//  */
// @Injectable({
//   providedIn: 'root'
// })
// export class ThemeService0 {

//   private _localStorage = inject(SsrLocalStorage)
//   private _destroyor = inject(DestroyRef)
//   private _document = inject(DOCUMENT)
//   //We can't inject Render2 Directly here. So have to use factory
//   private _rendererFactory = inject(RendererFactory2)
//   private _config: ThemeConfig = inject(ThemeConfigService)
  

//   //- - - - - - - - - - - - - - -//

//   private _isDarkModeBs = new BehaviorSubject<boolean>(false)
//   isDarkMode$ = this._isDarkModeBs.asObservable()
//   isDarkMode = toSignal(this.isDarkMode$)



//   private _currentThemeBs = new BehaviorSubject<ThemeOption | undefined>(this._config.themeOptions[0]) // Initialize with a default
//   currentTheme$ = this._currentThemeBs.asObservable();
//   currentTheme = toSignal(this.currentTheme$)

//   currentThemeValue$ = this.currentTheme$.pipe(map(theme => theme?.value));
//   currentThemeValue = toSignal(this.currentThemeValue$, { initialValue: DEFAULT_THEME_VALUE })

//   //- - - - - - - - - - - - - - -//

//   private _renderer = this._rendererFactory.createRenderer(this._document.body, null)

//   private _currentDarkModeClass = this._config.lightModeClass

//   //- - - - - - - - - - - - - - -//

//   constructor() {
//     this.initializeThemeAndMode()
//   }

//   //-----------------------------//

//   /**
//    * Sets the application's light/dark mode 
//    * 
//    * @param isDarkMode When true, applies dark mode class; when false, applies light mode class
//    */
//   setDarkMode(isDarkMode: boolean) {

//     this._renderer.removeClass(this._document.body, this._currentDarkModeClass)
//     this._currentDarkModeClass = isDarkMode ? this._config.darkModeClass : this._config.lightModeClass

//     this._renderer.addClass(this._document.body, this._currentDarkModeClass)

//     //this must be called after remove and add class
//     //All updates must me complete before saving the new DarkMode Settings
//     this._isDarkModeBs.next(isDarkMode)
//   }

//   //-----------------------------//

//   /**
//    * Sets the current theme based on the provided ThemeOption.
//    * Applies the appropriate CSS class and updates dark mode if specified in the option.
//    * If the provided theme is null or undefined, it falls back to the default theme.
//    *
//    * @param theme The ThemeOption to apply, or null/undefined to apply the default.
//    */
//   setTheme(theme: ThemeOption | null | undefined): void {
//     let themeToApply: ThemeOption;

//     if (!theme) {
//       // Fallback to the default theme (assuming the first option is the default)
//       themeToApply = this._config.themeOptions[0] //?? ThemeDataUtils.default(); // Provide a hardcoded fallback if options are empty
//       // console.warn('setTheme called with invalid theme. Falling back to default:', themeToApply);
//     } else {
//       themeToApply = theme;
//     }
//     this.setThemeClassSuffix(themeToApply)

//     //this must be called after setThemeClassSuffix
//     //All updates must me complete before saving the new theme
//     this._currentThemeBs.next(themeToApply);
//   }

//   //-----------------------------//

//   private initializeThemeAndMode(): void {

//     try {
//       const themeData = this.retrieveTheme()

//       this.initalizeDarkMode(themeData)

//       this.initalizeTheme(themeData)

//       this.initializePersistence()

//     } catch (error) {

//       console.error('Error initializing theme:', error);
//       // Apply fallback theme
//       this.setDefaultTheme()
//     }
//   }

//   //- - - - - - - - - - - - - - -//

//   private initalizeTheme(themeData?: ThemeData | null): void {

//     // Determine initial theme suffix
//     const initialTheme = this._config.themeOptions
//       .find(opt => opt.value === themeData?.themes.value) // Find saved theme

//     this.setTheme(initialTheme)
//   }

//   //- - - - - - - - - - - - - - -//

//   /**
//    * Initializes dark mode based on the provided theme data or system preference.
//    * If no theme data is provided, it falls back to the system preference or default mode.
//    *
//    * @param themeData The ThemeData containing dark mode preference, or null/undefined.
//    */
//   private initalizeDarkMode(themeData?: ThemeData | null): void {
//     // Determine initial dark mode
//     const initialDarkMode = themeData?.currentDarkMode ??
//       this.isSystemDarkModeEnabled() ??
//       this._config.defaultMode === 'dark'

//     this.clearAllDarkModeClasses()
//     this.setDarkMode(initialDarkMode)

//     // console.log('initializeTheme, initialDarkMode:', initialDarkMode);
//   }

//   //- - - - - - - - - - - - - - -//

//   private initializePersistence(): void {

//     combineLatest([this.currentTheme$, this.isDarkMode$])
//       .pipe(
//         // tap((data) => console.log('initializePersistence data:', data)),
//         takeUntilDestroyed(this._destroyor),
//         debounceTime(100),
//         distinctUntilChanged()
//       )
//       .subscribe(
//         ([themeOption, isDark]) => {
//           if (!!themeOption)
//             this.storeTheme(themeOption, isDark)
//         }
//       )
//   }

//   //- - - - - - - - - - - - - - -//

//   /**
//    * Sets the current theme by applying the appropriate CSS class (Internal implementation)
//    *
//    * @param suffix Theme identifier that will be appended to class name prefix
//    */
//   private setThemeClassSuffix(theme: ThemeOption): void {

//     if (!theme) {
//       // Using the first configured theme's suffix as a fallback:
//       theme = this._config.themeOptions[0] ?? defaultThemeOption;
//       console.warn('Attempted to set invalid theme suffix. Falling back to:', theme.label);
//     }

//     const newThemeClass = this.generateThemeClass(theme.value);
//     const oldThemeClass = this.generateThemeClass(this.currentThemeValue() ?? '');

//     // Avoid unnecessary DOM manipulation if the class isn't changing
//     if (newThemeClass !== oldThemeClass) {
//       this._renderer.removeClass(this._document.body, oldThemeClass);
//       this._renderer.addClass(this._document.body, newThemeClass);
//     }
//   }

//   //- - - - - - - - - - - - - - -//

//   private storeTheme(themeOption: ThemeOption, isDark?: boolean) {

//     const themeData = ThemeDataUtils.create(
//       themeOption,
//       isDark ?? themeOption.fallbackIsDarkMode)

//     this._localStorage.setItemObject(THEME_KEY, themeData)
//   }

//   //- - - - - - - - - - - - - - -//

//   private retrieveTheme = (): ThemeData | null =>
//     this._localStorage.getItemObject<ThemeData>(THEME_KEY) ?? null

//   //- - - - - - - - - - - - - - -//

//   private clearAllDarkModeClasses() {

//     this._renderer.removeClass(this._document.body, this._config.darkModeClass)
//     this._renderer.removeClass(this._document.body, this._config.lightModeClass)
//   }

//   //- - - - - - - - - - - - - - -//

//   private generateThemeClass(suffix: ThemeValue) {
//     // Convert suffix to string in case it's a number
//     const suffixString = String(suffix);

//     // Replace any character that is NOT a letter, digit, hyphen, or underscore with a hyphen
//     // Also, replace multiple consecutive hyphens with a single one
//     const sanitizedSuffix = suffixString
//       .replace(/[^a-zA-Z0-9_-]/g, '-') // Replace invalid chars with '-'
//       .replace(/-+/g, '-'); // Collapse multiple hyphens

//     // Optional: Handle cases where the suffix might start or end with a hyphen after sanitization
//     const finalSuffix = sanitizedSuffix.replace(/^-+|-+$/g, ''); // Trim leading/trailing hyphens

//     // Handle potential empty suffix after sanitization
//     if (!finalSuffix) {
//       console.warn(`Theme suffix "${suffixString}" resulted in an empty string after sanitization. Using 'default'.`);
//       return `${this._config.themeClassPrefix}-default`; // Fallback if suffix becomes empty
//     }

//     return `${this._config.themeClassPrefix}-${finalSuffix}`;
//   }

//   //- - - - - - - - - - - - - - -//

//   private setDefaultTheme() {
//     // No need to call clear() here
//     const defaultOption = this._config.themeOptions[0] ?? defaultThemeOption // Get first theme or a hardcoded default
//     this.setDarkMode(!!defaultOption.fallbackIsDarkMode)
//     this.setTheme(defaultOption)
//   }

//   //- - - - - - - - - - - - - - -//

//   private isSystemDarkModeEnabled = (): boolean | undefined =>
//     typeof window !== 'undefined'
//       ? window.matchMedia('(prefers-color-scheme: dark)').matches
//       : undefined

//   //-----------------------------//

// }//Cls
