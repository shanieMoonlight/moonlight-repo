import { GoogleSigninButtonModule, SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';
import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { MiniStateBuilder } from '@spider-baby/mini-state';
import { MiniStateCombined } from '@spider-baby/mini-state/utils';
import { SbMatNotificationsModalComponent } from '@spider-baby/ui-mat-notifications';
import { LoginFormComponent } from '../../../../shared/id/ui/forms/login/login.component';
import { ForgotPwdDto, LoginDto } from '../../../../shared/io/models';
import { AccountIoService } from '../../../../shared/io/services';
import { ForgotPwdModalComponent } from '../../ui/forgot-pwd-modal/forgot-pwd-modal.component';
import { ForgotPasswordFormDto } from '../../../../shared/id/ui/forms/forgot-pwd/forgot-pwd.component';

@Component({
  selector: 'sb-login-jwt',
  imports: [
    GoogleSigninButtonModule,
    LoginFormComponent,
    SbMatNotificationsModalComponent,
    ForgotPwdModalComponent
  ],
  standalone: true,
  templateUrl: './login-jwt.component.html',
  styleUrl: './login-jwt.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginJwtComponent implements OnInit {

  private _ioService = inject(AccountIoService)
  private _socialAuth = inject(SocialAuthService)

  //- - - - - - - - - - - - - //

  protected _loginState = MiniStateBuilder
    .CreateWithInput((dto: LoginDto) => this._ioService.login(dto))
    .setSuccessMsgFn((dto) => `User,  ${dto.email ?? dto.username ?? dto.userId}, is logged in successfully!`)
    .setOnSuccessFn((dto, jwtPackage) => { console.log('Login successful:', jwtPackage); })


  protected _googleLoginState = MiniStateBuilder
    .CreateWithInput((dto: SocialUser) => this._ioService.googleLogin(dto))
    .setSuccessMsgFn((dto) => `User,  ${dto.firstName}, is logged in successfully!`)
    .setOnSuccessFn((dto, jwtPackage) => { console.log('Login successful:', dto, jwtPackage); })

    
  protected _forgotPwdState = MiniStateBuilder
    .CreateWithInput((dto: ForgotPwdDto) => this._ioService.forgotPassword(dto))
    .setSuccessMsgFn((dto, response) => `${response.message}`)

  //- - - - - - - - - - - - - //

  private _states = MiniStateCombined.Combine(
    this._loginState,
    this._googleLoginState)

  protected _successMsg = this._states.successMsg
  protected _errorMsg = this._states.errorMsg
  protected _loading = this._states.loading

  protected _showForgotPwd = signal(false)


  //--------------------------//


  ngOnInit() {
    this._socialAuth.authState.subscribe((socialUser) => {
      this._googleLoginState.trigger(socialUser)
    })
  }


  //- - - - - - - - - - - - - //


  login = (dto: LoginDto) =>
    this._loginState.trigger(dto)


  onForgotPwd = () =>
    this._showForgotPwd.set(true)


  onForgotPasswordResult = (dto: ForgotPasswordFormDto) =>
    this._forgotPwdState.trigger(dto)


}//Cls
