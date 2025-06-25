import { computed, inject, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { MiniStateBuilder } from '@spider-baby/mini-state';
import { MiniStateCombined } from '@spider-baby/mini-state/utils';
import { combineLatest, filter, map, Subject } from 'rxjs';
import { ConfirmPhoneDto, ResendPhoneConfirmationDto } from '../../../../shared/id/io/models';
import { AccountIoService } from '../../../../shared/id/io/services';
import { MyIdRouteInfo } from '../../../../shared/id/utils/my-id-route-info';

//###############################//

@Injectable()
export class ConfirmPhoneStateService {

  private _ioService = inject(AccountIoService)
  private _actRoute = inject(ActivatedRoute);

  //- - - - - - - - - - - - - //

  private _userId$ = this._actRoute.queryParamMap.pipe(
    map((paramMap) => paramMap.get(MyIdRouteInfo.Params.USER_ID)),
    // filter((x) => !!x) // Note: This filter is not necessary if user is authenticated
  );
  private _userId = toSignal(this._userId$);


  private _token$ = this._actRoute.queryParamMap.pipe(
    map((paramMap) => paramMap.get(MyIdRouteInfo.Params.CONFIRMATION_TOKEN)),
    filter((x) => !!x)
  )
  private _token = toSignal(this._token$)

  readyToConfirm = computed(() => !!this._userId() && !!this._token())
  invalidDataErrorMsg = computed(() => !this.readyToConfirm()
    ? `Invalid userId or token.`
    : undefined
  );
  
  
  //- - - - - - - - - - - - - //


  private _confirmDto$ = combineLatest([this._userId$, this._token$])
    .pipe(
      map(([userId, token]) => {
        return {
          userId: userId,
          confirmationToken: token
        } as ConfirmPhoneDto
      })
    )

  protected _confirmPhoneState = MiniStateBuilder
    .CreateWithObservableInput(
      this._confirmDto$,
      (dto: ConfirmPhoneDto) => this._ioService.confirmPhone(dto))
    .setSuccessMsgFn((dto, response) => `${response.message || 'Phone confirmed!.'}`)

  //- - - - - - - - - - - - - //

  protected _resendClick$ = new Subject<void>();
  private _resendDto$ = combineLatest([this._userId$, this._resendClick$])
    .pipe(
      map(([userId]) => {
        return {
          userId: userId
        } as ConfirmPhoneDto
      })
    )

  protected _resendState = MiniStateBuilder
    .CreateWithObservableInput(
      this._resendDto$,
      (dto: ResendPhoneConfirmationDto) => this._ioService.resendPhoneConfirmation(dto))
    .setSuccessMsgFn((dto, response) => `${response.message || 'Resend confirmation Phone request is successful.'}`)


  //- - - - - - - - - - - - - //


  private _states = MiniStateCombined.Combine(
    this._resendState,
    this._confirmPhoneState)

  errorMsg = computed(() => this.invalidDataErrorMsg() || this._states.errorMsg())
  loading = this._states.loading

  resendSuccess = computed(() => !!this._resendState.successMsg()?.length)
  confirmationSuccess = computed(() => !!this._confirmPhoneState.successMsg()?.length)
  
  resendSuccessMsg = this._resendState.successMsg
  phoneConfirmedSuccessMsg = this._confirmPhoneState.successMsg


  //--------------------------//


  resendConfirmation = () =>       
      this._resendClick$.next();


}//Cls
