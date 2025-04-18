import { isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID, RendererFactory2 } from '@angular/core';
import { COLOR_VAR_PREFIX, DARK_MODE_CLASS, THEME_CLASS_PREFIX, ThemeOption } from "@moonlight/ng/theming/config";
import { ColorUtilsService } from '@moonlight/ng/theming/utils';
import { GeneratedPalettes } from './models/theme-palletes';
import { PaletteGeneratorService } from './utils/palettes/palette-generator.service';
import { ScssPaletteGeneratorService } from './utils/scss/scss-palette-generator.service';
import { SytemPrefsService } from './utils/sytem-prefs/sytem-prefs.service';

//#########################################//

@Injectable({
  providedIn: 'root'
})
export class ThemeGeneratorService {

  private _platformId = inject(PLATFORM_ID)

  private _systemPrefs = inject(SytemPrefsService)

  private _rendererFactory = inject(RendererFactory2);
  private _renderer = this._rendererFactory.createRenderer(null, null);

  private _colorUtils = inject(ColorUtilsService);
  private _paletteGenerator = inject(PaletteGeneratorService)
  private _scssGenerator = inject(ScssPaletteGeneratorService)

  //- - - - - - - - - - - - - - -//

  private isBrowser = (): boolean =>
    isPlatformBrowser(this._platformId)

  //-----------------------------//
  // PUBLIC API METHODS
  //-----------------------------//

  /**
   * Apply generated theme to the document using CSS variables
   */
  applyTheme(
    theme: ThemeOption,
    themeClass?: string,
    targetElement?: HTMLElement) {

    const isDark = this.shouldUseDarkMode(theme)
    // this._currentThemeBs.next(theme);

    const palettes = this._paletteGenerator.generatePalettes(theme)

    this._applyTheme(palettes, isDark, themeClass, targetElement)
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

  private _applyTheme(
    palettes: GeneratedPalettes,
    isDark: boolean,
    themeClass: string | undefined,
    targetElement?: HTMLElement) {

    if (!this.isBrowser())
      return

    targetElement ??= document.documentElement

    // Batch DOM updates using requestAnimationFrame
    requestAnimationFrame(() => {

      // First, set the individual palette shade variables
      this.applyPaletteVariables(palettes, targetElement)

      // Then apply the M3 system variables using the direct mapper approach
      this.applySystemVariables(palettes, targetElement, isDark)

      // If we're setting an alternate theme, add the theme class
      if (themeClass)
        this._renderer.addClass(targetElement, `${THEME_CLASS_PREFIX}-${themeClass}`)

      // Add dark mode class if needed
      if (isDark)
        this._renderer.addClass(targetElement, DARK_MODE_CLASS)
      else
        this._renderer.removeClass(targetElement, DARK_MODE_CLASS)
    })

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
  private applySystemVariables(palettes: GeneratedPalettes, targetElement: HTMLElement, isDark: boolean) {

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

}//Cls