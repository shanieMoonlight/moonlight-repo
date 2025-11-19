import { computed, inject, Injectable, PLATFORM_ID } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { MiniStateBuilder } from '@spider-baby/mini-state';
import { MiniStateCombined } from '@spider-baby/mini-state/utils';
import { AccountIoService, PreconditionRequiredError } from '@spider-baby/myid-io';
import { AmazonSignInDto, CookieSignInDto, CookieSignInResultData, FacebookSignInDto, ForgotPwdDto, GoogleSignInDto, LoginDto, MicrosoftSignInDto } from '@spider-baby/myid-io/models';
import { filter, map } from 'rxjs';
import { LoginService } from '@spider-baby/myid-auth/services';
import { MyIdRouteInfo } from '@spider-baby/myid-auth/utils';
import { TwoFactorRequiredData } from './two-factor-required.data';
import { isPlatformBrowser } from '@angular/common';
import { MYID_HAS_GOOGLE, MYID_HAS_FACEBOOK, MYID_HAS_AMAZON } from '@spider-baby/myid-auth/config';

//######################//

export type LoginCookieRouteDataOptions = {
  showSocialLinks?: boolean
}


export class LoginCookieRouteData {

  private constructor(
    public showSocialLinks = false
  ) { }

  static create = (options? : LoginCookieRouteDataOptions) =>
    new LoginCookieRouteData(options?.showSocialLinks ?? false);
}

//######################//


@Injectable()
export class LoginCkiStateService {

  private _ioService = inject(AccountIoService)
  private _loginService = inject(LoginService)
  private _actRoute = inject(ActivatedRoute)
  private _platformId = inject(PLATFORM_ID)
  private _isBrowser = isPlatformBrowser(this._platformId);

  //- - - - - - - - - - - - - //

  private _showSocialLinks$ = this._actRoute.data.pipe(
    map((data) => data as LoginCookieRouteData),
    map((data) => data.showSocialLinks ?? false),
  )
  showSocialLinks = toSignal(this._showSocialLinks$, { initialValue: false });

  private _redirectUrl$ = this._actRoute.queryParamMap.pipe(
    map((paramMap) => paramMap.get(MyIdRouteInfo.Params.REDIRECT_URL_KEY)),
    filter((x) => !!x)
  )
  redirectUrl = toSignal(this._redirectUrl$, { initialValue: null });

  canShowSocial = computed(() => this.showSocialLinks() && this._isBrowser);

  private _hasGoogleToken = inject(MYID_HAS_GOOGLE, { optional: true }) ?? false;
  showGoogleLogin = computed(() => !!this._hasGoogleToken && this.canShowSocial());

  private _hasFacebookToken = inject(MYID_HAS_FACEBOOK, { optional: true }) ?? false;
  showFacebookLogin = computed(() => !!this._hasFacebookToken && this.canShowSocial());

  private _hasAmazonToken = inject(MYID_HAS_AMAZON, { optional: true }) ?? false;
  showAmazonLogin = computed(() => !!this._hasAmazonToken && this.canShowSocial());



  protected _cookieLoginState = MiniStateBuilder
    .CreateWithInput((dto: CookieSignInDto) => this._loginService.loginCookie(dto))
    .setSuccessMsgFn((dto) => `User,  ${dto.email ?? dto.username ?? dto.userId}, is logged in successfully!`)
    .setOnSuccessFn((dto, signinData) => { console.log('Login successful:', signinData); })


  protected _googleLoginState = MiniStateBuilder
    .CreateWithInput((dto: GoogleSignInDto) => this._loginService.loginGoogleCookie(dto))
    .setSuccessMsgFn((dto) => `Logged in successfully!`)
    .setOnSuccessFn((dto, signinData) => { console.log('Login successful:', dto, signinData); })

  private _facebookLoginState = MiniStateBuilder
    .CreateWithInput((dto: FacebookSignInDto) => this._loginService.loginFacebookCookie(dto))
    .setSuccessMsgFn((dto) => `Logged in successfully!`)
    .setOnSuccessFn((dto, jwtPackage) => { console.log('Login successful:', dto, jwtPackage); })

  private _amazonLoginState = MiniStateBuilder
    .CreateWithInput((dto: AmazonSignInDto) => this._loginService.loginAmazonCookie(dto))
    .setSuccessMsgFn((dto) => `Logged in successfully!`)
    .setOnSuccessFn((dto, jwtPackage) => { console.log('Login successful:', dto, jwtPackage); })

  protected _forgotPwdState = MiniStateBuilder
    .CreateWithInput((dto: ForgotPwdDto) => this._ioService.forgotPassword(dto))
    .setSuccessMsgFn((dto, response) => `${response.message}`)

  //- - - - - - - - - - - - - //

  private _states = MiniStateCombined.Combine(
    this._cookieLoginState,
    this._forgotPwdState,
    this._amazonLoginState,
    this._facebookLoginState,
    this._googleLoginState)

  successMsg = this._states.successMsg
  errorMsg = this._states.errorMsg
  loading = this._states.loading

  loginSuccess = computed(() => !!this._cookieLoginState.successMsg() 
    || !!this._googleLoginState.successMsg()
    || !!this._facebookLoginState.successMsg())


  //Two-Factor Authentication related state
  private _loginStateError = MiniStateCombined.CombineErrors(
    this._amazonLoginState,
    this._cookieLoginState,
    this._googleLoginState,
    this._facebookLoginState)


  twoFactorData = computed(() => {
    const error = this._loginStateError();
    console.log('Checking for two-factor token...', error);

    if (!error || !(error instanceof PreconditionRequiredError))
      return undefined;

    const payload = error.payload as (CookieSignInResultData | undefined);
    const twoFactorRequired = error.twoFactorRequired || payload?.twoFactorRequired;
    return twoFactorRequired
      ? new TwoFactorRequiredData(payload?.twoFactorProvider)
      : undefined;
  })

  //- - - - - - - - - - - - - //


  loginCookie = (dto: LoginDto) =>
    this._cookieLoginState.trigger(dto)


  loginGoogleCookie = (dto: GoogleSignInDto) =>
    this._googleLoginState.trigger(dto)

  loginFacebookCookie = (dto: FacebookSignInDto) =>
    this._facebookLoginState.trigger(dto)

  loginMicrosoftCookie = (dto: MicrosoftSignInDto) => 
    console.log('loginMicrosoft: Method not implemented.', dto)

  
  loginAmazonCookie = (dto: AmazonSignInDto) => 
    this._amazonLoginState.trigger(dto)

  forgotPassword = (dto: ForgotPwdDto) =>
    this._forgotPwdState.trigger(dto)



}//Cls