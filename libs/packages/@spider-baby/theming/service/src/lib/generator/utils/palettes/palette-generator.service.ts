import { inject, Injectable } from '@angular/core';
import { argbFromHex, hexFromArgb, themeFromSourceColor, TonalPalette } from '@material/material-color-utilities';
import { DEFAULT_COLOR_ERROR, DEFAULT_COLOR_PRIMARY, DEFAULT_COLOR_SECONDARY, DEFAULT_COLOR_TERTIARY, ThemeConfigService, ThemeOption, ThemingConfig } from '@spider-baby/material-theming/config';
import { GeneratedPalettes } from '../../models/theme-palletes';

@Injectable({
  providedIn: 'root'
})
export class PaletteGeneratorService {

  private _config: ThemingConfig = inject(ThemeConfigService)

  //-----------------------------//

  /**
   * Generates a complete color palette from a base color.
   * 
   * This method creates a set of color variations (lighter and darker shades)
   * that can be used throughout the application for consistent styling.
   * 
   * @param baseColor The hex color code to generate a palette from (e.g., '#3f51b5')
   * @param tones Optional array of tonal values to generate (defaults to [50, 100, 200, ...])
   * @returns An object containing the primary color and all its tonal variations
   */
  generatePalettes(themeOption: ThemeOption): GeneratedPalettes {
    // consoleDev.log('Generating palettes...', themeOption.label, themeOption)

    const primary = themeOption.primaryColor ?? DEFAULT_COLOR_PRIMARY;
    const secondary = themeOption.secondaryColor ?? DEFAULT_COLOR_SECONDARY;
    const tertiary = themeOption.tertiaryColor ?? DEFAULT_COLOR_TERTIARY;
    const error = themeOption.errorColor ?? DEFAULT_COLOR_ERROR;


    // Convert hex colors to ARGB integers
    const primaryArgb = argbFromHex(primary);
    const secondaryArgb = argbFromHex(secondary);
    const tertiaryArgb = argbFromHex(tertiary || DEFAULT_COLOR_TERTIARY);
    const errorArgb = argbFromHex(error || DEFAULT_COLOR_ERROR);  // Using Material Design's standard error color as fallback


    // Generate theme using Material Color Utilities
    const theme = themeFromSourceColor(primaryArgb);    
    
    // Create standalone palettes for secondary and tertiary
    const secondaryPalette = TonalPalette.fromInt(secondaryArgb)    
    const tertiaryPalette = TonalPalette.fromInt(tertiaryArgb);
    
    //themeFromSourceColor generates errror pallette with default colors, so we create our own
    const errorPalette = TonalPalette.fromInt(errorArgb);
    
    // Use sanitized tones
    const sanitizedTones = this.sanitizeColorTones(this._config.colorTones);

    

    // Extract palettes
    const palettes: GeneratedPalettes = {
      primary: {},
      secondary: {},
      tertiary: {},
      error: {},
      neutral: {},
      neutralVariant: {}
    };
    
    // Generate all palettes in a single loop
    for (const tone of sanitizedTones) {
      palettes.primary[tone] = hexFromArgb(theme.palettes.primary.tone(tone));
      palettes.neutral[tone] = hexFromArgb(theme.palettes.neutral.tone(tone));
      palettes.neutralVariant[tone] = hexFromArgb(theme.palettes.neutralVariant.tone(tone));

      palettes.error[tone] = hexFromArgb(errorPalette.tone(tone));
      palettes.secondary[tone] = hexFromArgb(secondaryPalette.tone(tone));
      palettes.tertiary[tone] = hexFromArgb(tertiaryPalette.tone(tone));
    }
    
    return palettes
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
