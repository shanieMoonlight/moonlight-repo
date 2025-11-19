import { AmazonLoginProvider, FacebookLoginProvider, GoogleLoginProvider, MicrosoftLoginProvider, SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';
import { isPlatformBrowser } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, effect, inject, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { devConsole } from '@spider-baby/dev-console';
import { MyIdRouter } from '@spider-baby/myid-auth/config';
import { LoginDto } from '@spider-baby/myid-io/models';
import { ForgotPasswordFormDto, ForgotPwdModalComponent } from '@spider-baby/myid-ui/forgot-pwd';
import { LoginFormComponent } from '@spider-baby/myid-ui/login';
import { SbMatNotificationsModalComponent } from '@spider-baby/ui-mat-notifications';
import { SbButtonAmazonLoginComponent } from '../buttons/amazon/btn-amazon-login.component';
import { SbButtonFacebookLoginComponent } from '../buttons/facebook/btn-facebook-login.component';
import { SbButtonGoogleLoginComponent } from '../buttons/google/btn-google-login.component';
import { LoginJwtStateService } from './login-jwt.state.service';

@Component({
  selector: 'sb-login-jwt',
  imports: [
    LoginFormComponent,
    SbMatNotificationsModalComponent,
    ForgotPwdModalComponent,
    SbButtonFacebookLoginComponent,
    SbButtonAmazonLoginComponent,
    SbButtonGoogleLoginComponent
    // SbButtonMicrosoftLoginComponent
  ],
  providers: [LoginJwtStateService],
  standalone: true,
  templateUrl: './login-jwt.component.html',
  styleUrl: './login-jwt.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginJwtComponent implements OnInit {


  private _state = inject(LoginJwtStateService)
  private _socialAuth = inject(SocialAuthService)
  private _router = inject(MyIdRouter)
  private _destroyRef = inject(DestroyRef)
  private _platformId = inject(PLATFORM_ID)


  //- - - - - - - - - - - - - //


  protected _isBrowser = isPlatformBrowser(this._platformId);

  protected _successMsg = this._state.successMsg
  protected _errorMsg = this._state.errorMsg
  protected _loading = this._state.loading
  protected _showGoogle = this._state.showGoogleLogin
  protected _showFacebook = this._state.showFacebookLogin
  protected _showAmazon = this._state.showAmazonLogin

  protected _showForgotPwd = signal(false)



  //--------------------------//

  constructor() {

    // Ensure user is signed out from any previous social login sessions
    if (this._isBrowser)
      this._socialAuth.signOut()

    effect(() => {
      if (this._state.loginSuccess()) {
        devConsole.log('LoginJwtComponent: loginSuccess effect triggered', this._state.redirectUrl());
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
        this._router.navigateToVerify(data.token, data.provider);
    });
  }

  //- - - - - - - - - - - - - //

  ngOnInit() {


    if (!this._isBrowser)
      return
    
    this._socialAuth.authState
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe((socialUser) => {
        devConsole.log('socialUser', socialUser);

        if (socialUser) {
          const provider = socialUser.provider;
          devConsole.log(`Social login successful from provider: ${provider}`, socialUser, GoogleLoginProvider.PROVIDER_ID);
          console.log(JSON.stringify(socialUser));


          switch (provider) {
            case GoogleLoginProvider.PROVIDER_ID:
              devConsole.log('Google social login response', socialUser);
              this._state.loginGoogle(socialUser);
              break;
            case FacebookLoginProvider.PROVIDER_ID:
              devConsole.log('Facebook social login response', socialUser);
              this._state.loginFacebook(socialUser);
              break;
            case AmazonLoginProvider.PROVIDER_ID:
              devConsole.log('Amazon social login response', socialUser);
              this._state.loginAmazon(socialUser);
              break;
            case MicrosoftLoginProvider.PROVIDER_ID:
              devConsole.log('Microsoft social login response', socialUser);
              this._state.loginMicrosoft(socialUser);
              break;
            default:
              devConsole.warn('Unsupported social login provider:', provider);
              return;
          }

        }
      })
  }

  //- - - - - - - - - - - - - //


  login = (dto: LoginDto) => {
    console.log('LoginJwtComponent.login', dto);
    return this._state.login(dto);
  }

  onForgotPwd = () =>
    this._showForgotPwd.set(true)


  onForgotPasswordResult = (dto: ForgotPasswordFormDto) =>
    this._state.forgotPassword(dto)

  facebookLogin(user: SocialUser) {
    console.log('LoginJwtComponent.login', user);
  }


  googleLogin(user: SocialUser) {
    console.log('LoginJwtComponent.login -google', user);
  }


}//Cls
