import { CanActivateFn } from '@angular/router';
import { createMyIdCustomGuard } from './core-auth-guards';

//-------------------//

export function positionGuard(position: number): CanActivateFn {
  return createMyIdCustomGuard(authService => authService.position() === position);
}

//-------------------//

export function positionMinimumGuard(minPosition: number): CanActivateFn {
  return createMyIdCustomGuard(authService => authService.position() >= minPosition);
}

//-------------------//

export const leaderGuard = createMyIdCustomGuard(
  authService => authService.isLdr()
);

//-------------------//

export function positionRangeGuard(min: number, max: number): CanActivateFn {
  return createMyIdCustomGuard(authService => {
    const pos = authService.position();
    return pos >= min && pos <= max;
  });
}