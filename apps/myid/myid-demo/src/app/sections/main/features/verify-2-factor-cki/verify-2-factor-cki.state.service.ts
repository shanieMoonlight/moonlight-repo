import { computed, inject, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { MiniStateBuilder } from '@spider-baby/mini-state';
import { MiniStateCombined } from '@spider-baby/mini-state/utils';
import { combineLatest, filter, map, startWith, Subject, switchMap, takeWhile, timer } from 'rxjs';
import { MyIdRouteInfo } from '../../../../shared/id/utils/my-id-route-info';
import { LoginService } from '../../../../shared/auth/services/login/login.service';
import { Verify2FactorCookieDto, Verify2FactorDto } from '@spider-baby/myid-io/models';
import { AccountIoService } from '@spider-baby/myid-io';

@Injectable()
export class Verify2FactorCookieStateService {

  private _ioService = inject(AccountIoService)
  private _loginService = inject(LoginService)
  private _actRoute = inject(ActivatedRoute);

  //- - - - - - - - - - - - - //

  private _redirectUrl$ = this._actRoute.queryParamMap.pipe(
    map((paramMap) => paramMap.get(MyIdRouteInfo.Params.REDIRECT)),
    filter((x) => !!x)
  )
  redirectUrl = toSignal(this._redirectUrl$, { initialValue: null });

  //- - - - - - - - - - - - - //

  protected _verifyCode$ = new Subject<string>();
  private _verifyDto$ = combineLatest([this._verifyCode$])
    .pipe(
      map(([code]) => {
        return { code } as Verify2FactorDto
      })
    )

  protected _verifyState = MiniStateBuilder
    .CreateWithObservableInput(
      this._verifyDto$,
      (dto: Verify2FactorCookieDto) => this._loginService.verify2FactorCookie(dto))
    .setSuccessMsgFn(() => `${'2FA verification successful!'}`)


  protected _resendClick$ = new Subject<void>()
  protected _resendState = MiniStateBuilder
    .CreateWithObservableInput(
      this._resendClick$,
      () => this._ioService.twoFactorResendCookie())
    .setSuccessMsgFn((dto, response) => `${response.message || '2FA code has been resent!'}`)


  //- - - - - - - - - - - - - //


  private _states = MiniStateCombined.Combine(
    this._verifyState,
    this._resendState)

  successMsg = this._states.successMsg
  loading = this._states.loading
  errorMsg = computed(() => this._states.errorMsg())


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


  verify2Factor = (code: string) => {
    console.log('verify2Factor - Cookie', code)
    this._verifyCode$.next(code)
  }

  resend2Factor = () =>
    this._resendClick$.next()

}//Cls

