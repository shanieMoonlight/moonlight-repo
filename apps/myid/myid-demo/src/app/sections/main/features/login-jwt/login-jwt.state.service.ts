import { inject, Injectable, signal } from '@angular/core';
import { MiniStateBuilder } from '@spider-baby/mini-state';
import { MiniStateCombined } from '@spider-baby/mini-state/utils';
import { LoginService } from '../../../../shared/id/utils/services/login/login.service';
import { ForgotPwdDto, GoogleSignInDto, LoginDto } from '../../../../shared/io/models';
import { AccountIoService } from '../../../../shared/io/services';

@Injectable()
export class LoginJwtStateService {

  private _ioService = inject(AccountIoService)
  private _loginService = inject(LoginService)


  //- - - - - - - - - - - - - //


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


  //- - - - - - - - - - - - - //


  login = (dto: LoginDto) =>
    this._loginState.trigger(dto)


  loginGoogle = (dto: GoogleSignInDto) =>
    this._googleLoginState.trigger(dto)


  forgotPassword = (dto: ForgotPwdDto) =>
    this._forgotPwdState.trigger(dto)


}//Cls