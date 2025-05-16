import { Type } from '@angular/core';
import {
  CanActivateFn,
  DefaultExport,
  LoadChildren,
  Routes,
} from '@angular/router';
import { Observable } from 'rxjs';

//#################################################//

/**
 * Creates a route definition factory for lazy-loading a standalone component.
 *
 * This function returns another function which, when called, produces an Angular
 * route definition object configured to use `loadComponent`. It also provides
 * a convenient way to set route data (especially for animations) and `canActivate` guards.
 *
 * @param path - The URL path segment for this route (e.g., 'home', 'products/:id').
 * @param routeLoader - A function that dynamically imports and returns the standalone
 *   component to be loaded for this route. This matches the expected signature for Angular's `loadComponent`.
 * @returns A function that accepts optional `data` and `canActivate` guards, and returns
 *   a `Routes` array containing the configured route definition.
 *
 * @example
 * const loadHomeComponent = () => import('./home.component').then(m => m.HomeComponent);
 * const homeRouteEntry = routeBuilderComponent('home', loadHomeComponent);
 * const routes: Routes = [
 *   ...homeRouteEntry({ title: 'Welcome' }, [myAuthGuard])
 * ];
 */
export function routeBuilderComponent(
  path: string,
  routeLoader: () =>
    | Type<unknown>
    | Observable<Type<unknown> | DefaultExport<Type<unknown>>>
    | Promise<Type<unknown> | DefaultExport<Type<unknown>>>
) {
  return (data?: any, canActivate?: Array<CanActivateFn>): Routes => [
    {
      path: path,
      loadComponent: routeLoader,
      canActivate: canActivate,
      data: {
        ...data,
        animation: data?.animation ?? path,
      },
    },
  ];
}

//#################################################//

/**
 * Creates a route definition factory for lazy-loading child routes or a module containing child routes.
 *
 * This function returns another function which, when called, produces an Angular
 * route definition object configured to use `loadChildren`. It also provides
 * a convenient way to set route data (especially for animations) and `canActivate` guards
 * for the parent route that loads these children.
 *
 * @param path - The URL path segment for this parent route.
 * @param routeLoader - A function that dynamically imports and returns a `Routes` array
 *   (for standalone child routes) or an `NgModule` class (for module-based child routes).
 *   This matches Angular's `LoadChildren` type.
 * @returns A function that accepts optional `data` and `canActivate` guards, and returns
 *   a `Routes` array containing the configured parent route definition.
 *
 * @example
 * const loadAdminModule = () => import('./admin/admin.module').then(m => m.AdminModule);
 * const adminRouteEntry = routeBuilderChildren('admin', loadAdminModule);
 * const routes: Routes = [
 *   ...adminRouteEntry({ section: 'Administration' }, [adminAccessGuard])
 * ];
 */
export function routeBuilderChildren(path: string, routeLoader: LoadChildren) {
  return (data?: any, canActivate?: Array<CanActivateFn>): Routes => [
    {
      path: path,
      loadChildren: routeLoader,
      canActivate: canActivate,
      data: {
        ...data,
        animation: data?.animation ?? path,
      },
    },
  ];
}

//#################################################//
