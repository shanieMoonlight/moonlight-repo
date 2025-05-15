import { RouteUtility } from '@sb-hub/shared-utils/routes';
import { ProductAdminSectionRoutesDefs } from '../product-admin/product-admin-route-defs';

//#################################################//

/** Base route for the admin application area. */
const BaseRoute = 'admin';

/** Type alias for the child routes of the admin application area: 'home' | 'dashboard'. */
type CHILD_ROUTE = 'home' | 'dashboard' | 'users' | 'reports' | 'settings' | 'content';

//#################################################//

/**
 * Defines routes for the Admin area of the Hub application.
 */
export class AdminSectionRoutesDefs {

  /** Base route path for the admin area (e.g., 'admin'). */
  public static readonly BASE = BaseRoute;

  /**
   * Returns the provided route segment.
   * Primarily for use in this area's Angular route configuration.
   * @param route - The route segment (e.g., 'home', 'dashboard', or 'admin' itself).
   * @returns The route segment.
   */
  static route = (route?: CHILD_ROUTE) => route ?? AdminSectionRoutesDefs.BASE

  //- - - - - - - - - - - - - -//

  /**
   * Access to relative route segments for this area and its child sections/areas.
   * Will be used by parent routeDefs
   * @returns The last route segment.
   */
  static routes = {
    route: AdminSectionRoutesDefs.route,
    products: ProductAdminSectionRoutesDefs.routes,
  };


  /**
   * Factory for creating full path functions for this area and its children, prefixed by `parentRoute`.
   * 'route' is the main routes for this area not subsections.
   * @param parentRoute - The parent route to prefix paths with.
   * @returns The the full path from parentRoute.
   */
  static fullPathFn(parentRoute: string) {
    const basePath = RouteUtility.combine(parentRoute, AdminSectionRoutesDefs.BASE);
    return {
      route: (route?: CHILD_ROUTE) => RouteUtility.combine(basePath, route),
      products: ProductAdminSectionRoutesDefs.fullPathFn(basePath),
    }
  }

} //Cls

