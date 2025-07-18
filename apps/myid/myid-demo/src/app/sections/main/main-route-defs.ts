import { MyIdAccountSectionRoutesDefs } from '@spider-baby/myid-auth/routes';
import { RouteUtility } from '@spider-baby/utils-routes';
// import { AccountSectionRoutesDefs } from '../accounts/account-route-defs';

//#################################################//

/** Base route for the Main application area. */
const BaseRoute = '';

/** Type alias for the child routes of the main application area: 'home' | 'about'. */
type CHILD_ROUTE =
  | 'home'
  | 'auth-test'
  | 'auth-test-firebase'
  | 'auth-test-user-mgr-admin'
  | 'scratchpad'

//#################################################//

/**
 * Defines routes for the main area of the Hub application.
 */
export class MainSectionRoutesDefs {
  /** Base route path for the main area (e.g., 'main'). */
  public static readonly BASE = BaseRoute;

  /**
   * Returns the provided route segment.
   * Primarily for use in this area's Angular route configuration.
   * @param route - The route segment (e.g., 'home', 'about', or 'main' itself).
   * @returns The route segment.
   */
  static route = (route?: CHILD_ROUTE) => route ?? MainSectionRoutesDefs.BASE;

  //- - - - - - - - - - - - - - - - - - -//

  /**
   * Access to relative route segments for this area and its children 
   * Will be used by parent routeDefs
   * @returns The last route segment.
   */
  static routes = {
    route: MainSectionRoutesDefs.route,
    account: MyIdAccountSectionRoutesDefs.routes
  };

  /**
   * Factory for creating full path functions for this area and its children, prefixed by `parentRoute`.
   * @param parentRoute - The parent route to prefix paths with.
   * @returns The the full path from parentRoute.
   */
  static fullPathFn = (parentRoute: string) => {
    const basePath = RouteUtility.combine(
      parentRoute,
      MainSectionRoutesDefs.BASE
    );
    return {
      route: (route?: CHILD_ROUTE) => RouteUtility.combine(basePath, route),
      account: MyIdAccountSectionRoutesDefs.fullPathFn(basePath)
    };
  };
} //Cls
