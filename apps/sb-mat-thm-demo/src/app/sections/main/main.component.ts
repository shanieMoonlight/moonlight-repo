import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MlDarkModeToggleMatComponent, MlThemePickerMatComponent } from '@spider-baby/material-theming/components';
import { MatEverythingModule } from '@spider-baby/material-theming/utils';
import { environment } from "../../../environments/environment";
import { MainNavbarComponent } from './ui/navbar/navbar.component';
import { IconsService } from './utils/icons/icons.service';
import { MyFirebaseService } from '../../firebase/my-firebase/my-firebase.service';

@Component({
  imports: [
    MatEverythingModule,
    MainNavbarComponent,
    MlDarkModeToggleMatComponent,
    MlThemePickerMatComponent,
    RouterModule
  ],
  providers: [],
  selector: 'sb-main-root',
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss',
})
export class MainComponent {

  iconsService = inject(IconsService)
  myFirebase = inject(MyFirebaseService)

  constructor() {
    this.myFirebase.logConnectionTest()
    console.log('test:firebaseAppName:',  this.myFirebase.appName);
    console.log('test:environment:', environment);
    console.log('test:firebaseConfig:', environment.firebaseConfig);
    
  }

}//Cls
