import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MlDarkModeToggleMatComponent, MlThemePickerMatComponent } from '@spider-baby/material-theming/components';
import { ServiceWorkerUpdateMatComponent } from '@spider-baby/utils-seo/sw-updater-mat';
import { SbAuthLoginButtonComponent } from '../../shared/auth/ui/auth-login-button/auth-login-button.component';
import { HangfireButtonComponent } from '../../shared/auth/ui/hangfire-button/hangfire-button.component';
import { SwaggerButtonComponent } from '../../shared/auth/ui/swagger-button/swagger-button.component';
import { IconsService } from '../../shared/utils/icons/icons.service';
import { MainNavbarComponent } from './ui/navbar/navbar.component';
import { UserInfoCardComponent } from '../../shared/auth/ui/user-info/user-info.component';
import { UserInfoButtonComponent } from '../../shared/auth/ui/user-info/user-info-btn.component';


@Component({
  standalone: true,
  imports: [
    MainNavbarComponent,
    MlDarkModeToggleMatComponent,
    MlThemePickerMatComponent,
    RouterModule,
    ServiceWorkerUpdateMatComponent,
    SbAuthLoginButtonComponent,
    SwaggerButtonComponent,
    HangfireButtonComponent,
    UserInfoCardComponent,
    UserInfoButtonComponent

  ],
  providers: [
  ],
  selector: 'sb-main-root',
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MainComponent {

  protected _iconsService = inject(IconsService)


}//Cls
