import { isPlatformBrowser, NgClass, NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input, PLATFORM_ID, TemplateRef } from '@angular/core';
import { MyIdAuthService } from '../../services/auth/myid-auth.browser.service';
import { AMyIdRouter } from '../../../id/utils/services/id-navigation/id-router.service';
import { IdTheme } from '../../../ui/theme.type';
import { SbTooltipDirective } from '../../../ui/tooltip/tooltip.directive';

@Component({
  selector: 'sb-auth-login-button',
  standalone: true,
  imports: [
    NgClass,
    NgTemplateOutlet,
    SbTooltipDirective
  ],
  templateUrl: './auth-login-button.component.html',
  styleUrl: './auth-login-button.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SbAuthLoginButtonComponent {

  private _platformId = inject(PLATFORM_ID)
  private _router = inject(AMyIdRouter)
  private _authService = inject(MyIdAuthService)

  //------------------//

  logoutButtonTemplate = input<TemplateRef<unknown> | undefined>();
  loginButtonTemplate = input<TemplateRef<unknown> | undefined>();


  
  disabled = input<boolean>(false);
  
  color = input<IdTheme>('primary')
  
  protected _isBrowser = computed(() => isPlatformBrowser(this._platformId))
  protected _isLoggedIn = this._authService.isLoggedIn
  protected _ariaLabel = computed(() => this._isLoggedIn() ? 'Logout button' : 'Login button')

  //------------------//

  toggle() {
    if (this._isLoggedIn()) 
      this._authService.logOut()
    
    this._router.navigateToLogin()    
  }

}
