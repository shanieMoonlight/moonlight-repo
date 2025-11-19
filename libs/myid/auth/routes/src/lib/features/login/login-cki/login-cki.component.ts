import { AmazonLoginProvider, FacebookLoginProvider, GoogleLoginProvider, GoogleSigninButtonModule, MicrosoftLoginProvider, SocialAuthService } from '@abacritt/angularx-social-login';
import { ChangeDetectionStrategy, Component, DestroyRef, effect, inject, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { devConsole } from '@spider-baby/dev-console';
import { MyIdRouter } from '@spider-baby/myid-auth/config';
import { LoginDto } from '@spider-baby/myid-io/models';
import { ForgotPasswordFormDto, ForgotPwdModalComponent } from '@spider-baby/myid-ui/forgot-pwd';
import { LoginFormComponent } from '@spider-baby/myid-ui/login';
import { SbTooltipDirective } from '@spider-baby/ui-kit/tooltip';
import { SbMatNotificationsModalComponent } from '@spider-baby/ui-mat-notifications';
import { SbButtonFacebookLoginComponent } from '../buttons/facebook/btn-facebook-login.component';
import { LoginCkiStateService } from './login-cki.state.service';
import { isPlatformBrowser } from '@angular/common';
import { SbButtonAmazonLoginComponent } from '../buttons/amazon/btn-amazon-login.component';

@Component({
  selector: 'sb-login-cki',
  standalone: true,
  imports: [
    GoogleSigninButtonModule,
    SbMatNotificationsModalComponent,
    LoginFormComponent,
    ForgotPwdModalComponent,
    SbButtonFacebookLoginComponent,
    SbButtonAmazonLoginComponent,
    SbTooltipDirective
],
  providers: [LoginCkiStateService],
  templateUrl: './login-cki.component.html',
  styleUrl: './login-cki.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginCkiComponent implements OnInit {

  private _state = inject(LoginCkiStateService)
  private _socialAuth = inject(SocialAuthService)
  private _router = inject(MyIdRouter)
  private _destroyRef = inject(DestroyRef)
  private _platformId = inject(PLATFORM_ID)

  //- - - - - - - - - - - - - //

  protected _isBrowser = isPlatformBrowser(this._platformId);


  protected _successMsg = this._state.successMsg
  protected _errorMsg = this._state.errorMsg
  protected _loading = this._state.loading
  protected _showSocialLinks = this._state.showSocialLinks

  // per-provider show signals (computed in the state service)
  protected _showGoogle = this._state.showGoogleLogin
  protected _showFacebook = this._state.showFacebookLogin
  protected _showAmazon = this._state.showAmazonLogin

  protected _showForgotPwd = signal(false)


  //--------------------------//

  constructor() {

    // Ensure user is signed out from any previous social login sessions (browser only)
    if (this._isBrowser)
      this._socialAuth.signOut()

    effect(() => {
      if (this._state.loginSuccess()) {
        const redirectUrl = this._state.redirectUrl();
        if (redirectUrl)
          this._router.navigate([redirectUrl])
        else
          this._router.navigateToHome()
      }
    })

    effect(() => {
      const data = this._state.twoFactorData();
      if (data)
        this._router.navigateToVerify(undefined, data.provider);
    });
  }



  ngOnInit() {

    if (!this._isBrowser)
      return

    this._socialAuth.authState
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe((socialUser) => {
        devConsole.log('socialUser', socialUser);

        if (socialUser) {
          const provider = socialUser.provider;
          devConsole.log(`Social login successful from provider: ${provider}`, socialUser);

          switch (provider) {
            case GoogleLoginProvider.PROVIDER_ID:
              devConsole.log('Google social login response', socialUser);
              this._state.loginGoogleCookie(socialUser);
              break;
            case FacebookLoginProvider.PROVIDER_ID:
              devConsole.log('Facebook social login response', socialUser);
              this._state.loginFacebookCookie(socialUser);
              break;
            case AmazonLoginProvider.PROVIDER_ID:
              devConsole.log('Amazon social login response', socialUser);
              this._state.loginAmazonCookie(socialUser);
              break;
            case MicrosoftLoginProvider.PROVIDER_ID:
              devConsole.log('Microsoft social login response', socialUser);
              this._state.loginMicrosoftCookie(socialUser);
              break;
            default:
              devConsole.warn('Unsupported social login provider:', provider);
              return;
          }

        }
      })
  }


  //- - - - - - - - - - - - - //

  login = (dto: LoginDto) =>
    this._state.loginCookie(dto)

  onForgotPwdClick = () =>
    this._showForgotPwd.set(true)


  onForgotPasswordResult = (dto: ForgotPasswordFormDto) =>
    this._state.forgotPassword(dto)


}//Cls

