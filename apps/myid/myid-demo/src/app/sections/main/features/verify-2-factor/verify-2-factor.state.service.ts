import { computed, inject, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { MiniStateBuilder } from '@spider-baby/mini-state';
import { MiniStateCombined } from '@spider-baby/mini-state/utils';
import { combineLatest, filter, map, startWith, Subject, switchMap, takeWhile, timer } from 'rxjs';
import { LoginService } from '../../../../shared/auth/services/login/login.service';
import { Resend2FactorDto, Verify2FactorDto } from '@spider-baby/myid-io/models';
import { AccountIoService } from '@spider-baby/myid-io';
import { MyIdRouteInfo } from '../../../../shared/id/utils/my-id-route-info';

@Injectable()
export class Verify2FactorStateService {

  private _ioService = inject(AccountIoService)
  private _loginService = inject(LoginService)
  private _actRoute = inject(ActivatedRoute);

  //- - - - - - - - - - - - - //

  private _redirectUrl$ = this._actRoute.queryParamMap.pipe(
    map((paramMap) => paramMap.get(MyIdRouteInfo.Params.REDIRECT_URL_KEY)),
    filter((x) => !!x)
  )
  redirectUrl = toSignal(this._redirectUrl$, { initialValue: null });

  private _token$ = this._actRoute.queryParamMap.pipe(
    map((paramMap) => paramMap.get(MyIdRouteInfo.Params.TWO_FACTOR_TOKEN_KEY)),
    filter((x) => !!x)
  )
  private _token = toSignal(this._token$,  { initialValue: null });

  private _provider$ = this._actRoute.queryParamMap.pipe(
    map((paramMap) => paramMap.get(MyIdRouteInfo.Params.TWO_FACTOR_PROVIDER_KEY)),
    filter((x) => !!x)
  )
  provider = toSignal(this._provider$,  { initialValue: null });

  invalidDataErrorMsg = computed(() => !this._token()
    ? `Invalid token.`
    : undefined
  );


  //- - - - - - - - - - - - - //

  protected _verifyCode$ = new Subject<string>();
  private _verifyDto$ = combineLatest([this._token$, this._verifyCode$])
    .pipe(
      map(([token, code]) => {
        return {
          token,
          code
        } as Verify2FactorDto
      })
    )

  protected _verifyState = MiniStateBuilder
    .CreateWithObservableInput(
      this._verifyDto$,
      (dto: Verify2FactorDto) => this._loginService.verify2Factor(dto))
    .setSuccessMsgFn(() => `${'2FA verification successful!'}`)


  protected _resendClick$ = new Subject<void>();
  private _resendDto$ = combineLatest([this._token$, this._resendClick$])
    .pipe(
      map(([token]) => {
        return {
          token
        } as Resend2FactorDto
      })
    )
  protected _resendState = MiniStateBuilder
    .CreateWithObservableInput(
      this._resendDto$,
      (dto: Resend2FactorDto) => this._ioService.twoFactorResend(dto))
    .setSuccessMsgFn((dto, response) => `${response.message || '2FA code has been resent!'}`)


  //- - - - - - - - - - - - - //


  private _states = MiniStateCombined.Combine(
    this._verifyState,
    this._resendState)

  successMsg = this._states.successMsg
  loading = this._states.loading
  errorMsg = computed(() => this.invalidDataErrorMsg() || this._states.errorMsg())


  verifySuccess = computed(() => !!this._verifyState.successMsg())


  private _cooldownSeconds = 30
  private _cooldownCountdown$ = this._resendClick$.pipe(
    switchMap(() =>
      timer(0, 1000).pipe(
        map(i => this._cooldownSeconds - i),
        takeWhile(sec => sec >= 0)
      )
    ),
    startWith(0)
  );

  resendCooldownCountdown = toSignal(this._cooldownCountdown$, { initialValue: 0 });


  //--------------------------//


  verify2Factor = (code: string) =>
    this._verifyCode$.next(code)

  resend2Factor = () =>
    this._resendClick$.next()

}//Cls

