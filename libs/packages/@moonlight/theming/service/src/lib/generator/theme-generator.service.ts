import { inject, Injectable, RendererFactory2 } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { argbFromHex, CustomColor, hexFromArgb, themeFromSourceColor, TonalPalette } from '@material/material-color-utilities';
import { COLOR_VAR_PREFIX, DARK_MODE_CLASS, DEFAULT_COLOR_ERROR, DEFAULT_COLOR_PRIMARY, DEFAULT_COLOR_SECONDARY, DEFAULT_COLOR_TERTIARY, PALLETES_MAP_SCSS_VAR, THEME_CLASS_PREFIX, ThemeConfig, ThemeConfigService, ThemeOption } from "@moonlight/ng/theming/config";
import { ColorUtilsService } from '@moonlight/ng/theming/utils';
import { BehaviorSubject } from 'rxjs';
import { GeneratedPalettes } from './models/theme-palletes';

//#########################################//

@Injectable({
  providedIn: 'root'
})
export class ThemeGeneratorService {

  private _rendererFactory = inject(RendererFactory2);
  private _renderer = this._rendererFactory.createRenderer(null, null);

  private _colorUtils = inject(ColorUtilsService);

  private _config: ThemeConfig = inject(ThemeConfigService)

  //- - - - - - - - - - - - - - -//

  private currentTheme$ = new BehaviorSubject<ThemeOption | null>(null);
  currentTheme = toSignal(this.currentTheme$)

  //-----------------------------//

  /**
   * Generate theme palettes from source colors
   */
  generatePalettes(themeOption: ThemeOption): GeneratedPalettes {

    const primary = themeOption.primaryColor ?? DEFAULT_COLOR_PRIMARY;
    const secondary = themeOption.secondaryColor ?? DEFAULT_COLOR_SECONDARY;
    const tertiary = themeOption.tertiaryColor ?? DEFAULT_COLOR_TERTIARY;
    const error = themeOption.errorColor ?? DEFAULT_COLOR_ERROR;



    // Convert hex colors to ARGB integers
    const primaryArgb = argbFromHex(primary);
    const secondaryArgb = argbFromHex(secondary);
    const tertiaryArgb = argbFromHex(tertiary || DEFAULT_COLOR_TERTIARY);
    const errorArgb = argbFromHex(error || DEFAULT_COLOR_ERROR);  // Using Material Design's standard error color as fallback

    // Create custom colors array for the additional colors
    const customColors: CustomColor[] = [
      {
        value: secondaryArgb,
        name: 'secondary',
        blend: true
      },
      {
        value: tertiaryArgb,
        name: 'tertiary',
        blend: true
      },
      {
        value: errorArgb,
        name: 'error',
        blend: true
      }
    ];

    // Generate theme using Material Color Utilities
    const theme = themeFromSourceColor(primaryArgb, customColors);

    // Extract palettes
    const palettes: GeneratedPalettes = {
      primary: {},
      secondary: {},
      tertiary: {},
      error: {},
      neutral: {},
      neutralVariant: {}
    };

    // Create standalone palettes for secondary and tertiary
    const secondaryPalette = TonalPalette.fromInt(secondaryArgb);
    console.log('secondaryPalette', secondaryPalette);

    const tertiaryPalette = TonalPalette.fromInt(tertiaryArgb);


    // Use sanitized tones
    const sanitizedTones = this.sanitizeColorTones(this._config.colorTones);

    // Generate all palettes in a single loop
    for (const tone of sanitizedTones) {
      palettes.primary[tone] = hexFromArgb(theme.palettes.primary.tone(tone));
      palettes.neutral[tone] = hexFromArgb(theme.palettes.neutral.tone(tone));
      palettes.neutralVariant[tone] = hexFromArgb(theme.palettes.neutralVariant.tone(tone));
      palettes.error[tone] = hexFromArgb(theme.palettes.error.tone(tone));
      palettes.secondary[tone] = hexFromArgb(secondaryPalette.tone(tone));
      palettes.tertiary[tone] = hexFromArgb(tertiaryPalette.tone(tone));
    }

    return palettes

  }

  //-----------------------------//

  /**
   * Apply generated theme to the document using CSS variables
   */
  applyTheme(
    colors: ThemeOption,
    targetElement = document.documentElement,
    isDark = false,
    themeClass?: string) {

    this.currentTheme$.next(colors);

    const palettes = this.generatePalettes(colors)

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

  }

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
        );
      });
    });
  }

  //-----------------------------//

  /**
   * Apply M3 system variables based on the direct-palette-mapper approach
   */
  private applySystemVariables(palettes: GeneratedPalettes, targetElement: HTMLElement, isDark: boolean) {
    // console.log('target', targetElement);

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

  //-----------------------------//

  /**
   * Helper to set a CSS variable
   */
  private setVariable = (element: HTMLElement, name: string, value: string) =>
    element.style.setProperty(name, value)

  //-----------------------------//

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

  //-----------------------------//


  //TODO: remove this method
  /**
   * Toggle between light and dark mode
   */
  toggleDarkMode(isDark: boolean) {
    const currentTheme = this.currentTheme();
    if (currentTheme)
      this.applyTheme(currentTheme, document.documentElement, isDark)
  }

  //-----------------------------//

  /**
   * Export current theme as SCSS
   * This can be useful for debugging or saving themes
   */
  exportThemeAsScss(): string {
    const theme = this.currentTheme$.value;
    if (!theme) return '';

    // Generate comments about the source colors first
    const commentHeader = this.generateScssComments(theme);

    const palettes = this.generatePalettes(theme);
    let scss = commentHeader + PALLETES_MAP_SCSS_VAR + ': (\n';

    // Build SCSS representation of palettes
    Object.entries(palettes).forEach(([paletteName, shades]) => {
      if (paletteName === 'primary') {
        // Primary is at the root level
        Object.entries(shades).forEach(([tone, color]) => {
          scss += `  ${tone}: ${color},\n`;
        });
      } else {
        // Other palettes are nested
        scss += `  ${paletteName}: (\n`;
        Object.entries(shades).forEach(([tone, color]) => {
          scss += `    ${tone}: ${color},\n`;
        });
        scss += '  ),\n';
      }
    });

    scss += ');\n';

    return scss;
  }

  //-----------------------------//

  /**
   * Generates SCSS comments with theme source information
   * @private
   */
  private generateScssComments(theme: ThemeOption): string {
    let comments = '// Generated Material Theme SCSS\n';
    comments += '// Source Colors:\n';
    comments += `// Primary: ${theme.primaryColor}\n`;
    comments += `// Secondary: ${theme.secondaryColor}\n`;

    if (theme.tertiaryColor)
      comments += `// Tertiary: ${theme.tertiaryColor}\n`;
    else
      comments += `// Tertiary: ${DEFAULT_COLOR_TERTIARY} (default)\n`;

    if (theme.errorColor)
      comments += `// Error: ${theme.errorColor}\n`; // Updated to use errorColor
    else
      comments += `// Error: ${DEFAULT_COLOR_ERROR} (default)\n`;

    comments += '\n';

    return comments;
  }

  //-----------------------------//

  /**
   * Sanitizes color tones to ensure they're valid integers between 0 and 100
   * @private
   */
  private sanitizeColorTones = (tones: number[]): number[] => tones
    .map(tone => Math.round(tone)) // Round to nearest integer
    .filter(tone => tone >= 0 && tone <= 100) // Only keep values in valid range
    .sort((a, b) => a - b) /* Sort numerically*/

}//Cls