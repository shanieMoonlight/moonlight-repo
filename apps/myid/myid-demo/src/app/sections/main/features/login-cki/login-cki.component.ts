import { GoogleSigninButtonModule, SocialAuthService } from '@abacritt/angularx-social-login';
import { ChangeDetectionStrategy, Component, DestroyRef, effect, inject, OnInit, signal } from '@angular/core';
import { LoginDto } from '@spider-baby/myid-io/models';
import { ForgotPasswordFormDto } from '@spider-baby/myid-ui-forms/forgot-pwd';
import { LoginFormComponent } from '@spider-baby/myid-ui-forms/login';
import { SbMatNotificationsModalComponent } from '@spider-baby/ui-mat-notifications';
import { MyIdRouter } from '../../../../shared/id/utils/services/id-navigation/id-router.service';
import { ForgotPwdModalComponent } from '../../ui/forgot-pwd-modal';
import { LoginCkiStateService } from './login-cki.state.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

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
  private _router = inject(MyIdRouter)
  private _destroyRef = inject(DestroyRef)

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
      const data = this._state.twoFactorData();
      if (data)
        this._router.navigateToVerify(undefined, data.provider);
    });
  }



  ngOnInit() {
    this._socialAuth.authState
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe((socialUser) => {
        if (socialUser) {
          this._state.loginGoogleCookie(socialUser);
          // Sign out from the social provider after using the token. We're storing a JWT token in the backend, 
          // so we don't need to keep the user signed in on the social provider.
          this._socialAuth.signOut();
        }
      })
  }


  //- - - - - - - - - - - - - //


  onForgotPwdClick = () =>
    this._showForgotPwd.set(true)


  onForgotPasswordResult = (dto: ForgotPasswordFormDto) =>
    this._state.forgotPassword(dto)

  login = (dto: LoginDto) =>
    this._state.loginCookie(dto)



}//Cls

