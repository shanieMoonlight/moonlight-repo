import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MlThemeSelectorComponent } from "@spider-baby/material-theming/customizer";
import { MatEverythingModule } from '@spider-baby/material-theming/utils';
import { MlThemeShowcaseMatComponent } from '@spider-baby/material-theming/showcase';

@Component({
  selector: 'sb-customization',
  imports: [
    MatEverythingModule,
    MlThemeSelectorComponent,
    MlThemeShowcaseMatComponent
  ],
  templateUrl: './customization.component.html',
  styleUrl: './customization.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomizationComponent {



}
