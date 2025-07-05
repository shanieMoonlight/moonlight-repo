import { CanActivateFn } from '@angular/router';
import { createMyIdCustomGuard } from './core-auth-guards';

// Guards for Maintenance (Mntc) team: isMntc, isMntcLdr, isMntcPosition, etc.

export const mntcGuard: CanActivateFn = createMyIdCustomGuard(
    (authService) => authService.isMntc()
);

export const mntcLdrGuard: CanActivateFn = createMyIdCustomGuard(
    (authService) => authService.isMntcLdr()
);

export function mntcPositionGuard(position: number): CanActivateFn {
    return createMyIdCustomGuard((authService) => authService.isMntcPosition(position)());
}

export function mntcPositionMinimumGuard(minPosition: number): CanActivateFn {
    return createMyIdCustomGuard((authService) => authService.isMntcPositionMinimum(minPosition)());
}

export function mntcPositionRangeGuard(min: number, max: number): CanActivateFn {
    return createMyIdCustomGuard((authService) => {
        const pos = authService.position();
        return authService.isMntc() && pos >= min && pos <= max;
    });
}

export const mntcMinimumGuard: CanActivateFn = createMyIdCustomGuard(
    (authService) => authService.isMntcMinimum()
);

export const mntcOrDevGuard: CanActivateFn = createMyIdCustomGuard(
    (authService) => authService.isMntcOrDev()
);

export const mntcMinimumOrDevGuard: CanActivateFn = createMyIdCustomGuard(
    (authService) => authService.isMntcMinimumOrDev()
);
