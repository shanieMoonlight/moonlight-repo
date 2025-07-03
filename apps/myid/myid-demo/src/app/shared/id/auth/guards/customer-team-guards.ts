import { CanActivateFn } from '@angular/router';
import { createMyIdCustomGuard } from './core-auth-guards';

// Guards for Customer team: isCustomer, isCusLdr, isCusPosition, etc.

export const customerGuard: CanActivateFn = createMyIdCustomGuard(
    (authService) => authService.isCustomer()
);

export const cusLdrGuard: CanActivateFn = createMyIdCustomGuard(
    (authService) => authService.isCusLdr()
);

export function cusPositionGuard(position: number): CanActivateFn {
    return createMyIdCustomGuard((authService) => authService.isCusPosition(position)());
}

export function cusPositionMinimumGuard(minPosition: number): CanActivateFn {
    return createMyIdCustomGuard((authService) => authService.isCusPositionMinimum(minPosition)());
}

export function cusPositionRangeGuard(min: number, max: number): CanActivateFn {
    return createMyIdCustomGuard((authService) => {
        const pos = authService.position();
        return authService.isCustomer() && pos >= min && pos <= max;
    });
}

export const cusMinimumGuard: CanActivateFn = createMyIdCustomGuard(
    (authService) => authService.isCusMinimum()
);
