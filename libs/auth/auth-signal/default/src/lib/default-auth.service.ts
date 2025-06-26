import { Injectable, inject } from '@angular/core';
import { JwtStorageService } from '@spider-baby/auth-jwt-utils/storage';
import { BaseAuthSignalService, JwtPayload, LogErrorContext } from '@spider-baby/auth-signal';

@Injectable({
  providedIn: 'root',
})
export class SbAuthSignalService extends BaseAuthSignalService<JwtPayload> {

  protected jwtStore = inject(JwtStorageService);

  //-------------------//

  constructor() {
    super()

    this.initAsync()

  }

  //-------------------//

  protected override storeJwt(accessToken: string): void {
    return this.jwtStore.storeJwt(accessToken);
  }

  //- - - - - - - - - -//

  protected override removeJwt(): void {
    return this.jwtStore.removeJwt();
  }

  //- - - - - - - - - -//

  protected override getStoredToken():Promise<string | null> {
    return Promise.resolve(this.jwtStore.getStoredToken())
  }

  //- - - - - - - - - -//


  protected override logError(logData: LogErrorContext): void {
    return console.log('AuthTeamRolesService.logError????', logData);
  }

} //Cls
