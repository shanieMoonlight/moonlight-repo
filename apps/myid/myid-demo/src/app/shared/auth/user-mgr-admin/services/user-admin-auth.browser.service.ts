import { Injectable, inject } from '@angular/core';
import { JwtStorageService } from '@spider-baby/auth-jwt-utils/storage';
import { LogErrorContext } from '@spider-baby/auth-signal';
import { AUserMgrAdminAuthService } from './a-user-admin-auth.service';

@Injectable({
  providedIn: 'root',
})
export class UserMgrAdminAuthService extends AUserMgrAdminAuthService {

  protected jwtStore = inject(JwtStorageService);

  //-------------------//

  constructor() {
    super()

    this.initAsync()

  }

  //-------------------//

  protected override storeJwt(accessToken: string): Promise<void> {
    this.jwtStore.storeJwt(accessToken);
    return Promise.resolve();
  }

  //- - - - - - - - - -//

  protected override removeJwt(): Promise<void> {
    this.jwtStore.removeJwt();
    return Promise.resolve();
  }


  protected override getStoredToken(): Promise<string | null> {
    return Promise.resolve(this.jwtStore.getStoredToken())
  }

  //- - - - - - - - - -//


  protected override logError(logData: LogErrorContext): void {
    return console.log('AuthTeamRolesService.logError????', logData);
  }

} //Cls
