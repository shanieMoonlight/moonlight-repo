import { HubMainAreaRoutesDefs } from '@sb-hub/sections-main/route-defs';
import { HubRouteUtility } from '@sb-hub/shared-utils/routes';

//#################################################//

const BaseRoute = '';
const ChildRoutes = ['login', 'main', 'not-found'] as const;

/** @ignore Type alias for the child routes of the application. */
type CHILD_ROUTE = (typeof ChildRoutes)[number];
type ROUTE = typeof BaseRoute | CHILD_ROUTE;

//#################################################//

/**
 * Defines and provides utilities for constructing application-level route paths for the Hub application.
 *
 * This class centralizes the base route definitions for the entire application and provides
 * structured access to route definitions of major application sections (like 'main').
 * It aims to prevent the use of magic strings for routes and improve maintainability.
 */
export class HubAppRouteDefs {
  /**
   * The base path for the application. Typically an empty string for the root.
   * @readonly
   */
  // public static readonly ID_PARAM = '/:id'
  static readonly BASE = BaseRoute;

  //----------------------------//

  /**
   * Provides access to the full path functions for the 'main' application area.
   * This is initialized with the application's base path, allowing the 'main' area
   * to construct its full paths relative to the application root.
   *
   * @example
   * HubAppRouteDefs.main.route() // -> 'main'
   * HubAppRouteDefs.main.route('home') // -> 'main/home'
   */
  static main = HubMainAreaRoutesDefs.fullPathFn(this.BASE);

  //-------------------------------------//

  /**
   * Provides methods to get relative route segments for the application's immediate children or base.
   */
  static routes = {
    /**
     * Returns the path for a direct child route of the application root, or the base path if no route is specified.
     * Since `ChildRoutes` is currently empty, this will typically return the `BASE` path.
     * @param route - An optional child route segment.
     * @returns The route segment string.
     */
    path: (route?: CHILD_ROUTE) => route ?? this.BASE,
    /**
     * Provides access to the relative route definitions for the 'main' application area.
     * Useful for defining routes within the 'main' section itself, relative to its own base.
     *
     * @example
     * HubAppRouteDefs.routes.main.path() // -> 'main' (base of main area)
     * HubAppRouteDefs.routes.main.path('home') // -> 'home' (relative to main area base)
     */
    main: HubMainAreaRoutesDefs.routes,
  };

  //- - - - - - - - - - - - - - - - - - -//

  /**
   * Provides methods to get full, absolute route paths from the application root.
   */
  static fullPaths = {
    /**
     * Constructs a full path from the application root to a direct child route.
     * If no route is specified, it returns the application's base path.
     * @param route - An optional child route segment.
     * @returns The full absolute path string.
     * @example
     * HubAppRouteDefs.fullPaths.route() // -> '' (or your application base path)
     */
    route: (route?: CHILD_ROUTE) => HubRouteUtility.Combine(this.BASE, route),
    /**
     * Provides access to the full path functions for the 'main' application area, ensuring paths are absolute from the app root.
     * This is equivalent to `HubAppRouteDefs.main`.
     *
     * @example
     * HubAppRouteDefs.fullPaths.main.route() // -> 'main'
     * HubAppRouteDefs.fullPaths.main.route('home') // -> 'main/home'
     */
    main: HubMainAreaRoutesDefs.fullPathFn(this.BASE),
  };

  //- - - - - - - - - - - - - - - - - - -//
} //Cls
