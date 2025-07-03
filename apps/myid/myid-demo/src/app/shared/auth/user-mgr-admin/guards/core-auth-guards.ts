import { inject, InjectionToken } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { filter, map, take } from 'rxjs';
import { MyIdRouter } from '../../../id/utils/services/id-navigation/id-router.service';
import { AUserMgrAdminAuthService } from '../services/a-user-admin-auth.service';
import { MY_ID_AUTH_SERVICE_TOKEN } from './user-mgr-admin-auth-guard.config';
import { MyIdRouteInfo } from '../../../id/utils/my-id-route-info';

// Core generic guards: logged in, email verified, claim, role, any/all roles, etc.

export function createUserMgrAdminCustomGuard<T extends AUserMgrAdminAuthService = AUserMgrAdminAuthService>(
  checkFn: (authService: T) => boolean,
  authServiceToken: InjectionToken<T> = MY_ID_AUTH_SERVICE_TOKEN as InjectionToken<T>
): CanActivateFn {
  return (route, state) => {
    const authService = inject(authServiceToken);
    const router = inject(MyIdRouter);

    const hasRedirect = route.queryParamMap.has(MyIdRouteInfo.Params.REDIRECT_URL_KEY);
    const redirectUrl = hasRedirect
      ? route.queryParamMap.get(MyIdRouteInfo.Params.REDIRECT_URL_KEY)
      : state.url

    // Wait for auth state to be ready before checking
    return authService.isReady$.pipe(
      filter(Boolean),
      take(1),
      map(() => checkFn(authService) || router.createLoginUrlTree(redirectUrl ?? undefined))
    );
  };
}

//-------------------//