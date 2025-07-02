import { inject, InjectionToken } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { MyIdRouter } from '../../id/utils/services/id-navigation/id-router.service';
import { AMyIdAuthService } from '../services/auth/a-myid.auth.service';
import { MY_ID_AUTH_SERVICE_TOKEN } from './myid-auth-guard.config';
import { MyIdJwtPayload } from '../services/auth/myid-jwt-payload';

// Core generic guards: logged in, email verified, claim, role, any/all roles, etc.

export function createMyIdCustomGuard<T extends AMyIdAuthService = AMyIdAuthService>(
  checkFn: (authService: T) => boolean,
  authServiceToken: InjectionToken<T> = MY_ID_AUTH_SERVICE_TOKEN as InjectionToken<T>
): CanActivateFn {
  return () => {
    const authService = inject(authServiceToken);
    const router = inject(MyIdRouter);
    return checkFn(authService) || router.createLoginUrlTree();
  };
}

  //-------------------//

export function createMyIdRoleGuard(requiredRole: string, authServiceToken: InjectionToken<AMyIdAuthService> = MY_ID_AUTH_SERVICE_TOKEN): CanActivateFn {
  return createMyIdCustomGuard(
    (authService) => authService.isLoggedIn() && authService.hasRole(requiredRole),
    authServiceToken
  );
}

  //-------------------//

export function createMyIdClaimGuard<K extends keyof MyIdJwtPayload>(
  claimType: K,
  requiredValue: MyIdJwtPayload[K],
  authServiceToken: InjectionToken<AMyIdAuthService> = MY_ID_AUTH_SERVICE_TOKEN
): CanActivateFn {
  return createMyIdCustomGuard(
    (authService) => authService.isLoggedIn() && authService.hasClaim(claimType, requiredValue),
    authServiceToken
  );
}

  //-------------------//

export function createMyIdAnyRoleGuard(requiredRoles: string[], authServiceToken: InjectionToken<AMyIdAuthService> = MY_ID_AUTH_SERVICE_TOKEN): CanActivateFn {
  return createMyIdCustomGuard(
    (authService) => {
      const userRoles = authService.roles();
      return requiredRoles.some(role => userRoles.includes(role));
    },
    authServiceToken
  );
}

  //-------------------//

export function createMyIdAllRolesGuard(requiredRoles: string[], authServiceToken: InjectionToken<AMyIdAuthService> = MY_ID_AUTH_SERVICE_TOKEN): CanActivateFn {
  return createMyIdCustomGuard(
    (authService) => {
      const userRoles = authService.roles();
      return authService.isLoggedIn() && requiredRoles.every(role => userRoles.includes(role));
    },
    authServiceToken
  );
}

  //-------------------//

export const myIdEmailVerifiedGuard: CanActivateFn = createMyIdCustomGuard(
  (authService) => authService.isLoggedIn() && authService.emailVerified()
);

  //-------------------//

export const myIdLoggedInGuard: CanActivateFn = createMyIdCustomGuard(
  (authService) => {
    console.log('myIdLoggedInGuard check', authService.isLoggedIn());
    return authService.isLoggedIn();
  }
);
