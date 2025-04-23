import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MlThemeSelectorComponent } from "@moonlight/material/theming/customizer";
import { MatEverythingModule } from '@moonlight/material/theming/utils';
import { MlThemeShowcaseMatComponent } from '@moonlight/material/theming/showcase';

@Component({
  selector: 'ml-customization',
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
