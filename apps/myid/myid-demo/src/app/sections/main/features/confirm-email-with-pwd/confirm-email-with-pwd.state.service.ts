import { computed, inject, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { MiniStateBuilder } from '@spider-baby/mini-state';
import { MiniStateCombined } from '@spider-baby/mini-state/utils';
import { combineLatest, filter, map, Subject } from 'rxjs';
import { ConfirmEmailWithPwdDto } from '../../../../shared/io/models';
import { AccountIoService } from '../../../../shared/io/services';
import { MyIdRouteInfo } from '../../main-route-defs';

//###############################//

export type ConfirmEmailWithPwdInput = Omit<ConfirmEmailWithPwdDto, 'userId' | 'confirmationToken'>;

//###############################//

@Injectable()
export class ConfirmEmailWithPwdStateService {


  private _actRoute = inject(ActivatedRoute);
  private _ioService = inject(AccountIoService)


  //- - - - - - - - - - - - - //

  private _userId$ = this._actRoute.queryParamMap.pipe(
    map((paramMap) => paramMap.get(MyIdRouteInfo.Params.USER_ID)),
    filter((x) => !!x)
  );
  private _userId = toSignal(this._userId$);


  private _token$ = this._actRoute.queryParamMap.pipe(
    map((paramMap) => paramMap.get(MyIdRouteInfo.Params.CONFIRMATION_TOKEN)),
    filter((x) => !!x))
  private _token = toSignal(this._token$)

  invalidDataErrorMsg = computed(() => !this.readyToConfirm()
  ? `Invalid userId or token.`
  : undefined
);


protected _confirmInputData$ = new Subject<ConfirmEmailWithPwdInput>();

private _confirmDto$ = combineLatest([this._userId$, this._token$, this._confirmInputData$])
.pipe(
  map(([userId, token, confirmData]) => {
    return {
      userId: userId,
      confirmationToken: token,
      ...confirmData
    } as ConfirmEmailWithPwdDto
  })
)


protected _confirmEmailState = MiniStateBuilder
.CreateWithObservableInput(
  this._confirmDto$,
  (dto: ConfirmEmailWithPwdDto) => this._ioService.confirmEmailWithPassword(dto))
  .setSuccessMsgFn((dto, response) => `${response.message}`)
  
  
  //- - - - - - - - - - - - - //
  
  
  private _states = MiniStateCombined.Combine(
    this._confirmEmailState
  )
  
  successMsg = this._states.successMsg
  errorMsg = computed(() => this.invalidDataErrorMsg() || this._states.errorMsg())
  loading = this._states.loading
  
  readyToConfirm = computed(() => !!this._userId() && !!this._token())
  
  //--------------------------//


  confirmEmail = (dto: ConfirmEmailWithPwdInput) =>
    this._confirmInputData$.next(dto);

}//Cls
