import { CanActivateFn } from '@angular/router';
import { createUserMgrAdminCustomGuard } from './core-auth-guards';


export const superAdminGuard: CanActivateFn = createUserMgrAdminCustomGuard(
    (authService) => authService.isSuperAdmin()
);

//-------------------//

export const superMgrGuard: CanActivateFn = createUserMgrAdminCustomGuard(
    (authService) => authService.isSuperMgr()
);

//-------------------//

export const superUserGuard: CanActivateFn = createUserMgrAdminCustomGuard(
    (authService) => authService.isSuperUser()
);

//-------------------//

export const superGuestGuard: CanActivateFn = createUserMgrAdminCustomGuard(
    (authService) => authService.isSuperGuest()
);

//-------------------//

export const superAdminMinimumGuard: CanActivateFn = createUserMgrAdminCustomGuard(
    (authService) => authService.isSuperAdminMinimum()
);

//-------------------//

export const superMgrMinimumGuard: CanActivateFn = createUserMgrAdminCustomGuard(
    (authService) => authService.isSuperMgrMinimum()
);

//-------------------//

export const superUserMinimumGuard: CanActivateFn = createUserMgrAdminCustomGuard(
    (authService) => authService.isSuperUserMinimum()
);

//-------------------//

export const superGuestMinimumGuard: CanActivateFn = createUserMgrAdminCustomGuard(
    (authService) => authService.isSuperGuestMinimum()
);

//-------------------//