import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ThemeService } from '@spider-baby/material-theming/service';
import { MatEverythingModule } from '@spider-baby/material-theming/utils';

/**
 * A component that showcases Material Design components with the current theme.
 * 
 * This component displays a variety of Material Design components (buttons, cards,
 * form fields, etc.) styled with the currently active theme. It's useful for:
 * - Previewing how a theme looks across different component types
 * - Demonstrating available components and their themed appearance
 * - Testing theme consistency across the component library
 * 
 * @example
 * ```html
 * <!-- Simple usage -->
 * <ml-theme-showcase-mat></ml-theme-showcase-mat>
 * 
 * <!-- In a themed container -->
 * <div class="themed-preview">
 *   <h2>Theme Preview</h2>
 *   <ml-theme-showcase-mat></ml-theme-showcase-mat>
 * </div>
 * ```
 */
@Component({
  selector: 'ml-theme-showcase-mat',
  imports: [
    MatEverythingModule
  ],
  templateUrl: './theme-showcase-mat.component.html',
  styleUrl: './theme-showcase-mat.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MlThemeShowcaseMatComponent {

  /** The theme service that provides the current theme */
  private _service = inject(ThemeService)

  /** Signal with the current theme, updated automatically when theme changes */
  protected _theme = this._service.currentTheme
  
}
