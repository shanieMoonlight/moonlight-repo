import { Directive, ElementRef, inject, Input } from '@angular/core';
import { ThemeOption, ThemeValue } from '@spider-baby/material-theming/config';
import { ThemeService } from '@spider-baby/material-theming/service';

/**
 * Directive that applies a theme to an element.
 * 
 * @example
 * // Apply theme using a ThemeOption object
 * <div [sbApplyTheme]="themeObject"></div>
 */
@Directive({
  selector: '[sbApplyTheme]',
  standalone: true
})
export class MlApplyThemeDirective {

  private _themeService = inject(ThemeService);
  private _elementRef = inject(ElementRef)

  //---------------------------------//

  /**
   * Sets the theme to apply to the host element.
   * Accepts either a ThemeOption object or a ThemeValue (string/number).
   * 
   * @param val - The theme to apply. Can be a ThemeOption object or a ThemeValue string/number.
   */
  @Input('sbApplyTheme')
  set theme(val: ThemeOption | undefined | null) {
    if (val) {
      this._themeService.applyTheme(
        val,
        this._elementRef.nativeElement
      )
    }
  }


}//Cls