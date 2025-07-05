import { inject, InjectionToken, Provider, Type } from '@angular/core';
import { AUserMgrAdminAuthService } from '../services/a-user-admin-auth.service';
import { UserMgrAdminAuthService } from '../services/user-admin-auth.browser.service';
// import { MyIdIonicAuthService } from '../services/auth/myid-auth.ionic.service'; // if you have one

export const MY_ID_AUTH_SERVICE_TOKEN = new InjectionToken<AUserMgrAdminAuthService>(
    'MY_ID_AUTH_SERVICE',
    {
        providedIn: 'root',
        factory: () => inject(UserMgrAdminAuthService),
    }
);

//-------------------//

export function provideMyIdAuthGuards(useClass: Type<AUserMgrAdminAuthService>): Provider[] {
    return [{ provide: MY_ID_AUTH_SERVICE_TOKEN, useClass }];
}

//-------------------//

export function provideMyIdBrowserAuthGuards(): Provider[] {
    return provideMyIdAuthGuards(UserMgrAdminAuthService);
}

//-------------------//

// export function provideMyIdIonicAuthGuards(): Provider[] {
//   return provideMyIdAuthGuards(MyIdIonicAuthService);
// }
