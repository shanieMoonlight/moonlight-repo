import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ThemeSelectorComponent } from "../../mat-helpers/theme-selector/theme-selector.component";
import { MatEverythingModule } from '../../utils/mat-everything-modules';
import { ThemeShowcaseMatComponent } from '../../mat-helpers/theme-showcase-mat/theme-showcase-mat.component';

@Component({
  selector: 'ml-theming',
  imports: [
    MatEverythingModule,
    ThemeSelectorComponent,
    ThemeShowcaseMatComponent
  ],
  templateUrl: './theming.component.html',
  styleUrl: './theming.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThemingComponent {



}
