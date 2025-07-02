import { CanActivateFn } from '@angular/router';
import { createUserMgrAdminCustomGuard } from './core-auth-guards';


export const mntcAdminGuard: CanActivateFn = createUserMgrAdminCustomGuard(
    (authService) => authService.isMntcAdmin()
);

//-------------------//

export const mntcMgrGuard: CanActivateFn = createUserMgrAdminCustomGuard(
    (authService) => authService.isMntcMgr()
);

//-------------------//

export const mntcUserGuard: CanActivateFn = createUserMgrAdminCustomGuard(
    (authService) => authService.isMntcUser()
);

//-------------------//

export const mntcGuestGuard: CanActivateFn = createUserMgrAdminCustomGuard(
    (authService) => authService.isMntcGuest()
);

//-------------------//

export const mntcAdminMinimumGuard: CanActivateFn = createUserMgrAdminCustomGuard(
    (authService) => authService.isMntcAdminMinimum()
);

//-------------------//

export const mntcMgrMinimumGuard: CanActivateFn = createUserMgrAdminCustomGuard(
    (authService) => authService.isMntcMgrMinimum()
);

//-------------------//

export const mntcUserMinimumGuard: CanActivateFn = createUserMgrAdminCustomGuard(
    (authService) => authService.isMntcUserMinimum()
);

//-------------------//

export const mntcGuestMinimumGuard: CanActivateFn = createUserMgrAdminCustomGuard(
    (authService) => authService.isMntcGuestMinimum()
);

//-------------------//