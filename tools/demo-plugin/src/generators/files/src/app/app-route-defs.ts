import { ApiSectionRoutesDefs } from "./sections/api/api-route-defs";
import { MainSectionRoutesDefs } from "./sections/main/main-route-defs";


//#################################################//

function wrapWithLeadingSlash<T>(fullPathsObj: T): T {

    if (typeof fullPathsObj === 'function') {
        return ((...args: any[]) => {
            const path = (fullPathsObj as any)(...args);
            return typeof path === 'string' && !path.startsWith('/') ? '/' + path : path;
        }) as any as T;
    }

    if (!fullPathsObj)
        return fullPathsObj;

    const wrapped: any = Array.isArray(fullPathsObj) ? [] : {};
    for (const key of Object.keys(fullPathsObj)) {
        wrapped[key] = wrapWithLeadingSlash((fullPathsObj as any)[key]);
    }

    return wrapped;
}

//#################################################//

/** Base route for the Entry-Point application area. */
const BaseRoute = '';

//No Child routes.  We only point to sub sections of the app (nested routes).

//#################################################//

/**
 * Defines application-level routes for the Hub application.
 * Centralizes base route definitions and provides structured access to major sections.
 */
export class AppRouteDefs {
    /** Base path for the application (typically empty string for root). */
    static readonly BASE = BaseRoute;

    //uncomment if you have direct child routes in the app base (rather than sub sections)
    //static route = (route?: CHILD_ROUTE) => route ?? ApiSectionRoutesDefs.BASE;

    /**
     * Access to relative route segments for descendant areas.
     */
    static routes = {
        main: MainSectionRoutesDefs.routes,
        api: ApiSectionRoutesDefs.routes,
    };

    //- - - - - - - - - - - - - -//

    /**
     * Access to full, absolute route paths from the application root.
     * Use for routing relative to base
     */
    static fullPaths = {
        main: MainSectionRoutesDefs.fullPathFn(this.BASE),
        api: ApiSectionRoutesDefs.fullPathFn(this.BASE),
    };


    /**
     * Access to full, absolute route paths from the application root.
     * Will prepend a leading slash to the path. Use for routing relative to base
     */
    static fullPathsWithSlash = wrapWithLeadingSlash(AppRouteDefs.fullPaths);


} //Cls
