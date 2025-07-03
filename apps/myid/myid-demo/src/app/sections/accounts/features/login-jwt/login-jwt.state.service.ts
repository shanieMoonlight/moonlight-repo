import { computed, inject, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { MiniStateBuilder } from '@spider-baby/mini-state';
import { MiniStateCombined } from '@spider-baby/mini-state/utils';
import { AccountIoService, PreconditionRequiredError } from '@spider-baby/myid-io';
import { ForgotPwdDto, GoogleSignInDto, JwtPackage, LoginDto } from '@spider-baby/myid-io/models';
import { filter, map } from 'rxjs';
import { LoginService } from '../../../../shared/id/auth/services/login/login.service';
import { MyIdRouteInfo } from '../../../../shared/id/utils/my-id-route-info';

//######################//

export class TwoFactorRequiredData {
  constructor(
    public token?: string,
    public provider?: string
  ) { }
}

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


  private _loginState = MiniStateBuilder
    .CreateWithInput((dto: LoginDto) => this._loginService.loginJwt(dto))
    .setSuccessMsgFn((dto) => `User,  ${dto.email ?? dto.username ?? dto.userId}, is logged in successfully!`)
    .setOnSuccessFn((dto, jwtPackage) => { console.log('Login successful:', jwtPackage); })


  private _googleLoginState = MiniStateBuilder
    .CreateWithInput((dto: GoogleSignInDto) => this._loginService.loginGoogleJwt(dto))
    .setSuccessMsgFn((dto) => `Logged in successfully!`)
    .setOnSuccessFn((dto, jwtPackage) => { console.log('Login successful:', dto, jwtPackage); })


  private _forgotPwdState = MiniStateBuilder
    .CreateWithInput((dto: ForgotPwdDto) => this._ioService.forgotPassword(dto))
    .setSuccessMsgFn((dto, response) => `${response.message}`)

  //- - - - - - - - - - - - - //

  private _states = MiniStateCombined.Combine(
    this._loginState,
    this._forgotPwdState,
    this._googleLoginState)


  successMsg = this._states.successMsg
  errorMsg = this._states.errorMsg
  loading = this._states.loading

  loginSuccess = computed(() => !!this._loginState.successMsg() || !!this._googleLoginState.successMsg())

  //Two-Factor Authentication related state
  private _loginStateError = MiniStateCombined.CombineErrors(
    this._loginState,
    this._googleLoginState)

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
    this._googleLoginState.trigger(dto)


  forgotPassword = (dto: ForgotPwdDto) =>
    this._forgotPwdState.trigger(dto)


}//Cls