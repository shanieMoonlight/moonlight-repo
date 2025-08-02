import { RouteUtility } from '@spider-baby/utils-routes';

//#################################################//

/** Base route for the main application area. */
const BaseRoute = 'main';

/** Type alias for the child routes of the main application area: 'home' | 'open-source'. */
type CHILD_ROUTE = 'home'
  | 'open-source'
  | 'tester';

/** Type alias for all routes (base and child) of the main application area. */
type ROUTE = typeof BaseRoute | CHILD_ROUTE;

//#################################################//

/**
 * Defines routes for the main area of the Hub application.
 * See `apps/hub/sb-hub/@docs/route-defs-pattern.md` for details.
 */
export class HubMainAreaRoutesDefs {
  /** Base route path for the main area (e.g., 'main'). */
  public static readonly BASE = BaseRoute;

  //- - - - - - - - - - - - - - - - - - -//

  /**
   * Returns the provided route segment.
   * Primarily for use in this area's Angular route configuration.
   * @param route - The route segment (e.g., 'home', 'open-source', or 'main' itself).
   * @returns The route segment.
   */
  static route = (route: ROUTE) => route;

  //- - - - - - - - - - - - - - - - - - -//

  /**
   * Access to relative route segments for this area and its children (e.g., admin).
   * See `apps/hub/sb-hub/@docs/route-defs-pattern.md`.
   */
  static routes = {
    /**
     * Returns the child route segment or the base segment of this main area.
     * @param route - Optional child route segment (e.g., 'home', 'open-source').
     * @returns Child route segment or `HubMainAreaRoutesDefs.BASE`.
     */
    route: (route?: CHILD_ROUTE) => route ?? HubMainAreaRoutesDefs.BASE,
    /** Relative routes for the 'admin' area, nested under 'main'. */
    // admin: HubAdminAreaRoutesDefs.routes,
  };

  //- - - - - - - - - - - - - - - - - - -//

  /**
   * Provides methods for constructing full paths starting from the main area's base route.
   */
  static fullPath = {
    /**
     * Returns the full path for a given child route, prefixed with the main area's base route.
     * If no route is provided, it returns the main area's base path.
     * @param route - Optional child route.
     * @returns The full path for the child route or the main area's base path.
     */
    route: (route?: CHILD_ROUTE) =>
      RouteUtility.combine(HubMainAreaRoutesDefs.BASE, route),
    /** Full paths for the 'admin' area, nested under 'main'. */
    // admin: HubAdminAreaRoutesDefs.fullPathFn(HubMainAreaRoutesDefs.BASE),
  };

  //- - - - - - - - - - - - - - - - - - -//

  /**
   * Factory for creating full path functions for this area and its children, prefixed by `parentRoute`.
   * See `apps/hub/sb-hub/@docs/route-defs-pattern.md`.
   * @param parentRoute - The parent route to prefix paths with.
   */
  static fullPathFn = (parentRoute: string) => {
    const basePath = RouteUtility.combine(
      parentRoute,
      HubMainAreaRoutesDefs.BASE
    );
    return {
      /**
       * Returns the full path for a child route, or the base path of this main area, prefixed by `parentRoute`.
       * @param route - Optional child route segment.
       * @returns Full path.
       */
      route: (route?: CHILD_ROUTE) => RouteUtility.combine(basePath, route),
      /** Full paths for the 'admin' area, nested under 'main'. */
      // admin: HubAdminAreaRoutesDefs.fullPathFn(basePath),
    };
  };
} //Cls
