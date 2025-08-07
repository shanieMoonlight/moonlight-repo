import { isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID, RendererFactory2, DOCUMENT } from '@angular/core';
import { COLOR_VAR_PREFIX, DARK_MODE_CLASS, DynamicThemeConfigService, THEME_CLASS_PREFIX, ThemeConfigService, ThemeOption, ThemeValue } from "@spider-baby/material-theming/config";
import { ColorUtilsService } from '@spider-baby/material-theming/utils';
import { MemoizationService } from '@spider-baby/utils-memoization';
import { AnimationFrameService } from '@spider-baby/utils-testing';
import { GeneratedPalettes } from './models/theme-palletes';
import { PaletteGeneratorService } from './utils/palettes/palette-generator.service';
import { ScssPaletteGeneratorService } from './utils/scss/scss-palette-generator.service';
import { SystemPrefsService } from './utils/sytem-prefs/sytem-prefs.service';
import { devConsole } from '@spider-baby/dev-console';


/**
 * Service responsible for generating and applying Material Design 3 compliant themes.
 * 
 * This service handles:
 * - Generating color palettes from theme base colors
 * - Creating consistent light/dark theme variants
 * - Applying themes to the DOM through CSS variables
 * - Converting themes to SCSS for build-time integration
 * 
 * It uses memoization to optimize performance by caching generated palettes.
 * 
 * @example
 * ```typescript
 * // Apply a theme to the entire document
 * const theme = { 
 *   value: 'my-theme', 
 *   primaryColor: '#6200ee', 
 *   secondaryColor: '#03dac6' 
 * };
 * themeGeneratorService.applyTheme(theme);
 * ```
 */
@Injectable({
  providedIn: 'root'
})
export class SbThemeGeneratorService {


  private _platformId = inject(PLATFORM_ID)
  private _document = inject(DOCUMENT);

  private _requestFrame = inject(AnimationFrameService);

  private _memoizer = inject(MemoizationService);

  private _systemPrefs = inject(SystemPrefsService)
  private _config = inject(DynamicThemeConfigService)

  private _rendererFactory = inject(RendererFactory2);
  private _renderer = this._rendererFactory.createRenderer(null, null);

  private _colorUtils = inject(ColorUtilsService);
  private _paletteGenerator = inject(PaletteGeneratorService)
  private _scssGenerator = inject(ScssPaletteGeneratorService)

  //- - - - - - - - - - - - - - -//

  // Additional class fields for memoized functions...
  private _memoizedGeneratePalettes!: (theme: ThemeOption) => GeneratedPalettes;


  //-----------------------------//

  constructor() {
    this.initializeMemoizedFunctions()
  }

  //-----------------------------//
  // PUBLIC API METHODS
  //-----------------------------//

  /**
   * Applies the specified theme to the target element by generating and setting CSS variables.
   * 
   * @param theme The theme configuration to apply
   * @param themeClassOverride Optional custom CSS class name to use instead of theme.value
   * @param targetElement Optional target DOM element (defaults to document.documentElement)
   * @returns void
   */
  applyTheme(
    theme: ThemeOption,
    themeClassOverride?: ThemeValue,
    targetElement?: HTMLElement) {

    if (!this.isBrowser())
      return

    const isDark = this.shouldUseDarkMode(theme)
    // const palettes = this._paletteGenerator.generatePalettes(theme)
    // Use memoized function instead of direct call
    // consoleDev.log('Generating palettes for theme:', theme.value,theme.darkMode, theme)
    const palettes = this._memoizedGeneratePalettes(theme);
    const themeClass = themeClassOverride ?? theme.value

    targetElement ??= this._document.documentElement

    // Batch DOM updates using requestAnimationFrame
    this._requestFrame.request(() => {

      // Apply basic styling to body element for convenience
      this.applyBaseBodyStyles()

      // First, set the individual palette shade variables
      this.applyPaletteVariables(palettes, targetElement)

      // Then apply the M3 system variables using the direct mapper approach
      this.applySystemVariables(theme, isDark, palettes, targetElement)
      this.applyShapeVariables(targetElement); // <-- Add this line
      this.applyTypographyVariables(targetElement);
      this.applyThemeAndModeClassess(themeClass, isDark, targetElement)

    })
  }

  //-----------------------------//

