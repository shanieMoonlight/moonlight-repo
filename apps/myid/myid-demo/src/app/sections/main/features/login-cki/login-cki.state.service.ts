import { computed, inject, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { MiniStateBuilder } from '@spider-baby/mini-state';
import { MiniStateCombined } from '@spider-baby/mini-state/utils';
import { AccountIoService, PreconditionRequiredError } from '@spider-baby/myid-io';
import { CookieSignInDto, CookieSignInResultData, ForgotPwdDto, GoogleSignInDto, LoginDto } from '@spider-baby/myid-io/models';
import { filter, map } from 'rxjs';
import { LoginService } from '../../../../shared/auth/services/login/login.service';
import { MyIdRouteInfo } from '../../../../shared/id/utils/my-id-route-info';

//######################//

export class TwoFactorRequiredData {
  constructor(
    public provider?: string
  ) { }
}

//######################//


@Injectable()
export class LoginCkiStateService {

  private _ioService = inject(AccountIoService)
  private _loginService = inject(LoginService)
  private _actRoute = inject(ActivatedRoute)

  //- - - - - - - - - - - - - //

  private _redirectUrl$ = this._actRoute.queryParamMap.pipe(
    map((paramMap) => paramMap.get(MyIdRouteInfo.Params.REDIRECT_URL_KEY)),
    filter((x) => !!x)
  )
  redirectUrl = toSignal(this._redirectUrl$, { initialValue: null });



  protected _cookieLoginState = MiniStateBuilder
    .CreateWithInput((dto: CookieSignInDto) => this._loginService.loginCookie(dto))
    .setSuccessMsgFn((dto) => `User,  ${dto.email ?? dto.username ?? dto.userId}, is logged in successfully!`)
    .setOnSuccessFn((dto, signinData) => { console.log('Login successful:', signinData); })


  protected _googleLoginState = MiniStateBuilder
    .CreateWithInput((dto: GoogleSignInDto) => this._loginService.loginGoogleCookie(dto))
    .setSuccessMsgFn((dto) => `Logged in successfully!`)
    .setOnSuccessFn((dto, signinData) => { console.log('Login successful:', dto, signinData); })


  protected _forgotPwdState = MiniStateBuilder
    .CreateWithInput((dto: ForgotPwdDto) => this._ioService.forgotPassword(dto))
    .setSuccessMsgFn((dto, response) => `${response.message}`)

  //- - - - - - - - - - - - - //

  private _states = MiniStateCombined.Combine(
    this._cookieLoginState,
    this._forgotPwdState,
    this._googleLoginState)

  successMsg = this._states.successMsg
  errorMsg = this._states.errorMsg
  loading = this._states.loading

  loginSuccess = computed(() => !!this._cookieLoginState.successMsg() || !!this._googleLoginState.successMsg())


  //Two-Factor Authentication related state
  private _loginStateError = MiniStateCombined.CombineErrors(
    this._cookieLoginState,
    this._googleLoginState)

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


  forgotPassword = (dto: ForgotPwdDto) =>
    this._forgotPwdState.trigger(dto)



}//Cls