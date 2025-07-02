import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { MyIdRouter } from '../../id/utils/services/id-navigation/id-router.service';
import { MyIdAuthService } from '../services/auth/myid-auth.browser.service';



/**
 * Generic function to create guards with navigarte to login logic
 * This is useful for cases where you want to redirect to a login page if access is denied
 * @param checkFn Custom function to determine access
 * @returns CanActivateFn
 */
export function createMyIdCustomGuard(checkFn: (authService: MyIdAuthService) => boolean)
    : CanActivateFn {
    return () => {
        const authService = inject(MyIdAuthService);
        const router = inject(MyIdRouter)

        return checkFn(authService) || router.createLoginUrlTree();
    };
}


//-------------------------//



/**
 * Generic function to create role-based guards
 * @param requiredRole The role required to access the route
 * @returns CanActivateFn
 */
export function createMyIdRoleGuard(requiredRole: string): CanActivateFn {
    return createMyIdCustomGuard(
        (authService) => authService.isLoggedIn() && authService.hasRole(requiredRole)
    );
}


//-------------------------//


/**
 * Generic function to create permission-based guards using custom claims
 * @param claimType The claim to check
 * @param requiredValue The required value for the claim
 * @returns CanActivateFn
 */
export function createMyIdClaimGuard(
    claimType: string,
    requiredValue: unknown,
): CanActivateFn {
    return createMyIdCustomGuard(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (authService) => authService.isLoggedIn() && authService.hasClaim(claimType as any, requiredValue),
    );
}


//-------------------------//


/**
 * Generic function to create guards that check if user has any of the specified roles
 * @param requiredRoles Array of roles, user needs at least one
 * @returns CanActivateFn
 */
export function createMyIdAnyRoleGuard(requiredRoles: string[]): CanActivateFn {
    return createMyIdCustomGuard(
        (authService) => {
            const userRoles = authService.roles();
            return requiredRoles.some(role => userRoles.includes(role));
        }
    );
}


//-------------------------//


/**
 * Generic function to create guards that check if user has all of the specified roles
 * @param requiredRoles Array of roles, user needs all of them
 * @returns CanActivateFn
 */
export function createMyIdAllRolesGuard(requiredRoles: string[]): CanActivateFn {
    return createMyIdCustomGuard(
        (authService) => {
            const userRoles = authService.roles();
            return authService.isLoggedIn() && requiredRoles.every(role => userRoles.includes(role));
        }
    );
}


//-------------------------//

/**
 * Generic function to create email verification guards
 * @returns CanActivateFn
 */
export const myIdEmailVerifiedGuard: CanActivateFn = createMyIdCustomGuard(
    (authService) => authService.isLoggedIn()&& authService.emailVerified())

//-------------------------//

/**
 * Generic function to create auth guards that work with any BaseAuthSignalService implementation
 * @returns CanActivateFn
 */
export const myIdLoggedInGuard: CanActivateFn = createMyIdCustomGuard(
    (authService) => authService.isLoggedIn());


//-------------------------//