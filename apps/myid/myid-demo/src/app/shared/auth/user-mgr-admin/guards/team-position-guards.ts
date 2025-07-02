import { CanActivateFn } from '@angular/router';
import { createUserMgrAdminCustomGuard } from './core-auth-guards';
// Guards for positions: isLdr, isAdmin, isUser, isMgr, isGuest, etc.

export const isAdminGuard: CanActivateFn = createUserMgrAdminCustomGuard(
  (authService) => authService.isAdmin()
);

  //-------------------//

export const isMgrGuard: CanActivateFn = createUserMgrAdminCustomGuard(
  (authService) => authService.isMgr()
);

  //-------------------//

export const isUserGuard: CanActivateFn = createUserMgrAdminCustomGuard(
  (authService) => authService.isUser()
);

  //-------------------//

export const isGuestGuard: CanActivateFn = createUserMgrAdminCustomGuard(
  (authService) => authService.isGuest()
);

  //-------------------//