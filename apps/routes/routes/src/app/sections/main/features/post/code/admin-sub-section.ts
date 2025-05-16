export const AdminSubSetionRouteDefsCode = {

  subsectionTs: `//#################################################//

/** Base route for the admin application area. */
const BaseRoute = 'admin';

/** Type alias for the child routes of the admin application area: 'home' | 'dashboard'. */
type CHILD_ROUTE =
  | 'home'
  | 'dashboard'
  | 'users'
  | 'reports'
  | 'settings'
  | 'content';

//#################################################//

/**
 * Defines routes for the Admin area of the Hub application.
 */
export class AdminSectionRoutesDefs {

  public static readonly BASE = BaseRoute;

  static route = (route?: CHILD_ROUTE) => route ?? AdminSectionRoutesDefs.BASE;

  //- - - - - - - - - - - - - -//

  static routes = {
    route: AdminSectionRoutesDefs.route,
    products: ProductAdminSectionRoutesDefs.routes,
  };
  
  static fullPathFn(parentRoute: string) {
    const basePath = RouteUtility.combine(parentRoute, AdminSectionRoutesDefs.BASE);
    return {
      route: (route?: CHILD_ROUTE) => RouteUtility.combine(basePath, route),
      products: ProductAdminSectionRoutesDefs.fullPathFn(basePath),
    };
  }

} `


}