  /**
   * Exports the current theme configuration as SCSS variables and mixins.
   * 
   * This method generates SCSS code that can be used in custom stylesheets
   * to access theme colors and create consistent styling. It's useful for:
   * - Debugging theme configurations
   * - Saving themes for later use
   * - Integrating theme colors with custom SCSS workflows
   * 
   * @param theme The theme configuration to export as SCSS
   * @returns A string containing SCSS variables and mixins representing the theme
   * @example
   * ```typescript
   * const scssCode = themeGenerator.exportThemeAsScss(myTheme);
   * // Save to file or display in UI
   * ```
   */
  protected exportThemeAsScss = (theme: ThemeOption): string =>
    theme ? this._scssGenerator.exportThemeAsScss(theme) : ''

  //-----------------------------//
  // PRIVATE METHODS
  //-----------------------------//

  private applyThemeAndModeClassess(themeClass: ThemeValue, isDark: boolean, targetElement: HTMLElement) {

    const themeClassPrefix = this._config.themeClassPrefix() ?? THEME_CLASS_PREFIX
    //Remove old theme classes      
    targetElement.classList.forEach(className => {
      if (className.startsWith(themeClassPrefix))
        this._renderer.removeClass(targetElement, className)
    })

    // Set the theme class users might want to react to different classes outside of material situations.  (theme-xmas, theme-halloween, etc.)
    if (themeClass)
      this._renderer.addClass(targetElement, `${themeClassPrefix}-${themeClass}`)

    devConsole.log('Applying theme class:', this._config.darkModeClass(), `${themeClassPrefix}-${themeClass}`, 'isDark:', isDark)
    // Add dark mode class if needed
    if (isDark)
      this._renderer.addClass(targetElement, this._config.darkModeClass())
    else
      this._renderer.removeClass(targetElement, this._config.darkModeClass())


  }

  //- - - - - - - - - - - - - - -//

  /**
   * Apply palette shade variables to the target element
   */
  private applyPaletteVariables(palettes: GeneratedPalettes, targetElement: HTMLElement) {

    // Set variables for each palette type
    Object.entries(palettes).forEach(([paletteName, shades]) => {
      Object.entries(shades).forEach(([tone, colorValue]) => {
        // Use setProperty instead of setStyle for CSS custom properties    
        // Convert camelCase to kebab-case for CSS variable naming
        const kebabPaletteName = this.camelToKebabCase(paletteName);
        targetElement.style.setProperty(
          `--${COLOR_VAR_PREFIX}-${kebabPaletteName}-${tone}`,
          `${colorValue}`
        )
      })
    })
  }

  //- - - - - - - - - - - - - - -//

