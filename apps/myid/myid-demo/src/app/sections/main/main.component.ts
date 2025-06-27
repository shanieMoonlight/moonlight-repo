import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { MlDarkModeToggleMatComponent, MlThemePickerMatComponent } from '@spider-baby/material-theming/components';
import { ServiceWorkerUpdateMatComponent } from '@spider-baby/utils-seo/sw-updater-mat';
import { AppSvgs } from '../../config/svgs';
import { MyIdAuthService } from '../../shared/auth/services/auth/myid-auth.browser.service';
import { SbAuthLoginButtonComponent } from '../../shared/auth/ui/auth-login-button/auth-login-button.component';
import { HangfireButtonComponent } from '../../shared/auth/ui/hangfire-button/hangfire-button.component';
import { SwaggerButtonComponent } from '../../shared/auth/ui/swagger-button/swagger-button.component';
import { IconsService } from '../../shared/utils/icons/icons.service';
import { MainNavbarComponent } from './ui/navbar/navbar.component';
import { GithubCornerComponent } from '../../shared/ui/corner-link/git-corner.component';
import { AppConstants } from '../../config/constants';


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
    HangfireButtonComponent

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
  _authService = inject(MyIdAuthService)

  protected logout = () => this._authService.logOut()

  protected _gitRepo = AppConstants.GIT_REP_URL

  // // Create a sanitized version for safe HTML rendering
  // protected get sanitizedSwaggerSvg(): SafeHtml {
  //   return this._sanitizer.bypassSecurityTrustHtml(this._swgIconSvg);
  // }


}//Cls
