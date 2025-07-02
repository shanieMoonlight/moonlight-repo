import { CanActivateFn } from '@angular/router';
import { createMyIdCustomGuard } from './core-auth-guards';

// Guards for dev mode or combined logic: isMntcOrDev, isSuperOrDev, etc.

export const myIdIsMntcOrDevGuard: CanActivateFn = createMyIdCustomGuard(
  (authService) => authService.isMntcOrDev()
);

  //-------------------//

export const myIdIsSuperOrDevGuard: CanActivateFn = createMyIdCustomGuard(
  (authService) => authService.isSuperOrDev()
);

  //-------------------//
