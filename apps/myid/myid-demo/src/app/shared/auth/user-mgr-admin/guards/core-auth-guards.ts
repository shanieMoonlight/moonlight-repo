import { inject, InjectionToken } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AUserMgrAdminAuthService } from '../services/a-user-admin-auth.service';
import { MyIdRouter } from '../../../id/utils/services/id-navigation/id-router.service';
import { MY_ID_AUTH_SERVICE_TOKEN } from './user-mgr-admin-auth-guard.config';

// Core generic guards: logged in, email verified, claim, role, any/all roles, etc.

export function createUserMgrAdminCustomGuard<T extends AUserMgrAdminAuthService = AUserMgrAdminAuthService>(
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