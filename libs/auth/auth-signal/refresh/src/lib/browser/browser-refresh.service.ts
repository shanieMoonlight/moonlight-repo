import { Injectable, inject } from '@angular/core';
import { BaseRefreshTokenService, RefreshTokenData } from '@spider-baby/auth-signal';
import { JwtRefreshTokenStorageService } from './refresh-token-storage.service';

/**
 * Service to handle JWT refresh token operations in a browser environment.
 * Uses local storage to store and retrieve refresh tokens. */
@Injectable({
  providedIn: 'root',
})
export class RefreshTokenService extends BaseRefreshTokenService {

  protected tknStore = inject(JwtRefreshTokenStorageService)
  
  //-------------------//

  constructor() {
    super()    

    this.initAsync()
  }

  //-------------------//


  protected override storeToken(accessToken: RefreshTokenData): Promise<void> {
    this.tknStore.storeTokenData(accessToken);
    return Promise.resolve();
  }


  //- - - - - - - - - -//


  protected override removeToken(): Promise<void> {
    this.tknStore.removeTokenData();
    return Promise.resolve();
  }

  //- - - - - - - - - -//


  protected override getStoredToken():Promise<RefreshTokenData | null> {
    return Promise.resolve(this.tknStore.getTokenData())
  }


} //Cls
