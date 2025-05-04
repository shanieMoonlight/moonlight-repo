import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MlDarkModeToggleMatComponent, MlThemePickerMatComponent } from '@spider-baby/material-theming/components';
import { MatEverythingModule } from '@spider-baby/material-theming/utils';

@Component({
  selector: 'sb-home-cards',
  imports: [
    MatEverythingModule,
    MlThemePickerMatComponent,
    MlDarkModeToggleMatComponent,
    RouterModule
  ],
  templateUrl: './cards.component.html',
  styleUrl: './cards.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardsComponent {}
