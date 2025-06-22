import { computed, inject, Injectable } from '@angular/core';
import { MiniStateBuilder } from '@spider-baby/mini-state';
import { MiniStateCombined } from '@spider-baby/mini-state/utils';
import { LoginService } from '../../../../shared/id/utils/services/login/login.service';
import { PreconditionRequiredError } from '../../../../shared/io/data-service/io-errors';
import { CookieSignInDto, ForgotPwdDto, GoogleSignInDto, JwtPackage, LoginDto } from '../../../../shared/io/models';
import { AccountIoService } from '../../../../shared/io/services';


@Injectable()
export class LoginCkiStateService {

  private _ioService = inject(AccountIoService)
  private _loginService = inject(LoginService)

  //- - - - - - - - - - - - - //

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

  twoFactorRequired = computed(() => {
    const error = this._loginStateError();
    // Check for PreconditionRequiredError and the flag
    return !!(error && error instanceof PreconditionRequiredError && error.isTwoFactorRequired)
  })

  twoFactorToken = computed(() => {
    const error = this._loginStateError();
    if (!error || !(error instanceof PreconditionRequiredError))
      return undefined;
    const payload = error.payload as (JwtPackage | undefined);
    return payload?.twoFactorToken
  })

  //- - - - - - - - - - - - - //


  loginCookie = (dto: LoginDto) =>
    this._cookieLoginState.trigger(dto)


  loginGoogleCookie = (dto: GoogleSignInDto) =>
    this._googleLoginState.trigger(dto)


  forgotPassword = (dto: ForgotPwdDto) =>
    this._forgotPwdState.trigger(dto)



}//Cls