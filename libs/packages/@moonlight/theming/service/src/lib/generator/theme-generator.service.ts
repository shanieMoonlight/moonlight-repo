import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID, RendererFactory2 } from '@angular/core';
import { COLOR_VAR_PREFIX, DARK_MODE_CLASS, THEME_CLASS_PREFIX, ThemeOption } from "@moonlight/material/theming/config";
import { ColorUtilsService } from '@moonlight/material/theming/utils';
import { AnimationFrameService } from '@moonlight/utils/testing';
import { GeneratedPalettes } from './models/theme-palletes';
import { PaletteGeneratorService } from './utils/palettes/palette-generator.service';
import { ScssPaletteGeneratorService } from './utils/scss/scss-palette-generator.service';
import { SytemPrefsService } from './utils/sytem-prefs/sytem-prefs.service';
import { MemoizationService } from '@moonlight/utils/memoization';

//#########################################//

@Injectable({
  providedIn: 'root'
})
export class ThemeGeneratorService {

  //TODO Colors are upside down
  private _platformId = inject(PLATFORM_ID)
  private _document = inject(DOCUMENT);

  private _requestFrame = inject(AnimationFrameService);

  private _memoizer = inject(MemoizationService);

  private _systemPrefs = inject(SytemPrefsService)

  private _rendererFactory = inject(RendererFactory2);
  private _renderer = this._rendererFactory.createRenderer(null, null);

  private _colorUtils = inject(ColorUtilsService);
  private _paletteGenerator = inject(PaletteGeneratorService)
  private _scssGenerator = inject(ScssPaletteGeneratorService)

  //- - - - - - - - - - - - - - -//


  // Additional class fields for memoized functions...
  private _memoizedGeneratePalettes!: (...args: any[]) => GeneratedPalettes;


  //-----------------------------//

  constructor() {
    this.initializeMemoizedFunctions()
  }

  //-----------------------------//
  // PUBLIC API METHODS
  //-----------------------------//

  /**
   * Apply generated theme to the document using CSS variables
   */
  applyTheme(
    theme: ThemeOption,
    themeClassOverride?: string,
    targetElement?: HTMLElement) {


    if (!this.isBrowser())
      return

    const isDark = this.shouldUseDarkMode(theme)
    // const palettes = this._paletteGenerator.generatePalettes(theme)
    // Use memoized function instead of direct call
    const palettes = this._memoizedGeneratePalettes(theme);
    const themeClass = themeClassOverride ?? theme.value

    targetElement ??= this._document.documentElement

    // Batch DOM updates using requestAnimationFrame
    this._requestFrame.request(() => {

      // First, set the individual palette shade variables
      this.applyPaletteVariables(palettes, targetElement)

      // Then apply the M3 system variables using the direct mapper approach
      this.applySystemVariables(theme, palettes, targetElement, isDark)

      // Set the theme class users might want to react to different classes outside of material situations.  (theme-xmas, theme-halloween, etc.)
      if (themeClass)
        this._renderer.addClass(targetElement, `${THEME_CLASS_PREFIX}-${themeClass}`)

      // Add dark mode class if needed
      if (isDark)
        this._renderer.addClass(targetElement, DARK_MODE_CLASS)
      else
        this._renderer.removeClass(targetElement, DARK_MODE_CLASS)
    })
  }

  //-----------------------------//

  /**
   * Export current theme as SCSS
   * This can be useful for debugging or saving themes
   */
  exportThemeAsScss = (theme: ThemeOption): string =>
    theme ? this._scssGenerator.exportThemeAsScss(theme) : ''

  //-----------------------------//
  // PRIVATE METHODS
  //-----------------------------//

  /**
   * Apply palette shade variables to the target element
   */
  private applyPaletteVariables(palettes: GeneratedPalettes, targetElement: HTMLElement) {

    // Set variables for each palette type
    Object.entries(palettes).forEach(([paletteName, shades]) => {
      Object.entries(shades).forEach(([tone, colorValue]) => {
        // Use setProperty instead of setStyle for CSS custom properties       

        targetElement.style.setProperty(
          `--${COLOR_VAR_PREFIX}-${paletteName}-${tone}`,
          `${colorValue}`
        )
      })
    })
  }

