import { HubMainAreaRoutesDefs } from '@sb-hub/sections-main/route-defs';
import { HubBlogSectionRoutesDefs } from '@sb-hub/sections-blog/route-defs';

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

} //Cls
