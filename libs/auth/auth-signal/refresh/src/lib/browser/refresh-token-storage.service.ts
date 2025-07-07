import { Injectable, inject } from '@angular/core';
import { SsrLocalStorage } from '@spider-baby/ssr-storage';
import { RefreshTokenData } from '../base-refresh.service';

//###########################//

/** Storage Key*/
export const REFRESH_TOKEN_KEY = 'spider_baby_jwt_refresh_token_key'

//###########################//

@Injectable({
  providedIn: 'root'
})
export class JwtRefreshTokenStorageService {

  protected _localStorage = inject(SsrLocalStorage)

  //------------------//

  /**
   * 
   * @param accessToken Store jwt. Will removeRefreshToken if !accessToken
   * @returns 
   */
  storeTokenData = (tokenData?: RefreshTokenData): void =>
    !tokenData
      ? this.removeTokenData()
      : this._localStorage.setItem(REFRESH_TOKEN_KEY, JSON.stringify(tokenData))

  //- - - - - - - - - //

  removeTokenData = (): void =>
    this._localStorage.removeItem(REFRESH_TOKEN_KEY)

  //- - - - - - - - - //

  /**Get jwt from storage*/
  getTokenData(): RefreshTokenData | null {
    const refreshDataString = this._localStorage.getItem(REFRESH_TOKEN_KEY);
    return refreshDataString
      ? JSON.parse(refreshDataString)
      : null;
  }


}
