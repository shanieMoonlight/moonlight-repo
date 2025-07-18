import { RouteUtility } from '@spider-baby/utils-routes';

//#################################################//

/** Base route for the Main application area. */
const BaseRoute = 'docs';

/** Type alias for the child routes of the main application area: 'home' | 'about'. */
type CHILD_ROUTE =
  | 'home'

//#################################################//

/**
 * Defines routes for the main area of the Hub application.
 */
export class ApiSectionRoutesDefs {
  /** Base route path for the main area (e.g., 'main'). */
  public static readonly BASE = BaseRoute;

  /**
   * Returns the provided route segment.
   * Primarily for use in this area's Angular route configuration.
   * @param route - The route segment (e.g., 'home', 'about', or 'main' itself).
   * @returns The route segment.
   */
  static route = (route?: CHILD_ROUTE) => route ?? ApiSectionRoutesDefs.BASE;

  //- - - - - - - - - - - - - - - - - - -//

  /**
   * Access to relative route segments for this area and its children (e.g., admin).
   * Will be used by parent routeDefs
   * @returns The last route segment.
   */
  static routes = {
    route: ApiSectionRoutesDefs.route,
    // Child sections go here....
  };

  /**
   * Factory for creating full path functions for this area and its children, prefixed by `parentRoute`.
   * @param parentRoute - The parent route to prefix paths with.
   * @returns The the full path from parentRoute.
   */
  static fullPathFn = (parentRoute: string) => {
    const basePath = RouteUtility.combine(
      parentRoute,
      ApiSectionRoutesDefs.BASE
    );
    return {
      route: (route?: CHILD_ROUTE) => RouteUtility.combine(basePath, route),
      // Child sections go here....
    };
  };
} //Cls
