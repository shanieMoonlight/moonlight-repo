import { inject, Injectable } from '@angular/core';
import { GeneratedPalettes } from '../../models/theme-palletes';
import { argbFromHex, CustomColor, themeFromSourceColor, TonalPalette, hexFromArgb } from '@material/material-color-utilities';
import { ThemeOption, DEFAULT_COLOR_PRIMARY, DEFAULT_COLOR_SECONDARY, DEFAULT_COLOR_TERTIARY, DEFAULT_COLOR_ERROR, ThemeConfig, ThemeConfigService } from '@moonlight/ng/theming/config';

@Injectable({
  providedIn: 'root'
})
export class PaletteGeneratorService {

  private _config: ThemeConfig = inject(ThemeConfigService)
  
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
   * Sanitizes color tones to ensure they're valid integers between 0 and 100
   * @private
   */
  private sanitizeColorTones = (tones: number[]): number[] => tones
    .map(tone => Math.round(tone)) // Round to nearest integer
    .filter(tone => tone >= 0 && tone <= 100) // Only keep values in valid range
    .sort((a, b) => a - b) /* Sort numerically*/

  //-----------------------------//

}//Cls
