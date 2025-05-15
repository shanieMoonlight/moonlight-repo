import { RouteUtility } from '@sb-hub/shared-utils/routes';

//#################################################//

/** Base route for the main application area. */
const BaseRoute = 'product-admin';

/** Type alias for the child routes of the main application area: 'home' | 'open-source'. */
type CHILD_ROUTE = 'home' | 'new-product' | 'categories';

//#################################################//

/**
 * Defines routes for the main area of the Hub application.
 */
export class ProductAdminSectionRoutesDefs {

    /** Base route path for the main area (e.g., 'main'). */
    public static readonly BASE = BaseRoute;


    /**
     * Returns the provided route segment.
     * Primarily for use in this area's Angular route configuration.
     * @param route - The route segment (e.g., 'home', 'open-source', or 'main' itself).
     * @returns The route segment.
     */
    static route = (route?: CHILD_ROUTE) => route ?? ProductAdminSectionRoutesDefs.BASE;


    //- - - - - - - - - - - - - - - - - - -//

    
    /**
     * Access to relative route segments for this area and its child sections/areas.
   * @returns The last route segment.
     */
    static routes = {
        route: ProductAdminSectionRoutesDefs.route,
        // Child sections go here....
    };


    /**
     * Factory for creating full path functions for this area and its children, prefixed by `parentRoute`.
     * @param parentRoute - The parent route to prefix paths with.
     */
    static fullPathFn = (parentRoute: string) => {
        const basePath = RouteUtility.Combine(parentRoute, ProductAdminSectionRoutesDefs.BASE);
        return {
            route: (route?: CHILD_ROUTE) => RouteUtility.Combine(basePath, route),
            // Child sections go here....
        };
    };

} //Cls

