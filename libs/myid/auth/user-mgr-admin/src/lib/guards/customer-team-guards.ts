import { CanActivateFn } from '@angular/router';
import { createUserMgrAdminCustomGuard } from './core-auth-guards';

// Guards for team typesGuard: isSpr, isMntc, isCustomer, etc.

export const customerAdminGuard: CanActivateFn = createUserMgrAdminCustomGuard(
    (authService) => authService.isCusAdmin()
);

//-------------------//

export const customerMgrGuard: CanActivateFn = createUserMgrAdminCustomGuard(
    (authService) => authService.isCusMgr()
);

//-------------------//

export const customerUserGuard: CanActivateFn = createUserMgrAdminCustomGuard(
    (authService) => authService.isCusUser()
);

//-------------------//

export const customerGuestGuard: CanActivateFn = createUserMgrAdminCustomGuard(
    (authService) => authService.isCusGuest()
);

//-------------------//

export const customerAdminMinimumGuard: CanActivateFn = createUserMgrAdminCustomGuard(
    (authService) => authService.isCusAdminMinimum()
);

//-------------------//

export const customerMgrMinimumGuard: CanActivateFn = createUserMgrAdminCustomGuard(
    (authService) => authService.isCusMgrMinimum()
);

//-------------------//

export const customerUserMinimumGuard: CanActivateFn = createUserMgrAdminCustomGuard(
    (authService) => authService.isCusUserMinimum()
);

//-------------------//

export const customerGuestMinimumGuard: CanActivateFn = createUserMgrAdminCustomGuard(
    (authService) => authService.isCusGuestMinimum()
);

//-------------------//