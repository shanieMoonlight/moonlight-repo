import { GoogleSigninButtonDirective, SocialAuthService } from '@abacritt/angularx-social-login';
import { ChangeDetectionStrategy, Component, DestroyRef, effect, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { devConsole } from '@spider-baby/dev-console';
import { LoginDto } from '@spider-baby/myid-io/models';
import { ForgotPasswordFormDto } from '@spider-baby/myid-ui/forgot-pwd';
import { LoginFormComponent } from '@spider-baby/myid-ui/login';
import { SbMatNotificationsModalComponent } from '@spider-baby/ui-mat-notifications';
import { LoginJwtStateService } from './login-jwt.state.service';
import { MyIdRouter } from '../../../../shared/id/utils/services/id-navigation/id-router.service';
import { ForgotPwdModalComponent } from '@spider-baby/myid-ui/forgot-pwd';

@Component({
  selector: 'sb-login-jwt',
  imports: [
    GoogleSigninButtonDirective,
    LoginFormComponent,
    SbMatNotificationsModalComponent,
    ForgotPwdModalComponent
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

  //- - - - - - - - - - - - - //

  protected _successMsg = this._state.successMsg
  protected _errorMsg = this._state.errorMsg
  protected _loading = this._state.loading
  protected _showSocialLinks = this._state.showSocialLinks

  protected _showForgotPwd = signal(false)


  //--------------------------//

  constructor() {

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

  ngOnInit() {
    this._socialAuth.authState
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe((socialUser) => {
        if (socialUser) {
          this._state.loginGoogle(socialUser);
          // Sign out from the social provider after using the token. We're storing a JWT token in the backend, 
          // so we don't need to keep the user signed in on the social provider.
          this._socialAuth.signOut();
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


}//Cls
