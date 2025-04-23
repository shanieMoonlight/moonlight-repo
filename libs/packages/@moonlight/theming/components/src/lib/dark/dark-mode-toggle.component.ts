import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ThemeService } from '@moonlight/material/theming/service';

/**
 * A Material Design toggle component for switching between light and dark modes.
 * 
 * This component provides a visually appealing button that toggles between light and dark mode,
 * automatically updating its appearance based on the current mode. It integrates with
 * ThemeService to persist user preferences.
 * 
 * @example
 * ```html
 * <ml-dark-mode-toggle-mat [showTooltip]="true"></ml-dark-mode-toggle-mat>
 * ```
 */
@Component({
  selector: 'ml-dark-mode-toggle-mat',
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
 * Controls whether to hide the switch UI element.
 * When true, only the icon will be visible wit`h cursor:pointer set.
 * @default true
 * @internal Use the [hideSwitch] template binding - do not access this property directly
 */
  _hideSwitch = input(true, { alias: 'hideSwitch' })

  //- - - - - - - - - - - - - - -//

  protected _isDark = toSignal(this._themeService.isDarkMode$)

  //- - - - - - - - - - - - - - -//

  toggleDarkTheme = (checked: boolean) =>
    this._themeService.setDarkMode(checked ? 'dark' : 'light')  

} //Cls

