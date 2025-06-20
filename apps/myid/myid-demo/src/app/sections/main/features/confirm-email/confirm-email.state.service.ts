import { computed, inject, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { MiniStateBuilder } from '@spider-baby/mini-state';
import { MiniStateCombined } from '@spider-baby/mini-state/utils';
import { combineLatest, filter, map } from 'rxjs';
import { ConfirmEmailDto } from '../../../../shared/io/models';
import { AccountIoService } from '../../../../shared/io/services';
import { MyIdRouteInfo } from '../../main-route-defs';

@Injectable()
export class ConfirmEmailStateService {

  private _ioService = inject(AccountIoService)
  private _actRoute = inject(ActivatedRoute);

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

  readyToConfirm = computed(() => !!this._userId() && !!this._token())
  invalidDataErrorMsg = computed(() => !this.readyToConfirm()
    ? `Invalid userId or token.`
    : undefined
  );
  private _confirmDto$ = combineLatest([this._userId$, this._token$])
    .pipe(
      map(([userId, token]) => {
        return {
          userId: userId,
          confirmationToken: token
        } as ConfirmEmailDto
      })
    )



  protected _confirmPwdState = MiniStateBuilder
    .CreateWithObservableInput(
      this._confirmDto$,
      (dto: ConfirmEmailDto) => this._ioService.confirmEmail(dto))
    .setSuccessMsgFn((dto, response) => `${response.message}`)


  //- - - - - - - - - - - - - //


  private _states = MiniStateCombined.Combine(
    this._confirmPwdState)

  successMsg = this._states.successMsg
  errorMsg = this._states.errorMsg
  loading = this._states.loading


  //--------------------------//


  resend = (email: string) => {
    console.log('ConfirmEmailStateService', email)
  }

}//Cls
