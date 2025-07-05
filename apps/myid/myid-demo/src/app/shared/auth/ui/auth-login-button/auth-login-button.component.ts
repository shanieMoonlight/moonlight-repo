import { isPlatformBrowser, NgClass, NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input, PLATFORM_ID, TemplateRef } from '@angular/core';
import { SbTooltipDirective } from '@spider-baby/ui-kit/tooltip';
import { MyIdRouter } from '@spider-baby/myid-auth/config';
import { MyIdAuthService } from '@spider-baby/myid-auth/services';
import { UiKitTheme } from '@spider-baby/ui-kit/types';

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
  private _router = inject(MyIdRouter)
  private _authService = inject(MyIdAuthService)

  //------------------//

  logoutButtonTemplate = input<TemplateRef<unknown> | undefined>();
  loginButtonTemplate = input<TemplateRef<unknown> | undefined>();


  
  disabled = input<boolean>(false);
  
  color = input<UiKitTheme>('primary')
  
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
