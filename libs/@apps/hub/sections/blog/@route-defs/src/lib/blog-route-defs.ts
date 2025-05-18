import { RouteUtility } from '@spider-baby/utils-routes';

//#################################################//

/** Base route for the blog application area. */
const BaseRoute = 'blog';

/** Type alias for the child routes of the blog application area: 'home'. */
type CHILD_ROUTE = 'home'|'route-defs-tutorial';

//#################################################//

/**
 * Defines routes for the blog area of the Hub application.
 */
export class HubBlogSectionRoutesDefs {
  /** Base route path for the blog area (e.g., 'blog'). */
  public static readonly BASE = BaseRoute;

  //- - - - - - - - - - - - - - - - - - -//

  /**
   * Returns the provided route segment.
   * Primarily for use in this area's Angular route configuration.
   * @param route - The route segment (e.g., 'home', or 'blog' itself).
   * @returns The route segment.
   */
  static route = (route: CHILD_ROUTE) => route ?? HubBlogSectionRoutesDefs.BASE;

  //- - - - - - - - - - - - - - - - - - -//

  /**
   * Access to relative route segments for this area and its children (e.g., admin).
   */
  static routes = {
    /**
     * Returns the child route segment or the base segment of this blog area.
     * @param route - Optional child route segment (e.g., 'home').
     * @returns Child route segment or `HubBlogSectionRoutesDefs.BASE`.
     */
    route: (route?: CHILD_ROUTE) => route ?? HubBlogSectionRoutesDefs.BASE,
    /** Relative routes for the 'admin' area, nested under 'blog'. */
    // childSection: ChildSectionRoutesDefs.routes,
  };

  //- - - - - - - - - - - - - - - - - - -//
  /**
   * Factory for creating full path functions for this area and its children, prefixed by `parentRoute`.
   * @param parentRoute - The parent route to prefix paths with.
   */
  static fullPathFn = (parentRoute: string) => {
    const basePath = RouteUtility.combine(
      parentRoute,
      HubBlogSectionRoutesDefs.BASE
    );
    return {
      /**
       * Returns the full path for a child route, or the base path of this blog area, prefixed by `parentRoute`.
       * @param route - Optional child route segment.
       * @returns Full path.
       */
      route: (route?: CHILD_ROUTE) => RouteUtility.combine(basePath, route),
      // childSection: ChildSectionRoutesDefs.fullPathFn(basePath),
    };
  };
} //Cls
