import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MlDarkModeToggleMatComponent, MlThemePickerMatComponent } from '@spider-baby/material-theming/components';
import { ServiceWorkerUpdateMatComponent } from '@spider-baby/utils-seo/sw-updater-mat';
import { IconsService } from '../../shared/utils/icons/icons.service';
import { MainNavbarComponent } from './ui/navbar/navbar.component';
import { SbButtonIconLogoutComponent } from '../../shared/ui/buttons/button-logout/button-logout.component';
import { MyIdAuthService } from '../../shared/id/utils/services/auth/myid-auth.browser.service';
import { SbButtonIconLogoutToggleComponent } from '../../shared/ui/buttons/button-logout-toggle/button-logout-toggle.component';
import { SbAuthLoginButtonComponent } from '../../shared/auth/ui/auth-login-button/auth-login-button.component';


@Component({
  standalone: true,
  imports: [
    MainNavbarComponent,
    MlDarkModeToggleMatComponent,
    MlThemePickerMatComponent,
    RouterModule,
    ServiceWorkerUpdateMatComponent,
    SbButtonIconLogoutComponent,
    SbButtonIconLogoutToggleComponent,
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