  /**
   * Apply M3 system variables based on the direct-palette-mapper approach
   */
  private applySystemVariables(theme: ThemeOption, isDark: boolean, palettes: GeneratedPalettes, targetElement: HTMLElement) {


    // M3 colors - Primary
    this.setVariable(targetElement, '--mat-sys-primary', palettes.primary[isDark ? 80 : 40]);
    this.setVariable(targetElement, '--mat-sys-on-primary', palettes.primary[isDark ? 20 : 100]);
    this.setVariable(targetElement, '--mat-sys-primary-container', palettes.primary[isDark ? 30 : 90]);
    this.setVariable(targetElement, '--mat-sys-on-primary-container', palettes.primary[isDark ? 90 : 10]);

    // M3 colors - Secondary
    this.setVariable(targetElement, '--mat-sys-secondary', palettes.secondary[isDark ? 80 : 40]);
    this.setVariable(targetElement, '--mat-sys-on-secondary', palettes.secondary[isDark ? 20 : 100]);
    this.setVariable(targetElement, '--mat-sys-secondary-container', palettes.secondary[isDark ? 30 : 90]);
    this.setVariable(targetElement, '--mat-sys-on-secondary-container', palettes.secondary[isDark ? 90 : 10]);

    // M3 colors - Tertiary
    this.setVariable(targetElement, '--mat-sys-tertiary', palettes.tertiary[isDark ? 80 : 40]);
    this.setVariable(targetElement, '--mat-sys-on-tertiary', palettes.tertiary[isDark ? 20 : 100]);
    this.setVariable(targetElement, '--mat-sys-tertiary-container', palettes.tertiary[isDark ? 30 : 90]);
    this.setVariable(targetElement, '--mat-sys-on-tertiary-container', palettes.tertiary[isDark ? 90 : 10]);

    // M3 colors - Error
    this.setVariable(targetElement, '--mat-sys-error', palettes.error[isDark ? 80 : 40]);
    this.setVariable(targetElement, '--mat-sys-on-error', palettes.error[isDark ? 20 : 100]);
    this.setVariable(targetElement, '--mat-sys-error-container', palettes.error[isDark ? 30 : 90]);
    this.setVariable(targetElement, '--mat-sys-on-error-container', palettes.error[isDark ? 90 : 10]);

    // M3 colors - Neutral
    this.setVariable(targetElement, '--mat-sys-neutral', palettes.neutral[isDark ? 80 : 40]);
    this.setVariable(targetElement, '--mat-sys-on-neutral', palettes.neutral[isDark ? 20 : 100]);
    this.setVariable(targetElement, '--mat-sys-neutral-container', palettes.neutral[isDark ? 30 : 90]);
    this.setVariable(targetElement, '--mat-sys-on-neutral-container', palettes.neutral[isDark ? 90 : 10]);

    // M3 colors - NeutralVariant
    this.setVariable(targetElement, '--mat-sys-neutral-variant', palettes.neutralVariant[isDark ? 80 : 40]);
    this.setVariable(targetElement, '--mat-sys-on-neutral-variant', palettes.neutralVariant[isDark ? 20 : 100]);
    this.setVariable(targetElement, '--mat-sys-neutral-variant-container', palettes.neutralVariant[isDark ? 30 : 90]);
    this.setVariable(targetElement, '--mat-sys-on-neutral-variant-container', palettes.neutralVariant[isDark ? 90 : 10]);

    // M3 Surface and background colors
    this.setVariable(targetElement, '--mat-sys-background', palettes.neutral[isDark ? 6 : 99]);
    this.setVariable(targetElement, '--mat-sys-on-background', palettes.neutral[isDark ? 90 : 10]);
    this.setVariable(targetElement, '--mat-sys-surface', palettes.neutral[isDark ? 6 : 99]);
    this.setVariable(targetElement, '--mat-sys-on-surface', palettes.neutral[isDark ? 90 : 10]);

    // Additional surface variants (simplified list)
    this.setVariable(targetElement, '--mat-sys-surface-container', palettes.neutral[isDark ? 12 : 94]);
    this.setVariable(targetElement, '--mat-sys-surface-container-low', palettes.neutral[isDark ? 10 : 96]);
    this.setVariable(targetElement, '--mat-sys-surface-container-high', palettes.neutral[isDark ? 17 : 92]);

    // Primary fixed variants
    this.setVariable(targetElement, '--mat-sys-primary-fixed', palettes.primary[90]);
    this.setVariable(targetElement, '--mat-sys-primary-fixed-dim', palettes.primary[80]);
    this.setVariable(targetElement, '--mat-sys-on-primary-fixed', palettes.primary[10]);
    this.setVariable(targetElement, '--mat-sys-on-primary-fixed-variant', palettes.primary[30]);

    // Secondary fixed variants
    this.setVariable(targetElement, '--mat-sys-secondary-fixed', palettes.secondary[90]);
    this.setVariable(targetElement, '--mat-sys-secondary-fixed-dim', palettes.secondary[80]);
    this.setVariable(targetElement, '--mat-sys-on-secondary-fixed', palettes.secondary[10]);
    this.setVariable(targetElement, '--mat-sys-on-secondary-fixed-variant', palettes.secondary[30]);

    // Tertiary fixed variants
    this.setVariable(targetElement, '--mat-sys-tertiary-fixed', palettes.tertiary[90]);
    this.setVariable(targetElement, '--mat-sys-tertiary-fixed-dim', palettes.tertiary[80]);

    // Additional surface variants
    this.setVariable(targetElement, '--mat-sys-surface-variant', palettes.neutralVariant[isDark ? 30 : 90]);
    this.setVariable(targetElement, '--mat-sys-on-surface-variant', palettes.neutralVariant[isDark ? 80 : 30]);
    this.setVariable(targetElement, '--mat-sys-surface-container-lowest', palettes.neutral[isDark ? 4 : 100]);
    this.setVariable(targetElement, '--mat-sys-surface-container-highest', palettes.neutral[isDark ? 22 : 90]);
    this.setVariable(targetElement, '--mat-sys-surface-dim', palettes.neutral[isDark ? 6 : 87]);
    this.setVariable(targetElement, '--mat-sys-surface-bright', palettes.neutral[isDark ? 24 : 98]);

    // Outline colors
    this.setVariable(targetElement, '--mat-sys-outline', palettes.neutralVariant[isDark ? 60 : 50]);
    this.setVariable(targetElement, '--mat-sys-outline-variant', palettes.neutralVariant[isDark ? 30 : 80]);

    // Inverse colors
    this.setVariable(targetElement, '--mat-sys-inverse-primary', palettes.primary[isDark ? 40 : 80]);
    this.setVariable(targetElement, '--mat-sys-inverse-surface', palettes.neutral[isDark ? 90 : 20]);
    this.setVariable(targetElement, '--mat-sys-inverse-on-surface', palettes.neutral[isDark ? 20 : 95]);

    // Miscellaneous
    this.setVariable(targetElement, '--mat-sys-surface-tint', palettes.primary[80]);
    this.setVariable(targetElement, '--mat-sys-scrim', palettes.neutral[0]);
    this.setVariable(targetElement, '--mat-sys-shadow', palettes.neutral[0]);

    // Additional useful values for Angular Material
    this.setVariable(targetElement, '--mat-sys-neutral10', palettes.neutral[10]);
    this.setVariable(targetElement, '--mat-sys-neutral-variant20', palettes.neutralVariant[20]);


    // Add original seed colors for direct access
    this.setVariable(targetElement, '--mat-seed-primary', theme.primaryColor);
    this.setVariable(targetElement, '--mat-seed-secondary', theme.secondaryColor);
    this.setVariable(targetElement, '--mat-seed-tertiary', theme.tertiaryColor || theme.secondaryColor);
    this.setVariable(targetElement, '--mat-seed-error', theme.errorColor || '#B3261E');

    // Add RGB variables for transparency effects
    this.addRGBVariables(palettes, targetElement, isDark);


  }

