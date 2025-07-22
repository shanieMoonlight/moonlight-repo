import { ChangeDetectionStrategy, Component, computed, ElementRef, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MlDarkModeToggleMatComponent, MlThemePickerMatComponent } from '@spider-baby/material-theming/components';
import { ServiceWorkerUpdateMatComponent } from '@spider-baby/utils-seo/sw-updater-mat';
import { SbAuthLoginButtonComponent } from '../../shared/auth/ui/auth-login-button/auth-login-button.component';
import { HangfireButtonComponent } from '../../shared/auth/ui/hangfire-button/hangfire-button.component';
import { SwaggerButtonComponent } from '../../shared/auth/ui/swagger-button/swagger-button.component';
import { TeamBadgeComponent } from '../../shared/auth/ui/team-badge/team-badge.component';
import { UserInfoButtonComponent } from '../../shared/auth/ui/user-info/user-info-btn.component';
import { IconsService } from '../../shared/utils/icons/icons.service';
import { ScrollListenerService } from '../../shared/utils/scroll/scroll-listener.service';
import { MainNavbarComponent } from './ui/navbar/navbar.component';
import { LoginService } from '@spider-baby/myid-auth/services';


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
    UserInfoButtonComponent,
    TeamBadgeComponent

  ],
  providers: [],
  selector: 'sb-main-root',
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.scrolled]': '_scrolled()',
  },
})
export class MainComponent {

  protected _iconsService = inject(IconsService)
  //IMport to trigger rtokenrefresh autho login
  protected _login = inject(LoginService)
  protected _scrollListener = inject(ScrollListenerService)
  protected _el = inject(ElementRef)

  private _scrollPostion = this._scrollListener.getScrollPosition(this._el, 100);
  protected _scrolled = computed(() => this._scrollPostion() > 100);


}//Cls
