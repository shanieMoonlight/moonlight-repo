import { HubMainAreaRoutesDefs } from '@sb-hub/sections-main/route-defs';
import { HubBlogSectionRoutesDefs } from '@sb-hub/sections-blog/route-defs';

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

/** Base route for the main application area. */
const BaseRoute = '';

//No Child routes.  We only point to sub sections of the app (nested routes).

//#################################################//

/**
 * Defines application-level routes for the Hub application.
 * Centralizes base route definitions and provides structured access to major sections.
 * See `apps/hub/sb-hub/@docs/route-defs-pattern.md` for details.
 */
export class HubAppRouteDefs {
    /** Base path for the application (typically empty string for root). */
    static readonly BASE = BaseRoute;

    //----------------------------//

    /**
     * Access to relative route segments for descendant areas.
     * See `apps/hub/sb-hub/@docs/route-defs-pattern.md`.
     */
    static routes = {
        /** Relative routes for the 'main' application area. */
        main: HubMainAreaRoutesDefs.routes,
        blog: HubBlogSectionRoutesDefs.routes,
    };

    //- - - - - - - - - - - - - - - - //

    /**
     * Access to full, absolute route paths from the application root.
     * See `apps/hub/sb-hub/@docs/route-defs-pattern.md`.
     */
    static fullPaths = {
        /** Full paths for the 'main' application area. */
        main: HubMainAreaRoutesDefs.fullPathFn(this.BASE),
        blog: HubBlogSectionRoutesDefs.fullPathFn(this.BASE),
    };

    
    /**
     * Access to full, absolute route paths from the application root.
     * Will prepend a leading slash to the path. Use for routing relative to base
     */
    static fullPathsWithSlash = wrapWithLeadingSlash(HubAppRouteDefs.fullPaths);

} //Cls
