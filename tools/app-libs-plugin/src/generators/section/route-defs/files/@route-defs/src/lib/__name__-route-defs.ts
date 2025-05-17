import { RouteUtility } from '@spider-baby/utils-routes';

//#################################################//

/** Base route for the <%= name %> application area. */
const BaseRoute = '<%= name %>';

/** Type alias for the child routes of the <%= name %> application area: 'home'. */
type CHILD_ROUTE = 'home' ;

//#################################################//

/**
 * Defines routes for the <%= name %> area of the Hub application.
 */
export class <%= classNamePrefix %><%= className %>SectionRoutesDefs {
  
  /** Base route path for the <%= name %> area (e.g., '<%= name %>'). */
  public static readonly BASE = BaseRoute;

  //- - - - - - - - - - - - - - - - - - -//

  /**
   * Returns the provided route segment.
   * Primarily for use in this area's Angular route configuration.
   * @param route - The route segment (e.g., 'home', or '<%= name %>' itself).
   * @returns The route segment.
   */
  static route = (route: CHILD_ROUTE) => route ?? <%= classNamePrefix %><%= className %>SectionRoutesDefs.BASE

  //- - - - - - - - - - - - - - - - - - -//

  /**
   * Access to relative route segments for this area and its children (e.g., admin).
   */
  static routes = {
    /**
     * Returns the child route segment or the base segment of this <%= name %> area.
     * @param route - Optional child route segment (e.g., 'home').
     * @returns Child route segment or `<%= classNamePrefix %><%= className %>SectionRoutesDefs.BASE`.
     */
    route: (route?: CHILD_ROUTE) => route ?? <%= classNamePrefix %><%= className %>SectionRoutesDefs.BASE
    /** Relative routes for the 'admin' area, nested under '<%= name %>'. */
    // childSection: ChildSectionRoutesDefs.routes,
  };

  //- - - - - - - - - - - - - - - - - - -//
  /**
   * Factory for creating full path functions for this area and its children, prefixed by `parentRoute`.
   * @param parentRoute - The parent route to prefix paths with.
   */
  static fullPathFn = (parentRoute: string) => {
    const basePath = RouteUtility.combine(parentRoute, <%= classNamePrefix %><%= className %>SectionRoutesDefs.BASE);
    return {
      /**
       * Returns the full path for a child route, or the base path of this <%= name %> area, prefixed by `parentRoute`.
       * @param route - Optional child route segment.
       * @returns Full path.
       */
      route: (route?: CHILD_ROUTE) => RouteUtility.combine(basePath, route),
      // childSection: ChildSectionRoutesDefs.fullPathFn(basePath),
    };
  };
} //Cls
