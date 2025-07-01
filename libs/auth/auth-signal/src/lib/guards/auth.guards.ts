import { inject, InjectionToken, Type } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { BaseAuthSignalService } from '../base-auth.signal.service';

/**
 * Type for injection tokens that provide BaseAuthSignalService instances
 */
export type AuthServiceToken = Type<BaseAuthSignalService> | InjectionToken<BaseAuthSignalService>;


//-------------------------//


/**
 * Generic function to create guards with custom redirect logic
 * @param serviceToken The injection token for your auth service
 * @param checkFn Custom function to determine access
 * @param redirectUrl Optional URL to redirect to on failure
 * @returns CanActivateFn
 */
export function createCustomGuard<T extends BaseAuthSignalService>(
    serviceToken: Type<T> | InjectionToken<T>,
    checkFn: (authService: T) => boolean,
    redirectUrl?: string
): CanActivateFn {
    return () => {
        const authService = inject(serviceToken);
        const router = redirectUrl ? inject(Router) : null;

        const hasAccess = checkFn(authService);

        if (!hasAccess && router) {
            router.navigate([redirectUrl]);
            return false;
        }

        return hasAccess;
    };
}


//-------------------------//


/**
 * Generic function to create auth guards that work with any BaseAuthSignalService implementation
 * @param serviceToken The injection token for your auth service
 * @returns CanActivateFn
 */
export function createLoggedInGuard(
    serviceToken: AuthServiceToken,
    redirectUrl?: string
): CanActivateFn {
    return createCustomGuard(
        serviceToken,
        (authService: BaseAuthSignalService) => authService.isLoggedIn(),
        redirectUrl
    );
}


//-------------------------//


/**
 * Generic function to create role-based guards
 * @param serviceToken The injection token for your auth service
 * @param requiredRole The role required to access the route
 * @returns CanActivateFn
 */
export function createRoleGuard(
    serviceToken: AuthServiceToken,
    requiredRole: string,
    redirectUrl?: string
): CanActivateFn {
    return createCustomGuard(
        serviceToken,
        (authService: BaseAuthSignalService) => authService.isLoggedIn() && authService.hasRole(requiredRole),
        redirectUrl
    );
}


//-------------------------//


/**
 * Generic function to create permission-based guards using custom claims
 * @param serviceToken The injection token for your auth service
 * @param claimType The claim to check
 * @param requiredValue The required value for the claim
 * @returns CanActivateFn
 */
export function createClaimGuard(
    serviceToken: AuthServiceToken,
    claimType: string,
    requiredValue: unknown,
    redirectUrl?: string
): CanActivateFn {
    return createCustomGuard(
        serviceToken,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (authService: BaseAuthSignalService) => authService.isLoggedIn() && authService.hasClaim(claimType as any, requiredValue),
        redirectUrl
    );
}


//-------------------------//


/**
 * Generic function to create guards that check if user has any of the specified roles
 * @param serviceToken The injection token for your auth service
 * @param requiredRoles Array of roles, user needs at least one
 * @returns CanActivateFn
 */
export function createAnyRoleGuard(
    serviceToken: AuthServiceToken,
    requiredRoles: string[],
    redirectUrl?: string
): CanActivateFn {
    return createCustomGuard(
        serviceToken,
        (authService: BaseAuthSignalService) => {
            const userRoles = authService.roles();
            return requiredRoles.some(role => userRoles.includes(role));
        },
        redirectUrl
    );
}


//-------------------------//


/**
 * Generic function to create guards that check if user has all of the specified roles
 * @param serviceToken The injection token for your auth service
 * @param requiredRoles Array of roles, user needs all of them
 * @returns CanActivateFn
 */
export function createAllRolesGuard(
    serviceToken: AuthServiceToken,
    requiredRoles: string[],
    redirectUrl?: string
): CanActivateFn {
    return createCustomGuard(
        serviceToken,
        (authService: BaseAuthSignalService) => {
            const userRoles = authService.roles();
            return authService.isLoggedIn() && requiredRoles.every(role => userRoles.includes(role));
        },
        redirectUrl
    );
}


//-------------------------//


/**
 * Generic function to create email verification guards
 * @param serviceToken The injection token for your auth service
 * @returns CanActivateFn
 */
export function createEmailVerifiedGuard(
    serviceToken: AuthServiceToken,
    redirectUrl?: string
): CanActivateFn {
    return createCustomGuard(
        serviceToken,
        (authService: BaseAuthSignalService) => authService.isLoggedIn() && authService.emailVerified(),
        redirectUrl
    );
}
