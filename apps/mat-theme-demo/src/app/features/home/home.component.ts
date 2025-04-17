import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ThemeSelectorComponent } from "../../mat-helpers/theme-selector/theme-selector.component";
import { MatEverythingModule } from '../../utils/mat-everything-modules';

@Component({
  selector: 'ml-home',
  imports: [
    MatEverythingModule,
    ThemeSelectorComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {



}
