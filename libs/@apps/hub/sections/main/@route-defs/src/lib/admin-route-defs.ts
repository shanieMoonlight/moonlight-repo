import { HubRouteUtility } from '@sb-hub/shared-utils/routes';

//#################################################//

/** Base route for the main application area. */
const BaseRoute = 'administration';

/** Type alias for the child routes of the main application area: 'home' | 'open-source'. */
type CHILD_ROUTE = 'home' | 'users' | 'teams' | 'settings';
/** Type alias for all routes (base and child) of the main application area. */
type ROUTE = typeof BaseRoute | CHILD_ROUTE;

//#################################################//

/**
 * Defines routes for the admin area within the main section.
 * See `apps/hub/sb-hub/@docs/route-defs-pattern.md` for details.
 */
export class HubAdminAreaRoutesDefs {

  /** Base route path for the admin area (e.g., 'administration'). */
  public static readonly BASE = BaseRoute;

  //- - - - - - - - - - - - - - - - - - -//

  /**
   * Returns the provided route segment.
   * Primarily for use in this area's Angular route configuration.
   * @param route - The route segment (e.g., 'home', 'users', or 'administration' itself).
   * @returns The route segment.
   */
  static route = (route: ROUTE) => route;

  //- - - - - - - - - - - - - - - - - - -//

  /**
   * Access to relative route segments for this admin area.
   * See `apps/hub/sb-hub/@docs/route-defs-pattern.md`.
   */
  static routes = {
    /**
     * Returns the child route segment or the base segment of this admin area.
     * @param route - Optional child route segment (e.g., 'home', 'users').
     * @returns Child route segment or `HubAdminAreaRoutesDefs.BASE`.
     */
    route: (route?: CHILD_ROUTE) => route ?? HubAdminAreaRoutesDefs.BASE,
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
    route: (route?: CHILD_ROUTE) => HubRouteUtility.Combine(this.BASE, route),
  };

  //- - - - - - - - - - - - - - - - - - -//

  /**
   * Factory for creating full path functions for this area, prefixed by `parentRoute`.
   * See `apps/hub/sb-hub/@docs/route-defs-pattern.md`.
   * @param parentRoute - The parent route to prefix paths with.
   */
  static fullPathFn = (parentRoute: string) => {
    const basePath = HubRouteUtility.Combine(parentRoute, HubAdminAreaRoutesDefs.BASE);
    return {
      /**
       * Returns the full path for a child route, or the base path of this admin area, prefixed by `parentRoute`.
       * @param route - Optional child route segment.
       * @returns Full path.
       */
      route: (route?: CHILD_ROUTE) => HubRouteUtility.Combine(basePath, route),
    };
  };

} //Cls

