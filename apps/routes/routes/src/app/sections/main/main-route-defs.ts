import { HubRouteUtility } from '@sb-hub/shared-utils/routes';

//#################################################//

/** Base route for the Main application area. */
const BaseRoute = 'main';

/** Type alias for the child routes of the main application area: 'home' | 'open-source'. */
type CHILD_ROUTE = 'home' | 'about'  | 'contact'| 'products';

/** Type alias for all routes (base and child) of the main application area. */
type ROUTE = typeof BaseRoute | CHILD_ROUTE;

//#################################################//

/**
 * Defines routes for the main area of the Hub application.
 * See `apps/hub/rd-hub/@docs/route-defs-pattern.md` for details.
 */
export class MainSectionRoutesDefs {

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
   * See `apps/hub/rd-hub/@docs/route-defs-pattern.md`.
   */
  static routes = {
    /**
     * Returns the child route segment or the base segment of this main area.
     * @param route - Optional child route segment (e.g., 'home', 'open-source').
     * @returns Child route segment or `HubMainAreaRoutesDefs.BASE`.
     */
    route: (route?: CHILD_ROUTE) => route ?? MainSectionRoutesDefs.BASE,
    /** Relative routes for the 'admin' area, nested under 'main'. */
    // admin: HubAdminAreaRoutesDefs.routes,
  };

  //- - - - - - - - - - - - - - - - - - -//

  /**
   * Factory for creating full path functions for this area and its children, prefixed by `parentRoute`.
   * See `apps/hub/rd-hub/@docs/route-defs-pattern.md`.
   * @param parentRoute - The parent route to prefix paths with.
   */
  static fullPathFn = (parentRoute: string) => {
    const basePath = HubRouteUtility.Combine(parentRoute, MainSectionRoutesDefs.BASE);
    return {
      /**
       * Returns the full path for a child route, or the base path of this main area, prefixed by `parentRoute`.
       * @param route - Optional child route segment.
       * @returns Full path.
       */
      route: (route?: CHILD_ROUTE) => HubRouteUtility.Combine(basePath, route),
      /** Full paths for the 'admin' area, nested under 'main'. */
      // admin: HubAdminAreaRoutesDefs.fullPathFn(basePath),
    };
  };

} //Cls

