import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ThemeService } from '@spider-baby/material-theming/service';

/**
 * A Material Design toggle component for switching between light and dark modes.
 * 
 * This component provides a visually appealing button that toggles between light and dark mode,
 * automatically updating its appearance based on the current mode. It integrates with
 * ThemeService to persist user preferences.
 * 
 * @example
 * ```html
 * <sb-dark-mode-toggle-mat [showTooltip]="true"></sb-dark-mode-toggle-mat>
 * ```
 */
@Component({
  selector: 'sb-dark-mode-toggle-mat',
  standalone: true,
  imports: [
    NgTemplateOutlet,
    MatTooltipModule,
    MatSlideToggleModule
  ],
  templateUrl: './dark-mode-toggle.component.html',
  styleUrls: ['./dark-mode-toggle.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MlDarkModeToggleMatComponent {

  private _themeService = inject(ThemeService)

  //- - - - - - - - - - - - - - -//

  /**
   * Emits an event when the dark mode is toggled.
   * The event payload is a boolean indicating whether dark mode is enabled or not.
   */
  _isDarkEvent = output<boolean>({ alias: 'toggleIsDark' })

  /**
 * Controls whether to hide the switch UI element.
 * When true, only the icon will be visible wit`h cursor:pointer set.
 * @default true
 * @internal Use the [hideSwitch] template binding - do not access this property directly
 */
  _hideSwitch = input(true, { alias: 'hideSwitch' })

  //- - - - - - - - - - - - - - -//

  protected _isDark = this._themeService.isDarkMode

  //- - - - - - - - - - - - - - -//

  toggleDarkTheme = (isDark: boolean) =>{
    this._themeService.setDarkMode(isDark ? 'dark' : 'light')
    this._isDarkEvent.emit(isDark)
  }

} //Cls