  //- - - - - - - - - - - - - - -//

  /**
   * Helper to set a CSS variable
   */
  private setVariable = (element: HTMLElement, name: string, value: string) =>
    element.style.setProperty(name, value)

  //- - - - - - - - - - - - - - -//

  /**
    * Add RGB variables for transparency support
    */
  private addRGBVariables(p: GeneratedPalettes, targetElement: HTMLElement, isDark: boolean) {
    // Primary colors
    this._colorUtils.setRGBVariable(targetElement, '--mat-sys-primary-rgb', p.primary[isDark ? 80 : 40]);
    this._colorUtils.setRGBVariable(targetElement, '--mat-sys-on-primary-rgb', p.primary[isDark ? 20 : 100]);
    this._colorUtils.setRGBVariable(targetElement, '--mat-sys-primary-container-rgb', p.primary[isDark ? 30 : 90]);

    // Secondary colors
    this._colorUtils.setRGBVariable(targetElement, '--mat-sys-secondary-rgb', p.secondary[isDark ? 80 : 40]);
    this._colorUtils.setRGBVariable(targetElement, '--mat-sys-on-secondary-rgb', p.secondary[isDark ? 20 : 100]);
    this._colorUtils.setRGBVariable(targetElement, '--mat-sys-primary-secondary-rgb', p.secondary[isDark ? 30 : 90]);

    // Tertiary colors
    this._colorUtils.setRGBVariable(targetElement, '--mat-sys-tertiary-rgb', p.tertiary[isDark ? 80 : 40]);
    this._colorUtils.setRGBVariable(targetElement, '--mat-sys-on-tertiary-rgb', p.tertiary[isDark ? 20 : 100]);
    this._colorUtils.setRGBVariable(targetElement, '--mat-sys-tertiary-container-rgb', p.tertiary[isDark ? 30 : 90]);

    // Error colors
    this._colorUtils.setRGBVariable(targetElement, '--mat-sys-error-rgb', p.error[isDark ? 80 : 40]);
    this._colorUtils.setRGBVariable(targetElement, '--mat-sys-on-error-rgb', p.error[isDark ? 20 : 100]);
    this._colorUtils.setRGBVariable(targetElement, '--mat-sys-error-container-rgb', p.error[isDark ? 30 : 90]);

    // Surface colors
    this._colorUtils.setRGBVariable(targetElement, '--mat-sys-surface-rgb', p.neutral[isDark ? 6 : 99]);
    this._colorUtils.setRGBVariable(targetElement, '--mat-sys-on-surface-rgb', p.neutral[isDark ? 90 : 10]);
    this._colorUtils.setRGBVariable(targetElement, '--mat-sys-surface-container-rgb', p.neutral[isDark ? 6 : 99]);
    this._colorUtils.setRGBVariable(targetElement, '--mat-sys-on-surface-rgb', p.neutral[isDark ? 90 : 10]);

    // Background
    this._colorUtils.setRGBVariable(targetElement, '--mat-sys-background-rgb', p.neutral[isDark ? 6 : 99])

  }

