import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MlThemeSelectorComponent } from "@moonlight/ng/theming/selector";
import { MatEverythingModule } from '@moonlight/ng/theming/utils';
import { MlThemeShowcaseMatComponent } from '@moonlight/ng/theming/showcase';

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
