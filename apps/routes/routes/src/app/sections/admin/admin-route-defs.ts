import { HubRouteUtility } from '@sb-hub/shared-utils/routes';
import { ProductAdminSectionRoutesDefs } from '../product-admin/product-admin-route-defs';

//#################################################//

/** Base route for the admin application area. */
const BaseRoute = 'admin';

/** Type alias for the child routes of the admin application area: 'home' | 'dashboard'. */
type CHILD_ROUTE = 'home' | 'dashboard' | 'users' | 'reports' | 'settings' | 'content';

/** Type alias for all routes (base and child) of the admin application area. */
type ROUTE = typeof BaseRoute | CHILD_ROUTE;

//#################################################//

/**
 * Defines routes for the Admin area of the Hub application.
 */
export class AdminSectionRoutesDefs {

  /** Base route path for the admin area (e.g., 'admin'). */
  public static readonly BASE = BaseRoute;

  //- - - - - - - - - - - - - - - - - - -//

  /**
   * Returns the provided route segment.
   * Primarily for use in this area's Angular route configuration.
   * @param route - The route segment (e.g., 'home', 'dashboard', or 'admin' itself).
   * @returns The route segment.
   */
  static route = (route: ROUTE) => route;

  //- - - - - - - - - - - - - - - - - - -//

  /**
   * Access to relative route segments for this area and its children (e.g., proucts).
   */
  static routes = {
    /**
     * Returns the child route segment or the base segment of this admin area.
     * @param route - Optional child route segment (e.g., 'home', 'dashboard').
     * @returns Child route segment or `AdminSectionRoutesDefs.BASE`.
     */
    route: (route?: CHILD_ROUTE) => route ?? AdminSectionRoutesDefs.BASE,
    /** Relative routes for the 'admin' area, nested under 'admin'. */
    products: ProductAdminSectionRoutesDefs.routes,
  };

  //- - - - - - - - - - - - - - - - - - -//

  /**
   * Factory for creating full path functions for this area and its children, prefixed by `parentRoute`.
   * @param parentRoute - The parent route to prefix paths with.
   */
  static fullPathFn = (parentRoute: string) => {
    const basePath = HubRouteUtility.Combine(parentRoute, AdminSectionRoutesDefs.BASE);
    return {
      /**
       * Returns the full path for a child route, or the base path of this admin area, prefixed by `parentRoute`.
       * @param route - Optional child route segment.
       * @returns Full path.
       */
      route: (route?: CHILD_ROUTE) => HubRouteUtility.Combine(basePath, route),
      /** Full paths for the 'admin' area, nested under 'admin'. */
      products: ProductAdminSectionRoutesDefs.fullPathFn(basePath),
    };
  };

} //Cls

