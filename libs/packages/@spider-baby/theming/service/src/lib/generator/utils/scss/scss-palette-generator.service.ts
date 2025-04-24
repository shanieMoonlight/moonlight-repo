import { inject, Injectable } from '@angular/core';
import { DEFAULT_COLOR_ERROR, DEFAULT_COLOR_TERTIARY, PALETTES_MAP_SCSS_VAR, ThemeOption } from '@spider-baby/material-theming/config';
import { PaletteGeneratorService } from '../palettes/palette-generator.service';

@Injectable({
  providedIn: 'root'
})
export class ScssPaletteGeneratorService {

  private _paletteGenerator = inject(PaletteGeneratorService);

  //-----------------------------//

  /**
   * Export current theme as SCSS
   * This can be useful for debugging or saving themes
   */
  exportThemeAsScss(theme: ThemeOption): string {

    if (!theme) return ''

    // Generate comments about the source colors first
    const commentHeader = this.generateScssComments(theme);

    const palettes = this._paletteGenerator.generatePalettes(theme);
    let scss = commentHeader + PALETTES_MAP_SCSS_VAR + ': (\n';

    // Build SCSS representation of palettes
    Object.entries(palettes).forEach(([paletteName, shades]) => {
      if (paletteName === 'primary') {
        // Primary is at the root level
        Object.entries(shades).forEach(([tone, color]) => {
          scss += `  ${tone}: ${color},\n`;
        })
      } else {
        // Other palettes are nested
        scss += `  ${paletteName}: (\n`;
        Object.entries(shades).forEach(([tone, color]) => {
          scss += `    ${tone}: ${color},\n`;
        });
        scss += '  ),\n';
      }
    })

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

    comments += '\n'

    return comments

  }
  
  //-----------------------------//

}//Cls
