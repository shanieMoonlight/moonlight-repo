import { HubRouteUtility } from '@sb-hub/shared-utils/routes';

//#################################################//

/** Base route for the main application area. */
const BaseRoute = 'main';

/** Type alias for the child routes of the main application area: 'home' | 'open-source'. */
type CHILD_ROUTE = 'home' | 'open-source';
/** Type alias for all routes (base and child) of the main application area. */
type ROUTE = typeof BaseRoute | CHILD_ROUTE;

//#################################################//

/**
 * Defines the routes for the main area of the Hub application.
 * This class provides static methods and properties to access and construct route paths
 * for the main section and its children.
 */
export class HubMainAreaRoutesDefs {
  /** The base route path for the main area. */
  public static readonly BASE = BaseRoute;

  //- - - - - - - - - - - - - - - - - - - - - - - //

  /**
   * Returns the provided route.
   * @param route - The route to return.
   * @returns The provided route.
   */
  static route = (route: ROUTE) => route;

  //- - - - - - - - - - - - - - - - - - - - - - - //

  /**
   * Provides methods for accessing specific route segments or paths relative to this area.
   * These are typically not full paths from the application root but rather components
   * of a path within the main area (e.g., 'home', or 'main' itself if no child is specified).
   * For full paths, see `fullPath` or `fullPathFn`.
   *
   * @example
   * ```typescript
   * // Example usage in an Angular route configuration:
   * export const MAIN_ROUTES: Route[] = [
   *   {
   *     path: '', // Base for this section, often handled by a parent route
   *     component: HubMainComponent, // The main component for this area
   *     children: [
   *       {
   *         // Uses HubMainAreaRoutesDefs.routes.route() to get the 'home' segment
   *         path: HubMainAreaRoutesDefs.routes.route('home'),
   *         loadComponent: () => import('path/to/home.component').then((m) => m.HubMainHomeComponent),
   *       },
   *       // ... other child routes
   *     ],
   *   },
   * ];
   * ```
   */
  static routes = {
    /**
     * Returns the route segment for a given child route or the base segment of this area
     * if no child route is provided.
     * @param route - Optional child route segment (e.g., 'home').
     * @returns The child route segment or the base route segment for this area (e.g., 'main').
     */
    route: (route?: CHILD_ROUTE) => route ?? this.BASE,
    // account: AuthTeamsRouteDefs.routes,
  };

  //- - - - - - - - - - - - - - - - - - - - - - - //

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
    // account: AuthTeamsRouteDefs.fullPathFn(this.BASE),
  };

  //- - - - - - - - - - - - - - - - - - - - - - - //

  /**
   * Returns an object with functions to construct full paths, prefixed with a given parent route and the main area's base route.
   * This is useful for creating nested routes.
   * @param parentRoute - The parent route to prefix the paths with.
   * @returns An object with functions to generate full paths.
   */
  static fullPathFn = (parentRoute: string) => {
    const basePath = HubRouteUtility.Combine(parentRoute, this.BASE);
    return {
      /**
       * Returns the full path for a given child route, prefixed with the parent route and main area's base.
       * If no child route is provided, it returns the combined parent and main area base path.
       * @param route - Optional child route.
       * @returns The full path.
       */
      route: (route?: CHILD_ROUTE) => HubRouteUtility.Combine(basePath, route),
      // account: AuthTeamsRouteDefs.fullPathFn(basePath),
    };
  };

  //- - - - - - - - - - - - - - - - - - - - - - - //
} //Cls

//#################################################//
