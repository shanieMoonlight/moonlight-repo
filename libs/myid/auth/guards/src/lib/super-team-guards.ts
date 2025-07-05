import { CanActivateFn } from '@angular/router';
import { createMyIdCustomGuard } from './core-auth-guards';

// Guards for team types: isSpr, isMntc, isCustomer, etc.

export const superGuard: CanActivateFn = createMyIdCustomGuard(
    (authService) => authService.isSuper()
);

//-------------------//

export const superLdrGuard: CanActivateFn = createMyIdCustomGuard(
    (authService) => authService.isSuperLdr()
);

//-------------------//

export function superPositionGuard(position: number): CanActivateFn {
    return createMyIdCustomGuard((authService) => authService.isSuperPosition(position)());
}

//-------------------//

export function superPositionMinimumGuard(minPosition: number): CanActivateFn {
    return createMyIdCustomGuard((authService) => authService.isSuperPositionMinimum(minPosition)())
}

//-------------------//

export function superPositionRangeGuard(min: number, max: number): CanActivateFn {
    return createMyIdCustomGuard((authService) => {
        const pos = authService.position();
        return authService.isSuper() && pos >= min && pos <= max;
    })
}

//-------------------//

export const superMinimumGuard: CanActivateFn = createMyIdCustomGuard(
    (authService) => authService.isSuperMinimum()
);

//-------------------//

export const superOrDevGuard: CanActivateFn = createMyIdCustomGuard(
    (authService) => authService.isSuperOrDev()
);

//-------------------//

export const superMinimumOrDevGuard: CanActivateFn = createMyIdCustomGuard(
    (authService) => authService.isSuperMinimumOrDev()
);
