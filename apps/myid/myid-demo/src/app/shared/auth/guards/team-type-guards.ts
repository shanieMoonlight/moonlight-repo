import { CanActivateFn } from '@angular/router';
import { createMyIdCustomGuard } from './core-auth-guards';

// Guards for team types: isSpr, isMntc, isCustomer, etc.

export const myIdIsSprGuard: CanActivateFn = createMyIdCustomGuard(
    (authService) => authService.isSuper()
);

//-------------------//

export const myIdIsMntcGuard: CanActivateFn = createMyIdCustomGuard(
    (authService) => authService.isMntc()
);

//-------------------//

export const myIdIsCustomerGuard: CanActivateFn = createMyIdCustomGuard(
    (authService) => authService.isCustomer()
);