  //- - - - - - - - - - - - - - -//

  /**
   * Apply M3 system variables based on the direct-palette-mapper approach
   */
  private applySystemVariables(theme: ThemeOption, palettes: GeneratedPalettes, targetElement: HTMLElement, isDark: boolean) {

    const p = palettes;

    // M3 colors - Primary
    this.setVariable(targetElement, '--mat-sys-primary', p.primary[isDark ? 80 : 40]);
    this.setVariable(targetElement, '--mat-sys-on-primary', p.primary[isDark ? 20 : 100]);
    this.setVariable(targetElement, '--mat-sys-primary-container', p.primary[isDark ? 30 : 90]);
    this.setVariable(targetElement, '--mat-sys-on-primary-container', p.primary[isDark ? 90 : 10]);

    // M3 colors - Secondary
    this.setVariable(targetElement, '--mat-sys-secondary', p.secondary[isDark ? 80 : 40]);
    this.setVariable(targetElement, '--mat-sys-on-secondary', p.secondary[isDark ? 20 : 100]);
    this.setVariable(targetElement, '--mat-sys-secondary-container', p.secondary[isDark ? 30 : 90]);
    this.setVariable(targetElement, '--mat-sys-on-secondary-container', p.secondary[isDark ? 90 : 10]);

    // M3 colors - Tertiary
    this.setVariable(targetElement, '--mat-sys-tertiary', p.tertiary[isDark ? 80 : 40]);
    this.setVariable(targetElement, '--mat-sys-on-tertiary', p.tertiary[isDark ? 20 : 100]);
    this.setVariable(targetElement, '--mat-sys-tertiary-container', p.tertiary[isDark ? 30 : 90]);
    this.setVariable(targetElement, '--mat-sys-on-tertiary-container', p.tertiary[isDark ? 90 : 10]);

    // M3 colors - Error
    this.setVariable(targetElement, '--mat-sys-error', p.error[isDark ? 80 : 40]);
    this.setVariable(targetElement, '--mat-sys-on-error', p.error[isDark ? 20 : 100]);
    this.setVariable(targetElement, '--mat-sys-error-container', p.error[isDark ? 30 : 90]);
    this.setVariable(targetElement, '--mat-sys-on-error-container', p.error[isDark ? 90 : 10]);

    // M3 Surface and background colors
    this.setVariable(targetElement, '--mat-sys-background', p.neutral[isDark ? 6 : 99]);
    this.setVariable(targetElement, '--mat-sys-on-background', p.neutral[isDark ? 90 : 10]);
    this.setVariable(targetElement, '--mat-sys-surface', p.neutral[isDark ? 6 : 99]);
    this.setVariable(targetElement, '--mat-sys-on-surface', p.neutral[isDark ? 90 : 10]);

    // Additional surface variants (simplified list)
    this.setVariable(targetElement, '--mat-sys-surface-container', p.neutral[isDark ? 12 : 94]);
    this.setVariable(targetElement, '--mat-sys-surface-container-low', p.neutral[isDark ? 10 : 96]);
    this.setVariable(targetElement, '--mat-sys-surface-container-high', p.neutral[isDark ? 17 : 92]);

    // Primary fixed variants
    this.setVariable(targetElement, '--mat-sys-primary-fixed', p.primary[90]);
    this.setVariable(targetElement, '--mat-sys-primary-fixed-dim', p.primary[80]);
    this.setVariable(targetElement, '--mat-sys-on-primary-fixed', p.primary[10]);
    this.setVariable(targetElement, '--mat-sys-on-primary-fixed-variant', p.primary[30]);

    // Secondary fixed variants
    this.setVariable(targetElement, '--mat-sys-secondary-fixed', p.secondary[90]);
    this.setVariable(targetElement, '--mat-sys-secondary-fixed-dim', p.secondary[80]);
    this.setVariable(targetElement, '--mat-sys-on-secondary-fixed', p.secondary[10]);
    this.setVariable(targetElement, '--mat-sys-on-secondary-fixed-variant', p.secondary[30]);

    // Tertiary fixed variants
    this.setVariable(targetElement, '--mat-sys-tertiary-fixed', p.tertiary[90]);
    this.setVariable(targetElement, '--mat-sys-tertiary-fixed-dim', p.tertiary[80]);

    // Additional surface variants
    this.setVariable(targetElement, '--mat-sys-surface-variant', p.neutralVariant[isDark ? 30 : 90]);
    this.setVariable(targetElement, '--mat-sys-on-surface-variant', p.neutralVariant[isDark ? 80 : 30]);
    this.setVariable(targetElement, '--mat-sys-surface-container-lowest', p.neutral[isDark ? 4 : 100]);
    this.setVariable(targetElement, '--mat-sys-surface-container-highest', p.neutral[isDark ? 22 : 90]);
    this.setVariable(targetElement, '--mat-sys-surface-dim', p.neutral[isDark ? 6 : 87]);
    this.setVariable(targetElement, '--mat-sys-surface-bright', p.neutral[isDark ? 24 : 98]);

    // Outline colors
    this.setVariable(targetElement, '--mat-sys-outline', p.neutralVariant[isDark ? 60 : 50]);
    this.setVariable(targetElement, '--mat-sys-outline-variant', p.neutralVariant[isDark ? 30 : 80]);

    // Inverse colors
    this.setVariable(targetElement, '--mat-sys-inverse-primary', p.primary[isDark ? 40 : 80]);
    this.setVariable(targetElement, '--mat-sys-inverse-surface', p.neutral[isDark ? 90 : 20]);
    this.setVariable(targetElement, '--mat-sys-inverse-on-surface', p.neutral[isDark ? 20 : 95]);

    // Miscellaneous
    this.setVariable(targetElement, '--mat-sys-surface-tint', p.primary[80]);
    this.setVariable(targetElement, '--mat-sys-scrim', p.neutral[0]);
    this.setVariable(targetElement, '--mat-sys-shadow', p.neutral[0]);

    // Additional useful values for Angular Material
    this.setVariable(targetElement, '--mat-sys-neutral10', p.neutral[10]);
    this.setVariable(targetElement, '--mat-sys-neutral-variant20', p.neutralVariant[20]);


    // Add original seed colors for direct access
    this.setVariable(targetElement, '--mat-seed-primary', theme.primaryColor);
    this.setVariable(targetElement, '--mat-seed-secondary', theme.secondaryColor);
    this.setVariable(targetElement, '--mat-seed-tertiary', theme.tertiaryColor || theme.secondaryColor);
    this.setVariable(targetElement, '--mat-seed-error', theme.errorColor || '#B3261E');

    // Add RGB variables for transparency effects
    this.addRGBVariables(p, targetElement, isDark);
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

    // Surface colors
    this._colorUtils.setRGBVariable(targetElement, '--mat-sys-surface-rgb', p.neutral[isDark ? 6 : 99]);
    this._colorUtils.setRGBVariable(targetElement, '--mat-sys-on-surface-rgb', p.neutral[isDark ? 90 : 10]);

    // Error colors
    this._colorUtils.setRGBVariable(targetElement, '--mat-sys-error-rgb', p.error[isDark ? 80 : 40]);

    // Background
    this._colorUtils.setRGBVariable(targetElement, '--mat-sys-background-rgb', p.neutral[isDark ? 6 : 99])

  }

  //- - - - - - - - - - - - - - -//

  private shouldUseDarkMode = (theme: ThemeOption): boolean => theme.darkMode === 'system'
    ? this._systemPrefs.prefersDarkMode()
    : !!theme.darkMode;


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

}//Cls