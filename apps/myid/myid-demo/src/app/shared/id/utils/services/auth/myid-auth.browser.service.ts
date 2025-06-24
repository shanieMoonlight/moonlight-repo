import { Injectable, effect, inject } from '@angular/core';
import { LogErrorContext } from '../base/logging/log-error-context';
import { JwtStorageService } from '../jwt-storage/jwt-storage.service';
import { AMyIdAuthService } from './a-myid.auth.service';

@Injectable({
  providedIn: 'root',
})
export class MyIdAuthService extends AMyIdAuthService {

  protected jwtStore = inject(JwtStorageService);

  //-------------------//

  constructor() {
    super()
    
    if (!this.isPlatformBrowser())
      return

    const storedToken = this.jwtStore.getStoredToken();
    if (storedToken)
      this.logIn(storedToken);

    this.init();
  }

  //-------------------//

  protected init() {

    effect(() => {
      const accessToken = this.accessToken();
      if (!accessToken)
        this.jwtStore.removeJwt();
      else
        this.jwtStore.storeJwt(accessToken);
    });

  }

  //-------------------//

  protected override storeJwt = (accessToken: string): void =>
    this.jwtStore.storeJwt(accessToken);

  //-------------------//

  protected override logError = (logData: LogErrorContext): void =>
    console.log('AuthTeamRolesService.logError????', logData);

} //Cls
