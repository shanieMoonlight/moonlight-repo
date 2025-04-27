import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MlDarkModeToggleMatComponent, MlThemePickerMatComponent } from '@spider-baby/material-theming/components';
import { MatEverythingModule } from '@spider-baby/material-theming/utils';
import { ApiNavbarComponent } from './ui/navbar/navbar.component';


@Component({
  imports: [
    MatEverythingModule,
    ApiNavbarComponent,
    MlDarkModeToggleMatComponent,
    MlThemePickerMatComponent,
    RouterModule
  ],
  providers: [
  ],
  selector: 'sb-api-root',
  templateUrl: './api.component.html',
  styleUrl: './api.component.scss',
})
export class ApiComponent {
  

}//Cls
