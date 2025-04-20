import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatEverythingModule } from '@moonlight/ng/theming/utils';
import { MlThemeAvatarComponent } from '@moonlight/ng/theming/ui';
import { ThemeService } from '@moonlight/ng/theming/service';

@Component({
  selector: 'ml-theme-showcase-mat',
  imports: [
    MatEverythingModule,
    MlThemeAvatarComponent
  ],
  templateUrl: './theme-showcase-mat.component.html',
  styleUrl: './theme-showcase-mat.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ThemeShowcaseMatComponent {

  private _service = inject(ThemeService)

  protected _theme = this._service.currentTheme

}
