import { CanActivateFn } from '@angular/router';
import { createMyIdCustomGuard } from './core-auth-guards';

// Guards for minimums: isSprAdminMinimum, isMntcUserMinimum, etc.

export const myIdIsSprAdminMinimumGuard: CanActivateFn = createMyIdCustomGuard(
    (authService) => authService.isSprAdminMinimum()
);

//-------------------//

export const myIdIsSprMgrMinimumGuard: CanActivateFn = createMyIdCustomGuard(
    (authService) => authService.isSprMgrMinimum()
);

//-------------------//

export const myIdIsMntcUserMinimumGuard: CanActivateFn = createMyIdCustomGuard(
    (authService) => authService.isMntcUserMinimum()
);

//-------------------//

export const myIdIsCusLdrMinimumGuard: CanActivateFn = createMyIdCustomGuard(
    (authService) => authService.isCusLdrMinimum()
);
