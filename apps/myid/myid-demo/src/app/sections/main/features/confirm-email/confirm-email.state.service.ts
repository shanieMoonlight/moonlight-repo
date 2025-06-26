import { computed, inject, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { MiniStateBuilder } from '@spider-baby/mini-state';
import { MiniStateCombined } from '@spider-baby/mini-state/utils';
import { combineLatest, filter, map, Subject } from 'rxjs';
import { MyIdRouteInfo } from '../../../../shared/id/utils/my-id-route-info';
import { ConfirmEmailDto, ResendEmailConfirmationDto } from '@spider-baby/myid-io/models';
import { AccountIoService } from '@spider-baby/myid-io';

@Injectable()
export class ConfirmEmailStateService {

  private _ioService = inject(AccountIoService)
  private _actRoute = inject(ActivatedRoute);

  //- - - - - - - - - - - - - //

  private _userId$ = this._actRoute.queryParamMap.pipe(
    map((paramMap) => paramMap.get(MyIdRouteInfo.Params.USER_ID_KEY)),
    filter((x) => !!x)
  );
  private _userId = toSignal(this._userId$);


  private _token$ = this._actRoute.queryParamMap.pipe(
    map((paramMap) => paramMap.get(MyIdRouteInfo.Params.CONFIRMATION_TOKEN_KEY)),
    filter((x) => !!x))
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
        } as ConfirmEmailDto
      })
    )

  protected _confirmEmailState = MiniStateBuilder
    .CreateWithObservableInput(
      this._confirmDto$,
      (dto: ConfirmEmailDto) => this._ioService.confirmEmail(dto))
    .setSuccessMsgFn((dto, response) => `${response.message || 'Email confirmed!.'}`)

  //- - - - - - - - - - - - - //

  protected _resendClick$ = new Subject<void>();
  private _resendDto$ = combineLatest([this._userId$, this._resendClick$])
    .pipe(
      map(([userId]) => {
        return {
          userId: userId
        } as ConfirmEmailDto
      })
    )

  protected _resendState = MiniStateBuilder
    .CreateWithObservableInput(
      this._resendDto$,
      (dto: ResendEmailConfirmationDto) => this._ioService.resendEmailConfirmation(dto))
    .setSuccessMsgFn((dto, response) => `${response.message || 'Resend confirmation email request is successful.'}`)


  //- - - - - - - - - - - - - //


  private _states = MiniStateCombined.Combine(
    this._resendState,
    this._confirmEmailState)

  errorMsg = computed(() => this.invalidDataErrorMsg() || this._states.errorMsg())
  loading = this._states.loading

  resendSuccess = computed(() => !!this._resendState.successMsg()?.length)
  confirmationSuccess = computed(() => !!this._confirmEmailState.successMsg()?.length)
  
  resendSuccessMsg = this._resendState.successMsg
  emailConfirmedSuccessMsg = this._confirmEmailState.successMsg


  //--------------------------//


  resendConfirmation = () =>       
      this._resendClick$.next();


}//Cls
