import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ThemeService } from '@moonlight/ng/theming/service';


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
export class DarkModeToggle_Mat_Component {

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
    this._themeService.setDarkMode(checked)  

} //Cls

