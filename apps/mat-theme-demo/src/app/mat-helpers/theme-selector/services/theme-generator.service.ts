import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { argbFromHex, themeFromSourceColor, hexFromArgb, TonalPalette, CustomColor } from '@material/material-color-utilities';
import { BehaviorSubject } from 'rxjs';
import { ThemeColors } from '../../theme-colors';
import { GeneratedPalettes } from '../../theme-palletes';



@Injectable({
  providedIn: 'root'
})
export class ThemeGeneratorService {
  private renderer: Renderer2;
  private currentTheme$ = new BehaviorSubject<ThemeColors | null>(null);
  private isDark = false;

  // The tones we want to generate for each palette
  private tones = [0, 4, 6, 10, 12, 17, 20, 22, 24, 25, 30, 35, 40, 50, 60, 70, 80, 87, 90, 92, 94, 95, 96, 98, 99, 100];

  constructor(rendererFactory: RendererFactory2) {
    this.renderer = rendererFactory.createRenderer(null, null);
  }

  //-----------------------------//

  /**
   * Generate theme palettes from source colors
   */
  generatePalettes(colors: ThemeColors): GeneratedPalettes {
    const { primary, secondary, tertiary, error = '#B3261E' } = colors;

    // Convert hex colors to ARGB integers
    const primaryArgb = argbFromHex(primary);
    const secondaryArgb = argbFromHex(secondary);
    const tertiaryArgb = argbFromHex(tertiary || '#6750A4');
    const errorArgb = argbFromHex(error || '#B00020');  // Using Material Design's standard error color as fallback

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
      'neutral-variant': {}
    };

    // Generate primary, neutral and neutral-variant palettes from the theme
    for (const tone of this.tones) {
      palettes.primary[tone] = hexFromArgb(theme.palettes.primary.tone(tone));
      palettes.neutral[tone] = hexFromArgb(theme.palettes.neutral.tone(tone));
      palettes['neutral-variant'][tone] = hexFromArgb(theme.palettes.neutralVariant.tone(tone));
      palettes.error[tone] = hexFromArgb(theme.palettes.error.tone(tone));
    }

    // Create standalone palettes for secondary and tertiary
    // The library doesn't directly generate these palettes in the theme,
    // but we can create TonalPalettes from the corresponding colors
    const secondaryPalette = TonalPalette.fromInt(secondaryArgb);
    const tertiaryPalette = TonalPalette.fromInt(tertiaryArgb);

    for (const tone of this.tones) {
      palettes.secondary[tone] = hexFromArgb(secondaryPalette.tone(tone));
      palettes.tertiary[tone] = hexFromArgb(tertiaryPalette.tone(tone));
    }

    return palettes;
  }

  //-----------------------------//

  /**
   * Apply generated theme to the document using CSS variables
   */
  applyTheme(
    colors: ThemeColors,
    targetElement = document.documentElement,
    isDark = false, themeClass?: string) {
    this.isDark = isDark;
    this.currentTheme$.next(colors);

    const palettes = this.generatePalettes(colors);

    console.log(palettes);


    // Add a class to the body element for theme identification
    const rootElement = document.getRootNode();
    if (targetElement) {
      this.renderer.addClass(targetElement, 'my-test-class');
    }
    // targetElement = bodyElement
    // First, set the individual palette shade variables
    this.applyPaletteVariables(palettes, targetElement);

    // Then apply the M3 system variables using the direct mapper approach
    this.applySystemVariables(palettes, targetElement, isDark);

    // If we're setting an alternate theme, add the theme class
    if (themeClass) {
      console.log('themeClass', themeClass);
      this.renderer.addClass(targetElement, `theme-${themeClass}`);
    }

    // Add dark mode class if needed
    if (isDark) {
      this.renderer.addClass(targetElement, 'dark-mode');
    } else {
      this.renderer.removeClass(targetElement, 'dark-mode');
    }
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
          `--color-${paletteName}-${tone}`,
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
    console.log('targe', targetElement); 
    
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

    // Other variables match what your direct-palette-mapper.scss does
    // (add as many as needed)
  }

  //-----------------------------//

  /**
   * Helper to set a CSS variable
   */
  private setVariable(element: HTMLElement, name: string, value: string) {
    // this.renderer.setStyle(element, name, value);
    element.style.setProperty(name, value);
  }

  //-----------------------------//

  /**
   * Toggle between light and dark mode
   */
  toggleDarkMode() {
    const currentTheme = this.currentTheme$.value;
    if (currentTheme) {
      this.applyTheme(currentTheme, document.documentElement, !this.isDark);
    }
  }

  //-----------------------------//

  /**
   * Export current theme as SCSS
   * This can be useful for debugging or saving themes
   */
  exportThemeAsScss(): string {
    const theme = this.currentTheme$.value;
    if (!theme) return '';

    const palettes = this.generatePalettes(theme);
    let scss = '$palettes: (\n';

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

}//Cls