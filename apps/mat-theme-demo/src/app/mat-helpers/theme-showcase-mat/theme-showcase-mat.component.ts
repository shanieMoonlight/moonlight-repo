import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatEverythingModule } from '../../utils/mat-everything-modules';

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

}
