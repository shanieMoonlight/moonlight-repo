import { GoogleSigninButtonModule, SocialUser } from '@abacritt/angularx-social-login';
import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { MiniStateBuilder } from '@spider-baby/mini-state';
import { MiniStateCombined } from '@spider-baby/mini-state/utils';
import { SbMatNotificationsModalComponent } from '@spider-baby/ui-mat-notifications';
import { MatEverythingModule } from '@spider-baby/utils-mat-everything';
import { SbForgotPwdFormComponent } from '../../../../shared/id/ui/forms/forgot-pwd/forgot-pwd.component';
import { LoginFormComponent } from '../../../../shared/id/ui/forms/login/login.component';
import { LoginDto } from '../../../../shared/io/models';
import { AccountIoService } from '../../../../shared/io/services/account.io.service';
import { googleSocialUser } from './secret';
import { ConfirmEmailWithPwdFormDto, ConfirmEmailWithPwdFormComponent } from '../../../../shared/id/ui/forms/confirm-email-with-pwd/confirm-email-with-pwd.component';
import { SbUpdateTwoFactorProviderFormComponent, UpdateTwoFactorProviderFormDto } from '../../../../shared/id/ui/forms/update-two-factor-provider/update-two-factor-provider.component';
import { AppUserDtoFormDto, SbAppUserFormComponent } from '../../../../shared/id/ui/forms/app-user/app-user.component';
import { demoAppUserData, demoAppUserDataMinimal } from './fake-user-data';




@Component({
  selector: 'sb-oauth',
  imports: [
    GoogleSigninButtonModule,
    MatEverythingModule,
    SbMatNotificationsModalComponent,
    LoginFormComponent,
    SbForgotPwdFormComponent,
    ConfirmEmailWithPwdFormComponent,
    SbUpdateTwoFactorProviderFormComponent,
    SbAppUserFormComponent

  ],
  templateUrl: './oauth.component.html',
  styleUrl: './oauth.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OauthComponent implements OnInit {

  private _ioService = inject(AccountIoService)
  // private _socialAuth = inject(SocialAuthService)

  //- - - - - - - - - - - - - //

  protected _loginState = MiniStateBuilder
    .CreateWithInput((dto: LoginDto) => this._ioService.login(dto))
    .setSuccessMsgFn((dto) => `User,  ${dto.email ?? dto.username ?? dto.userId}, is logged in successfully!`)
    .setOnSuccessFn((dto, jwtPackage) => { console.log('Login successful:', jwtPackage); })

  protected _cookieLoginState = MiniStateBuilder
    .CreateWithInput((dto: LoginDto) => this._ioService.cookieSignIn(dto))
    .setSuccessMsgFn((dto) => `User,  ${dto.email ?? dto.username ?? dto.userId}, is logged in successfully!`)
    .setOnSuccessFn((dto, jwtPackage) => { console.log('Login successful:', jwtPackage); })


  protected _googleLoginState = MiniStateBuilder
    .CreateWithInput((dto: SocialUser) => this._ioService.googleCookieSignin(dto))
    .setSuccessMsgFn((dto) => `User,  ${dto.firstName}, is logged in successfully!`)
    .setOnSuccessFn((dto, jwtPackage) => { console.log('Login successful:', dto, jwtPackage); })

  //- - - - - - - - - - - - - //

  private _states = MiniStateCombined.Combine(
    this._loginState,
    this._cookieLoginState,
    this._googleLoginState)

  protected _successMsg = this._states.successMsg
  protected _errorMsg = this._states.errorMsg
  protected _loading = this._states.loading


  protected _testUser = demoAppUserData;
  protected _testUserMinimal = demoAppUserDataMinimal;



  //--------------------------//

  constructor() {
    // Initialization logic can go here if needed
    // console.log('OauthComponent initialized');
    // console.log(environment.oauth);
    // console.log(SocialAuthSetup.provideSocialLoginConfig());


  }

  //- - - - - - - - - - - - - //

  ngOnInit() {
    console.log('OauthComponent ngOnInit called');

    // this._socialAuth.authState.subscribe((socialUser) => {
    //   console.log('Google Auth State:', socialUser);
    //   console.log('Google Auth State Stringified:', JSON.stringify(socialUser).replace(/,/g, ',\n'));
    //   this._googleLoginState.trigger(socialUser)

    // });
  }

  //--------------------------//


  loginJwt = (dto: LoginDto) =>
    this._loginState.trigger(dto)

  loginCookie = (dto: LoginDto) =>
    this._cookieLoginState.trigger(dto)



  googleLoginTest() {
    console.log('Login OAuth');
    this._googleLoginState.trigger(googleSocialUser)
  }


  handlePasswordSet(dto: ConfirmEmailWithPwdFormDto) {
    console.log('Password set event:', dto)
  }


  handleProviderUpdate(dto: UpdateTwoFactorProviderFormDto) {
    console.log('Updating 2FA provider to:', dto);
  }


  handleAddUser(dto: AppUserDtoFormDto) {
    console.log('Adding User:', dto.teamPosition, dto);
  }


  handleEditUser(dto: AppUserDtoFormDto) {
    console.log('Updating User:', dto.teamPosition, dto);
  }


}//Cls
