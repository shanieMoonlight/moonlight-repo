import { inject, InjectionToken, Provider, Type } from '@angular/core';
import { AMyIdAuthService, MyIdAuthService } from '@spider-baby/myid-auth/services';
// import { MyIdIonicAuthService } from '../services/auth/myid-auth.ionic.service'; // if you have one

export const MY_ID_AUTH_SERVICE_TOKEN = new InjectionToken<AMyIdAuthService>(
    'MY_ID_AUTH_SERVICE',
    {
        providedIn: 'root',
        factory: () => inject(MyIdAuthService), //Fallback to browser service
    }
);

//-------------------//

export function provideMyIdAuthGuards(useClass: Type<AMyIdAuthService>): Provider[] {
    return [{ provide: MY_ID_AUTH_SERVICE_TOKEN, useClass }];
}

//-------------------//

export function provideMyIdBrowserAuthGuards(): Provider[] {
    return provideMyIdAuthGuards(MyIdAuthService);
}

//-------------------//

// export function provideMyIdIonicAuthGuards(): Provider[] {
//   return provideMyIdAuthGuards(MyIdIonicAuthService);
// }
