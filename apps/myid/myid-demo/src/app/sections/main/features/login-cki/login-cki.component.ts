import { GoogleSigninButtonModule, SocialAuthService } from '@abacritt/angularx-social-login';
import { ChangeDetectionStrategy, Component, effect, inject, OnInit, signal } from '@angular/core';
import { SbMatNotificationsModalComponent } from '@spider-baby/ui-mat-notifications';
import { ForgotPasswordFormDto } from '../../../../shared/id/ui/forms/forgot-pwd/forgot-pwd.component';
import { LoginFormComponent } from '../../../../shared/id/ui/forms/login/login.component';
import { LoginDto } from '../../../../shared/io/models';
import { ForgotPwdModalComponent } from '../../ui/forgot-pwd-modal';
import { LoginCkiStateService } from './login-cki.state.service';
import { AMyIdRouter } from '../../../../shared/id/utils/services/id-navigation/id-router.service';

@Component({
  selector: 'sb-login-cki',
  standalone: true,
  imports: [
    GoogleSigninButtonModule,
    SbMatNotificationsModalComponent,
    LoginFormComponent,
    ForgotPwdModalComponent
  ],
  providers: [LoginCkiStateService],
  templateUrl: './login-cki.component.html',
  styleUrl: './login-cki.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginCkiComponent implements OnInit {

  private _state = inject(LoginCkiStateService)
  private _socialAuth = inject(SocialAuthService)
  private _router = inject(AMyIdRouter)

  //- - - - - - - - - - - - - //

  protected _successMsg = this._state.successMsg
  protected _errorMsg = this._state.errorMsg
  protected _loading = this._state.loading

  protected _showForgotPwd = signal(false)


  //--------------------------//

  constructor() {

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
      const token = this._state.twoFactorToken();
      if (token)
        this._router.navigateToVerify(token)
    });
  }



  ngOnInit() {
    this._socialAuth.authState.subscribe((socialUser) => {
      this._state.loginGoogleCookie(socialUser)
    });
  }


  //- - - - - - - - - - - - - //


  onForgotPwdClick = () =>
    this._showForgotPwd.set(true)


  onForgotPasswordResult = (dto: ForgotPasswordFormDto) =>
    this._state.forgotPassword(dto)

  login = (dto: LoginDto) =>
    this._state.loginCookie(dto)



}//Cls

