import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MlDarkModeToggleMatComponent, MlThemePickerMatComponent } from '@spider-baby/material-theming/components';
import { MatEverythingModule } from '@spider-baby/material-theming/utils';
import { environment } from "../../../environments/environment";
import { MainNavbarComponent } from './ui/navbar/navbar.component';
import { IconsService } from './utils/icons/icons.service';
import { FirebaseUtilsService } from '@spider-baby/utils-firebase';
import { devConsole } from '@spider-baby/dev-console';

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
  myFirebase = inject(FirebaseUtilsService)

  constructor() {
    this.myFirebase.logConnectionTest()
    devConsole.log('test:firebaseAppName:',  this.myFirebase.appName);
    devConsole.log('test:environment:', environment);
    devConsole.log('test:firebaseConfig:', environment.firebaseConfig)    
  }

}//Cls