  //- - - - - - - - - - - - - - -//

  /**
   * Applies basic background and text color styles to the body element.
   * Users can override these with their own CSS if desired.
   */
  private applyBaseBodyStyles(): void {
    const bodyElement = this._document.body;
    if (bodyElement) {
      // Set background and text color based on theme surface variables
      this.setVariable(bodyElement, 'background', 'var(--mat-sys-surface)');
      this.setVariable(bodyElement, 'color', 'var(--mat-sys-on-surface)');
    }
  }

  //- - - - - - - - - - - - - - -//

  /**
   * Determines if the theme should use dark mode based on user preference and theme settings.
   * 
   * @param theme The theme configuration to evaluate
   * @returns True if dark mode should be applied, false otherwise
   */
  private shouldUseDarkMode = (theme: ThemeOption): boolean =>
    theme.darkMode === 'system'
      ? this._systemPrefs.prefersDarkMode()
      : theme.darkMode === 'dark';


  //- - - - - - - - - - - - - - -//

  private initializeMemoizedFunctions(): void {

    // Step 1: Configure the memoization options
    const cacheOptions = {
      maxSize: 5  // Store up to 5 generated palettes
    };

    // Step 2: Create a memoize factory for generating palettes
    const palettesMemoFactory = this._memoizer.memoize<[ThemeOption], GeneratedPalettes>(
      'theme-palettes',
      cacheOptions)

    // Step 3: Define the original function to be memoized
    const generatePalettesFunc = (theme: ThemeOption): GeneratedPalettes => {
      return this._paletteGenerator.generatePalettes(theme);
    };

    // Step 4: Define the cache key generator function
    const keyGenerator = (theme: ThemeOption): string => {
      return `${theme.primaryColor}-${theme.secondaryColor}-${theme.tertiaryColor || ''}-${theme.errorColor || ''}-${theme.darkMode}`;
    };

    // Step 5: Create the memoized function by combining all parts
    this._memoizedGeneratePalettes = palettesMemoFactory(
      generatePalettesFunc,
      keyGenerator
    );
  }

  //- - - - - - - - - - - - - - -//

  private isBrowser = (): boolean =>
    isPlatformBrowser(this._platformId)

  //- - - - - - - - - - - - - - -//

  /**
 * Converts a camelCase string to kebab-case
 * For example: 'neutralVariant' becomes 'neutral-variant'
 */
  private camelToKebabCase = (str: string): string =>
    str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()

  /**
   * Apply Material Design 3 shape (corner radius) variables to the target element
   */
  private applyShapeVariables(targetElement: HTMLElement) {
    // Material Design 3 shape tokens (border radius)
    this.setVariable(targetElement, '--mat-sys-corner-extra-large', '28px');
    this.setVariable(targetElement, '--mat-sys-corner-extra-large-top', '28px 28px 0 0');
    this.setVariable(targetElement, '--mat-sys-corner-extra-small', '4px');
    this.setVariable(targetElement, '--mat-sys-corner-extra-small-top', '4px 4px 0 0');
    this.setVariable(targetElement, '--mat-sys-corner-full', '9999px');
    this.setVariable(targetElement, '--mat-sys-corner-large', '16px');
    this.setVariable(targetElement, '--mat-sys-corner-large-end', '0 16px 16px 0');
    this.setVariable(targetElement, '--mat-sys-corner-large-start', '16px 0 0 16px');
    this.setVariable(targetElement, '--mat-sys-corner-large-top', '16px 16px 0 0');
    this.setVariable(targetElement, '--mat-sys-corner-medium', '12px');
    this.setVariable(targetElement, '--mat-sys-corner-none', '0');
    this.setVariable(targetElement, '--mat-sys-corner-small', '8px');
  }

