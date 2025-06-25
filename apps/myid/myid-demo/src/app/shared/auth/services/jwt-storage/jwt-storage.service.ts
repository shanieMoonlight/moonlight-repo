import { Injectable, inject } from '@angular/core';
import { SsrLocalStorage } from '@spider-baby/ssr-storage';

//###########################//

/** Storage Key*/
export const JWT_AUTH_KEY = 'spider_baby_auth_key'

//###########################//

@Injectable({
  providedIn: 'root'
})
export class JwtStorageService {

  protected _localStorage = inject(SsrLocalStorage)

  //------------------//

  /**
   * 
   * @param accessToken Store jwt. Will removeJwt if !accessToken
   * @returns 
   */
  storeJwt =(accessToken?: string): void =>
    !accessToken
      ? this.removeJwt()
      : this._localStorage.setItem(JWT_AUTH_KEY, accessToken)  

  //- - - - - - - - - //

  removeJwt = (): void =>
    this._localStorage.removeItem(JWT_AUTH_KEY)

  //- - - - - - - - - //

  /**Get jwt from storage*/
  getStoredToken = (): string | null =>
    this._localStorage.getItem(JWT_AUTH_KEY)


}
