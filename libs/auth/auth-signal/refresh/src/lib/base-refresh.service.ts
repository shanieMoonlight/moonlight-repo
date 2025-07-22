import { isPlatformBrowser } from '@angular/common';
import { Directive, OnDestroy, PLATFORM_ID, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { TimeInMillis } from '@spider-baby/utils-common/dates';
import { BehaviorSubject, Subject } from 'rxjs';

//###################################//

export interface RefreshTokenData {
  refreshToken: string;
  expiration: number; // Unix timestamp (seconds)
}

//###################################//

@Directive({})
/**
 * Base class for RefreshToken authentication using Angular signals.
 * Provides type-safe, reactive access to claims and handles token expiry.
 */
export abstract class BaseRefreshTokenService implements OnDestroy {

  protected _platformId = inject(PLATFORM_ID)

  //- - - - - - - - - -//

  protected isPlatformBrowser = computed(() => isPlatformBrowser(this._platformId))
  private _refreshTriggerBs = new Subject<RefreshTokenData>();
  refresh$ = this._refreshTriggerBs.asObservable();
  refresh = toSignal(this._refreshTriggerBs, { initialValue: undefined });

  private _refreshTimeout?: ReturnType<typeof setTimeout>;
  private _stateBs = new BehaviorSubject<RefreshTokenData | undefined>(undefined);
  state = toSignal(this._stateBs, { initialValue: undefined });

  //-------------------//

  /**
   * Store the RefreshToken access token (must be implemented by subclass)
   */
  protected abstract storeToken(refreshToken: RefreshTokenData): Promise<void>

  /**
   * Remove the RefreshToken the storage (must be implemented by subclass)
   */
  protected abstract removeToken(): Promise<void>

  /**
   * Get the stored RefreshToken access token (must be implemented by subclass)
   */
  protected abstract getStoredToken(): Promise<RefreshTokenData | null>;


  //-------------------//


  async initAsync(): Promise<void> {
    if (!this.isPlatformBrowser())
      return;

    const tokenData = await this.getStoredToken();

    if (tokenData && !this.isExpired(tokenData))
      this.setRefreshState(tokenData);
    else
      this.clearRefreshState();

  }

  //- - - - - - - - - -//


  ngOnDestroy(): void {
    this.clearRefreshTimeout();
  }


  //-------------------//


  setRefreshState(state: RefreshTokenData) {
    this._stateBs.next(state);
    this.storeToken(state)
    this.scheduleRefresh(state);
  }


  //-------------------//

  clearRefreshState() {
    this._stateBs.next(undefined);
    this.removeToken();
    this.clearRefreshTimeout();
  }


  //-------------------//


  private scheduleRefresh(state: RefreshTokenData) {
    if (!state.refreshToken || !state.expiration)
      return;


    this.clearRefreshTimeout();

    const msUntilRefresh = state.expiration * 1000 - Date.now() - TimeInMillis.Minute;

    if (msUntilRefresh > 0) {
      this._refreshTimeout = setTimeout(() =>
        this._refreshTriggerBs.next(state),
        msUntilRefresh);
    } else {
      this._refreshTriggerBs.next(state)
    }

  }


  //-------------------//


  private clearRefreshTimeout() {
    if (this._refreshTimeout)
      clearTimeout(this._refreshTimeout);
  }

  //-------------------//

  private isExpired = (data: RefreshTokenData): boolean =>
    !data.expiration || Date.now() >= data.expiration * 1000;


} //Cls
