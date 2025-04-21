import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MlThemeSelectorComponent } from "@moonlight/material/theming/selector";
import { MatEverythingModule } from '@moonlight/material/theming/utils';
import { MlThemeShowcaseMatComponent } from '@moonlight/material/theming/showcase';

@Component({
  selector: 'ml-theming',
  imports: [
    MatEverythingModule,
    MlThemeSelectorComponent,
    MlThemeShowcaseMatComponent
  ],
  templateUrl: './theming.component.html',
  styleUrl: './theming.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThemingComponent {



}
