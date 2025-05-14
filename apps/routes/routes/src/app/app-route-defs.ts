

//#################################################//

import { AdminSectionRoutesDefs } from "./sections/admin/admin-route-defs";
import { MainSectionRoutesDefs } from "./sections/main/main-route-defs";

/** Base route for the main application area. */
const BaseRoute = '';

//No Child routes.  We only point to sub sections of the app (nested routes).

//#################################################//

/**
 * Defines application-level routes for the Hub application.
 * Centralizes base route definitions and provides structured access to major sections.
 * See `apps/hub/rd-hub/@docs/route-defs-pattern.md` for details.
 */
export class AppRouteDefs {
    /** Base path for the application (typically empty string for root). */
    static readonly BASE = BaseRoute;

    //----------------------------//

    /**
     * Access to relative route segments for descendant areas.
     * See `apps/hub/rd-hub/@docs/route-defs-pattern.md`.
     */
    static routes = {
        /** Relative routes for the 'main' application area. */
        main: MainSectionRoutesDefs.routes,
        admin: AdminSectionRoutesDefs.routes,
    };

    //- - - - - - - - - - - - - - - - - - -//

    /**
     * Access to full, absolute route paths from the application root.
     * See `apps/hub/rd-hub/@docs/route-defs-pattern.md`.
     */
    static fullPaths = {
        /** Full paths for the 'main' application area. */
        main: MainSectionRoutesDefs.fullPathFn(this.BASE),
        admin: AdminSectionRoutesDefs.fullPathFn(this.BASE),
    };

} //Cls
