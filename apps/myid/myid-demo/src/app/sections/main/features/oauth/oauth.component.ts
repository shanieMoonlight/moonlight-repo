import { GoogleSigninButtonModule, SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';
import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { MiniStateBuilder } from '@spider-baby/mini-state';
import { MiniStateCombined } from '@spider-baby/mini-state/utils';
import { SbMatNotificationsModalComponent } from '@spider-baby/ui-mat-notifications';
import { MatEverythingModule } from '@spider-baby/utils-mat-everything';
import { AccountIoService } from '../../../../shared/io/services/account.io.service';
import { googleSocialUser, validUserAuthCredentials } from './secret';
import { LoginDto } from '../../../../shared/io/models';
import { LoginFormComponent } from '../../../../shared/id/ui/login/login.component';




@Component({
  selector: 'sb-oauth',
  imports: [
    GoogleSigninButtonModule,
    MatEverythingModule,
    SbMatNotificationsModalComponent,
    LoginFormComponent
    
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


  loginJwt =(dto: LoginDto) =>  
    this._loginState.trigger(dto)

  loginCookie = (dto: LoginDto) =>
    this._cookieLoginState.trigger(dto)



  googleLoginTest() {
    console.log('Login OAuth');
    this._googleLoginState.trigger(googleSocialUser)

  }

}//Cls
