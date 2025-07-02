import { CanActivateFn } from '@angular/router';
import { createUserMgrAdminCustomGuard } from './core-auth-guards';

// Guards for minimums: isSprAdminMinimum, isMntcUserMinimum, etc.

export const sprAdminMinimumGuard: CanActivateFn = createUserMgrAdminCustomGuard(
    (authService) => authService.isSuperAdminMinimum()
);

//-------------------//

export const sprMgrMinimumGuard: CanActivateFn = createUserMgrAdminCustomGuard(
    (authService) => authService.isSuperMgrMinimum()
);

//-------------------//

export const mntcUserMinimumGuard: CanActivateFn = createUserMgrAdminCustomGuard(
    (authService) => authService.isMntcUserMinimum()
);

//-------------------//

export const cusLdrMinimumGuard: CanActivateFn = createUserMgrAdminCustomGuard(
    (authService) => authService.isCusLdrMinimum()
);
