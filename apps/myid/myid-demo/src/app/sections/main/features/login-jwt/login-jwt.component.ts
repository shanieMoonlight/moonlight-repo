import { GoogleSigninButtonModule, SocialAuthService } from '@abacritt/angularx-social-login';
import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { SbMatNotificationsModalComponent } from '@spider-baby/ui-mat-notifications';
import { ForgotPasswordFormDto } from '../../../../shared/id/ui/forms/forgot-pwd/forgot-pwd.component';
import { LoginFormComponent } from '../../../../shared/id/ui/forms/login/login.component';
import { LoginDto } from '../../../../shared/io/models';
import { ForgotPwdModalComponent } from '../../ui/forgot-pwd-modal/forgot-pwd-modal.component';
import { LoginJwtStateService } from './login-jwt.state.service';

@Component({
  selector: 'sb-login-jwt',
  imports: [
    GoogleSigninButtonModule,
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

  //- - - - - - - - - - - - - //

  protected _successMsg = this._state.successMsg
  protected _errorMsg = this._state.errorMsg
  protected _loading = this._state.loading

  protected _showForgotPwd = signal(false)


  //--------------------------//


  ngOnInit() {
    this._socialAuth.authState.subscribe((socialUser) => {
      this._state.loginGoogle(socialUser)
    })
  }

  //- - - - - - - - - - - - - //


  login = (dto: LoginDto) =>
    this._state.login(dto)


  onForgotPwd = () =>
    this._showForgotPwd.set(true)


  onForgotPasswordResult = (dto: ForgotPasswordFormDto) =>
    this._state.forgotPassword(dto)


}//Cls
