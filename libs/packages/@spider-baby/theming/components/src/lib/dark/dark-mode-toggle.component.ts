import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SbThemePalette } from '@spider-baby/material-theming/config';
import { SbThemeService } from '@spider-baby/material-theming/service';

/**
 * A Material Design toggle component for switching between light and dark modes.
 * 
 * This component provides a visually appealing button that toggles between light and dark mode,
 * automatically updating its appearance based on the current mode. It integrates with
 * ThemeService to persist user preferences.
 * 
 * @example
 * ```html
 * <sb-dark-mode-toggle-mat [showTooltip]="true"/>
 * ```
 */
@Component({
  selector: 'sb-dark-mode-toggle-mat',
  standalone: true,
  imports: [
    NgTemplateOutlet,
    MatTooltipModule,
    MatSlideToggleModule,
  ],
  templateUrl: './dark-mode-toggle.component.html',
  styleUrls: ['./dark-mode-toggle.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[style.color]': '"var(--mat-sys-" + color() + ")"',
    '[class.show-switch]':'!hideSwitch()'
  },
})
export class SbDarkModeToggleMatComponent {

  private _themeService = inject(SbThemeService)

  //- - - - - - - - - - - - - - -//

  /**
   * Emits an event when the dark mode is toggled.
   * The event payload is a boolean indicating whether dark mode is enabled or not.
   */

  // Output: toggleIsDark
  toggleIsDark = output<boolean>();

  // Inputs: hideSwitch, color
  hideSwitch = input(true);
  color = input<SbThemePalette | undefined>(undefined);

  //- - - - - - - - - - - - - - -//

  protected isDark = this._themeService.isDarkMode

  //- - - - - - - - - - - - - - -//

  toggleDarkTheme = (isDark: boolean) => {
    this._themeService.setDarkMode(isDark ? 'dark' : 'light');
    this.toggleIsDark.emit(isDark);
  }

} //Cls

