import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MlDarkModeToggleMatComponent, MlThemePickerMatComponent } from '@spider-baby/material-theming/components';
import { ServiceWorkerUpdateMatComponent } from '@spider-baby/utils-seo/sw-updater-mat';
import { SbAuthLoginButtonComponent } from '../../shared/auth/ui/auth-login-button/auth-login-button.component';
import { MyIdAuthService } from '../../shared/auth/services/auth/myid-auth.browser.service';
import { IconsService } from '../../shared/utils/icons/icons.service';
import { MainNavbarComponent } from './ui/navbar/navbar.component';


@Component({
  standalone: true,
  imports: [
    MainNavbarComponent,
    MlDarkModeToggleMatComponent,
    MlThemePickerMatComponent,
    RouterModule,
    ServiceWorkerUpdateMatComponent,
    SbAuthLoginButtonComponent
    
  ],
  providers: [
  ],
  selector: 'sb-main-root',
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MainComponent {
  
  _iconsService = inject(IconsService)
  _authService = inject(MyIdAuthService)

  logout = ()=> this._authService.logOut()

}//Cls
