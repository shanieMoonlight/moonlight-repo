import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MlDarkModeToggleMatComponent, MlThemePickerMatComponent } from '@spider-baby/material-theming/components';
import { MatEverythingModule } from '@spider-baby/material-theming/utils';
import { MainNavbarComponent } from './ui/navbar/navbar.component';
import { IconsService } from './utils/icons/icons.service';

@Component({
  imports: [
    MatEverythingModule,
    MainNavbarComponent,
    MlDarkModeToggleMatComponent,
    MlThemePickerMatComponent,
    RouterModule
  ],
  providers: [],
  selector: 'sb-firebase-root',
  templateUrl: './firebase.component.html',
  styleUrl: './firebase.component.scss',
})
export class FirebaseComponent {

  iconsService = inject(IconsService)

}//Cls
