import { computed, inject, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { MiniStateBuilder } from '@spider-baby/mini-state';
import { MiniStateCombined } from '@spider-baby/mini-state/utils';
import { combineLatest, filter, map, Subject } from 'rxjs';
import { ForgotPwdDto, ResetPwdDto } from '../../../../shared/io/models';
import { AccountIoService } from '../../../../shared/io/services';
import { MyIdRouteInfo } from '../../main-route-defs';

@Injectable({
  providedIn: 'root'
})
export class ResetPwdStateService {

  private _actRoute = inject(ActivatedRoute);
  private _ioService = inject(AccountIoService)

  //- - - - - - - - - - - - - //

  private _userId$ = this._actRoute.queryParamMap.pipe(
    map((paramMap) => paramMap.get(MyIdRouteInfo.Params.USER_ID)),
    filter((x) => !!x)
  );
  private _userId = toSignal(this._userId$);


  private _token$ = this._actRoute.queryParamMap.pipe(
    map((paramMap) => paramMap.get(MyIdRouteInfo.Params.RESET_PWD_TOKEN)),
    filter((x) => !!x))
  private _token = toSignal(this._token$)

  readyToReset = computed(() => !!this._userId() && !!this._token())
  invalidDataErrorMsg = computed(() => !this.readyToReset()
    ? `Invalid userId or token.`
    : undefined
  );



  protected _resetFormData$ = new Subject<{ newPassword: string, confirmPassword: string }>();

  private _resetDto$ = combineLatest([this._userId$, this._token$, this._resetFormData$])
    .pipe(
      map(([userId, token, resetFormData]) => {
        return {
          userId: userId,
          resetToken: token,
          newPassword: resetFormData.newPassword,
          confirmPassword: resetFormData.confirmPassword,
        } as ResetPwdDto
      })
    )


  protected _resetPwdState = MiniStateBuilder
    .CreateWithObservableInput(this._resetDto$, (dto: ResetPwdDto) => this._ioService.resetPassword(dto))
    .setSuccessMsgFn((dto, response) => response.message || `Your password is successfully reset`)


  protected _forgotPwdState = MiniStateBuilder
    .CreateWithInput((dto: ForgotPwdDto) => this._ioService.forgotPassword(dto))
    .setSuccessMsgFn((dto, response) => `${response.message}`)


  //- - - - - - - - - - - - - //


  private _states = MiniStateCombined.Combine(
    this._forgotPwdState,
    this._resetPwdState)

  successMsg = this._states.successMsg
  errorMsg = computed(() => this.invalidDataErrorMsg() || this._states.errorMsg())
  loading = this._states.loading


  //- - - - - - - - - - - - - //

  resetPwd = (data: { newPassword: string, confirmPassword: string }) =>
    this._resetFormData$.next(data)



  gorgotPassword = (dto: ForgotPwdDto) =>
    this._forgotPwdState.trigger(dto)



}//Cls