  /**
   * Apply Material Design 3 typography variables to the target element
   */
  private applyTypographyVariables(targetElement: HTMLElement) {
    // Material Design 3 typography tokens
    this.setVariable(targetElement, '--mat-sys-body-large', '400 1rem / 1.5rem Roboto');
    this.setVariable(targetElement, '--mat-sys-body-large-font', 'Roboto');
    this.setVariable(targetElement, '--mat-sys-body-large-line-height', '1.5rem');
    this.setVariable(targetElement, '--mat-sys-body-large-size', '1rem');
    this.setVariable(targetElement, '--mat-sys-body-large-tracking', '0.031rem');
    this.setVariable(targetElement, '--mat-sys-body-large-weight', '400');
    this.setVariable(targetElement, '--mat-sys-body-medium', '400 0.875rem / 1.25rem Roboto');
    this.setVariable(targetElement, '--mat-sys-body-medium-font', 'Roboto');
    this.setVariable(targetElement, '--mat-sys-body-medium-line-height', '1.25rem');
    this.setVariable(targetElement, '--mat-sys-body-medium-size', '0.875rem');
    this.setVariable(targetElement, '--mat-sys-body-medium-tracking', '0.016rem');
    this.setVariable(targetElement, '--mat-sys-body-medium-weight', '400');
    this.setVariable(targetElement, '--mat-sys-body-small', '400 0.75rem / 1rem Roboto');
    this.setVariable(targetElement, '--mat-sys-body-small-font', 'Roboto');
    this.setVariable(targetElement, '--mat-sys-body-small-line-height', '1rem');
    this.setVariable(targetElement, '--mat-sys-body-small-size', '0.75rem');
    this.setVariable(targetElement, '--mat-sys-body-small-tracking', '0.025rem');
    this.setVariable(targetElement, '--mat-sys-body-small-weight', '400');
    this.setVariable(targetElement, '--mat-sys-display-large', '400 3.562rem / 4rem Roboto');
    this.setVariable(targetElement, '--mat-sys-display-large-font', 'Roboto');
    this.setVariable(targetElement, '--mat-sys-display-large-line-height', '4rem');
    this.setVariable(targetElement, '--mat-sys-display-large-size', '3.562rem');
    this.setVariable(targetElement, '--mat-sys-display-large-tracking', '-0.016rem');
    this.setVariable(targetElement, '--mat-sys-display-large-weight', '400');
    this.setVariable(targetElement, '--mat-sys-display-medium', '400 2.812rem / 3.25rem Roboto');
    this.setVariable(targetElement, '--mat-sys-display-medium-font', 'Roboto');
    this.setVariable(targetElement, '--mat-sys-display-medium-line-height', '3.25rem');
    this.setVariable(targetElement, '--mat-sys-display-medium-size', '2.812rem');
    this.setVariable(targetElement, '--mat-sys-display-medium-tracking', '0');
    this.setVariable(targetElement, '--mat-sys-display-medium-weight', '400');
    this.setVariable(targetElement, '--mat-sys-display-small', '400 2.25rem / 2.75rem Roboto');
    this.setVariable(targetElement, '--mat-sys-display-small-font', 'Roboto');
    this.setVariable(targetElement, '--mat-sys-display-small-line-height', '2.75rem');
    this.setVariable(targetElement, '--mat-sys-display-small-size', '2.25rem');
    this.setVariable(targetElement, '--mat-sys-display-small-tracking', '0');
    this.setVariable(targetElement, '--mat-sys-display-small-weight', '400');
    this.setVariable(targetElement, '--mat-sys-headline-large', '400 2rem / 2.5rem Roboto');
    this.setVariable(targetElement, '--mat-sys-headline-large-font', 'Roboto');
    this.setVariable(targetElement, '--mat-sys-headline-large-line-height', '2.5rem');
    this.setVariable(targetElement, '--mat-sys-headline-large-size', '2rem');
    this.setVariable(targetElement, '--mat-sys-headline-large-tracking', '0');
    this.setVariable(targetElement, '--mat-sys-headline-large-weight', '400');
    this.setVariable(targetElement, '--mat-sys-headline-medium', '400 1.75rem / 2.25rem Roboto');
    this.setVariable(targetElement, '--mat-sys-headline-medium-font', 'Roboto');
    this.setVariable(targetElement, '--mat-sys-headline-medium-line-height', '2.25rem');
    this.setVariable(targetElement, '--mat-sys-headline-medium-size', '1.75rem');
    this.setVariable(targetElement, '--mat-sys-headline-medium-tracking', '0');
    this.setVariable(targetElement, '--mat-sys-headline-medium-weight', '400');
    this.setVariable(targetElement, '--mat-sys-headline-small', '400 1.5rem / 2rem Roboto');
    this.setVariable(targetElement, '--mat-sys-headline-small-font', 'Roboto');
    this.setVariable(targetElement, '--mat-sys-headline-small-line-height', '2rem');
    this.setVariable(targetElement, '--mat-sys-headline-small-size', '1.5rem');
    this.setVariable(targetElement, '--mat-sys-headline-small-tracking', '0');
    this.setVariable(targetElement, '--mat-sys-headline-small-weight', '400');
    this.setVariable(targetElement, '--mat-sys-label-large', '500 0.875rem / 1.25rem Roboto');
    this.setVariable(targetElement, '--mat-sys-label-large-font', 'Roboto');
    this.setVariable(targetElement, '--mat-sys-label-large-line-height', '1.25rem');
    this.setVariable(targetElement, '--mat-sys-label-large-size', '0.875rem');
    this.setVariable(targetElement, '--mat-sys-label-large-tracking', '0.006rem');
    this.setVariable(targetElement, '--mat-sys-label-large-weight', '500');
    this.setVariable(targetElement, '--mat-sys-label-large-weight-prominent', '700');
    this.setVariable(targetElement, '--mat-sys-label-medium', '500 0.75rem / 1rem Roboto');
    this.setVariable(targetElement, '--mat-sys-label-medium-font', 'Roboto');
    this.setVariable(targetElement, '--mat-sys-label-medium-line-height', '1rem');
    this.setVariable(targetElement, '--mat-sys-label-medium-size', '0.75rem');
    this.setVariable(targetElement, '--mat-sys-label-medium-tracking', '0.031rem');
    this.setVariable(targetElement, '--mat-sys-label-medium-weight', '500');
    this.setVariable(targetElement, '--mat-sys-label-medium-weight-prominent', '700');
    this.setVariable(targetElement, '--mat-sys-label-small', '500 0.688rem / 1rem Roboto');
    this.setVariable(targetElement, '--mat-sys-label-small-font', 'Roboto');
    this.setVariable(targetElement, '--mat-sys-label-small-line-height', '1rem');
    this.setVariable(targetElement, '--mat-sys-label-small-size', '0.688rem');
    this.setVariable(targetElement, '--mat-sys-label-small-tracking', '0.031rem');
    this.setVariable(targetElement, '--mat-sys-label-small-weight', '500');
    this.setVariable(targetElement, '--mat-sys-title-large', '400 1.375rem / 1.75rem Roboto');
    this.setVariable(targetElement, '--mat-sys-title-large-font', 'Roboto');
    this.setVariable(targetElement, '--mat-sys-title-large-line-height', '1.75rem');
    this.setVariable(targetElement, '--mat-sys-title-large-size', '1.375rem');
    this.setVariable(targetElement, '--mat-sys-title-large-tracking', '0');
    this.setVariable(targetElement, '--mat-sys-title-large-weight', '400');
    this.setVariable(targetElement, '--mat-sys-title-medium', '500 1rem / 1.5rem Roboto');
    this.setVariable(targetElement, '--mat-sys-title-medium-font', 'Roboto');
    this.setVariable(targetElement, '--mat-sys-title-medium-line-height', '1.5rem');
    this.setVariable(targetElement, '--mat-sys-title-medium-size', '1rem');
    this.setVariable(targetElement, '--mat-sys-title-medium-tracking', '0.009rem');
    this.setVariable(targetElement, '--mat-sys-title-medium-weight', '500');
    this.setVariable(targetElement, '--mat-sys-title-small', '500 0.875rem / 1.25rem Roboto');
    this.setVariable(targetElement, '--mat-sys-title-small-font', 'Roboto');
    this.setVariable(targetElement, '--mat-sys-title-small-line-height', '1.25rem');
    this.setVariable(targetElement, '--mat-sys-title-small-size', '0.875rem');
    this.setVariable(targetElement, '--mat-sys-title-small-tracking', '0.006rem');
    this.setVariable(targetElement, '--mat-sys-title-small-weight', '500');
  }

}//Cls