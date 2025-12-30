import { isPlatformBrowser } from '@angular/common';
import { computed, inject, Injectable, PLATFORM_ID } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { MiniStateBuilder, MiniStateCombined } from '@spider-baby/mini-state';
import { MYID_HAS_AMAZON, MYID_HAS_FACEBOOK, MYID_HAS_GOOGLE } from '@spider-baby/myid-auth/config';
import { LoginService } from '@spider-baby/myid-auth/services';
import { MyIdRouteInfo } from '@spider-baby/myid-auth/utils';
import { AccountIoService, PreconditionRequiredError } from '@spider-baby/myid-io';
import { AmazonSignInDto, FacebookSignInDto, ForgotPwdDto, GoogleSignInDto, JwtPackage, LoginDto, MicrosoftSignInDto } from '@spider-baby/myid-io/models';
import { filter, map } from 'rxjs';
import { TwoFactorRequiredData } from './two-factor-required.data';

//######################//

export type LoginJwtRouteDataOptions = {
  showSocialLinks?: boolean
}

export class LoginJwtRouteData {

  private constructor(
    public showSocialLinks: boolean
  ) { }

  static create = (options?: LoginJwtRouteDataOptions) =>
    new LoginJwtRouteData(options?.showSocialLinks ?? false);
}

//######################//

@Injectable()
export class LoginJwtStateService {

  private _ioService = inject(AccountIoService)
  private _loginService = inject(LoginService)
  private _actRoute = inject(ActivatedRoute);
  private _platformId = inject(PLATFORM_ID);
  private _isBrowser = isPlatformBrowser(this._platformId);


  //- - - - - - - - - - - - - //

  private _showSocialLinks$ = this._actRoute.data.pipe(
    map((data) => data as LoginJwtRouteData),
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

  //- - - - - - - - - - - - - //


  private _loginState = MiniStateBuilder
    .CreateWithInput((dto: LoginDto) => this._loginService.loginJwt(dto))
    .setSuccessMsgFn((dto) => `User,  ${dto.email ?? dto.username ?? dto.userId}, is logged in successfully!`)
    .setOnSuccessFn((dto, jwtPackage) => { console.log('Login successful:', jwtPackage); })


  private _googleLoginState = MiniStateBuilder
    .CreateWithInput((dto: GoogleSignInDto) => this._loginService.loginGoogleJwt(dto))
    .setSuccessMsgFn((dto) => `Logged in successfully!`)
    .setOnSuccessFn((dto, jwtPackage) => { console.log('Login successful:', dto, jwtPackage); })

  private _facebookLoginState = MiniStateBuilder
    .CreateWithInput((dto: FacebookSignInDto) => this._loginService.loginFacebookJwt(dto))
    .setSuccessMsgFn((dto) => `Logged in successfully!`)
    .setOnSuccessFn((dto, jwtPackage) => { console.log('Login successful:', dto, jwtPackage); })


  private _amazonLoginState = MiniStateBuilder
    .CreateWithInput((dto: AmazonSignInDto) => this._loginService.loginAmazonJwt(dto))
    .setSuccessMsgFn((dto) => `Logged in successfully!`)
    .setOnSuccessFn((dto, jwtPackage) => { console.log('Login successful:', dto, jwtPackage); })


  private _forgotPwdState = MiniStateBuilder
    .CreateWithInput((dto: ForgotPwdDto) => this._ioService.forgotPassword(dto))
    .setSuccessMsgFn((dto, response) => `${response.message}`)

  //- - - - - - - - - - - - - //

  private _states = MiniStateCombined.Combine(
    this._loginState,
    this._forgotPwdState,
    this._amazonLoginState,
    this._facebookLoginState,
    this._googleLoginState)


  successMsg = this._states.successMsg
  errorMsg = this._states.errorMsg
  loading = this._states.loading

  loginSuccess = computed(() => !!this._loginState.successMsg()
    || !!this._amazonLoginState.successMsg()
    || !!this._googleLoginState.successMsg()
    || !!this._facebookLoginState.successMsg())

  //Two-Factor Authentication related state
  private _loginStateError = MiniStateCombined.CombineErrors(
    this._loginState,
    this._amazonLoginState,
    this._googleLoginState,
    this._facebookLoginState)

  twoFactorRequired = computed(() => {
    const error = this._loginStateError();
    // Check for PreconditionRequiredError and the flag
    return !!(error && error instanceof PreconditionRequiredError && error.twoFactorRequired)
  })

  twoFactorData = computed(() => {
    const error = this._loginStateError();
    if (!error || !(error instanceof PreconditionRequiredError))
      return undefined;
    const payload = error.payload as (JwtPackage | undefined);
    return new TwoFactorRequiredData(
      payload?.twoFactorToken,
      payload?.twoFactorProvider
    )
  })


  //- - - - - - - - - - - - - //


  login = (dto: LoginDto) =>
    this._loginState.trigger(dto)


  loginGoogle = (dto: GoogleSignInDto) =>
    this._googleLoginState.trigger(dto);

  loginFacebook = (dto: FacebookSignInDto) =>
    this._facebookLoginState.trigger(dto)


  loginMicrosoft = (dto: MicrosoftSignInDto) =>
    console.log('loginMicrosoft: Method not implemented.', dto)


  loginAmazon = (dto: AmazonSignInDto) =>
    this._amazonLoginState.trigger(dto)


  forgotPassword = (dto: ForgotPwdDto) =>
    this._forgotPwdState.trigger(dto)


}//Cls