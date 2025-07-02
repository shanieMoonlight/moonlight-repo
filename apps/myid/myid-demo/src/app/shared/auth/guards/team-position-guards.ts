import { CanActivateFn } from '@angular/router';
import { createMyIdCustomGuard } from './core-auth-guards';

// Guards for positions: isLdr, isAdmin, isUser, isMgr, isGuest, etc.

export const myIdIsLdrGuard: CanActivateFn = createMyIdCustomGuard(
  (authService) => authService.isLdr()
);

  //-------------------//

export const myIdIsAdminGuard: CanActivateFn = createMyIdCustomGuard(
  (authService) => authService.isAdmin()
);

  //-------------------//

export const myIdIsMgrGuard: CanActivateFn = createMyIdCustomGuard(
  (authService) => authService.isMgr()
);

  //-------------------//

export const myIdIsUserGuard: CanActivateFn = createMyIdCustomGuard(
  (authService) => authService.isUser()
);

  //-------------------//

export const myIdIsGuestGuard: CanActivateFn = createMyIdCustomGuard(
  (authService) => authService.isGuest()
);

  //-------------------//

export function myIdHasPositionGuard(position: number): CanActivateFn {
  return createMyIdCustomGuard(authService => {
    console.log(`Checking if user has position: ${position}`);
    console.log(`authService:`, authService);
    console.log(`authService.position:`, authService.position);
    
    return authService.position() === position});
}

  //-------------------//

export function myIdHasPositionMinimumGuard(minPosition: number): CanActivateFn {
  return createMyIdCustomGuard(authService => authService.position() >= minPosition);
}

  //-------------------//

export function myIdHasPositionRangeGuard(min: number, max: number): CanActivateFn {
  return createMyIdCustomGuard(authService => {
    const pos = authService.position();
    return pos >= min && pos <= max;
  });
}