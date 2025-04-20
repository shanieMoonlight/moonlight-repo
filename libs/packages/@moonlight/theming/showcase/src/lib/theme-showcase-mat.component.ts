import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ThemeService } from '@moonlight/ng/theming/service';
import { MatEverythingModule } from '@moonlight/ng/theming/utils';

@Component({
  selector: 'ml-theme-showcase-mat',
  imports: [
    MatEverythingModule
  ],
  templateUrl: './theme-showcase-mat.component.html',
  styleUrl: './theme-showcase-mat.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ThemeShowcaseMatComponent {

  private _service = inject(ThemeService)

  protected _theme = this._service.currentTheme

}
