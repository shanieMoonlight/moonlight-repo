export const ProdAdminSubSetionRouteDefsCode = {

  subsectionTs: `//#################################################//

/** Base route for the product-admin application area. */
const BaseRoute = 'product-admin';

/** Type alias for the child routes of the product-admin application area: 'home' | 'new-product'| etc... */
type CHILD_ROUTE = 'home' | 'new-product' | 'categories';

//#################################################//

/**
 * Defines routes for the product-admin area of the Hub application.
 */
export class ProductAdminSectionRoutesDefs {
  /** Base route path for the product-admin area (e.g., 'product-admin'). */
  public static readonly BASE = BaseRoute;

  /**
   * Returns the provided route segment.
   * Primarily for use in this area's Angular route configuration.
   * @param route - The route segment (e.g., 'home', 'new-product', or 'product-admin' itself).
   * @returns The route segment.
   */
  static route = (route?: CHILD_ROUTE) =>
    route ?? ProductAdminSectionRoutesDefs.BASE;

  //- - - - - - - - - - - - - - - - - - -//

  /**
   * Access to relative route segments for this area and its child sections/areas.
   * @returns The last route segment.
   */
  static routes = {
    route: ProductAdminSectionRoutesDefs.route,
    // Child sub-sections go here....
  };

  /**
   * Factory for creating full path functions for this area and its children, prefixed by 'parentRoute'. (To be used by Parent RouteDefs file)
   * @param parentRoute - The parent route to prefix paths with.
   */
  static fullPathFn(parentRoute: string){
    const basePath = RouteUtility.combine(parentRoute, ProductAdminSectionRoutesDefs.BASE);
    return {
      route: (route?: CHILD_ROUTE) => RouteUtility.combine(basePath, route),
      // Child sub-sections go here....
    };
  }
}`,

typeDefintions: `/** Base route for the product-admin application area. */
const BaseRoute = 'product-admin';

/** Type alias for the child routes of the product-admin application area: 'home' | 'new-product'| etc... */
type CHILD_ROUTE = 'home' | 'new-product' | 'categories';`,

routeMethod: `static route = (route?: CHILD_ROUTE) =>
    route ?? ProductAdminSectionRoutesDefs.BASE;`,

routesObject: `static routes = {
    route: ProductAdminSectionRoutesDefs.route,
    // Child sections go here....
  }`,
fullPathFn: `static fullPathFn(parentRoute: string) {
    const basePath = RouteUtility.combine(parentRoute, ProductAdminSectionRoutesDefs.BASE);
    return {
      route: (route?: CHILD_ROUTE) => RouteUtility.combine(basePath, route),
      // Child sections go here....
    };
  }`,

usageInRoutesTs:`export const prodAdminRoutes: Route[] = [
  {
    path: '',
    component: ProductAdminComponent,
    children: [
      {
        path: ProductAdminSectionRoutesDefs.route('categories'),
        loadComponent: () => import('./features/categories/categories.component').then((m) => m.ProductAdminCategoriesComponent),
      },
      {
        path: ProductAdminSectionRoutesDefs.route('new-product'),
        loadComponent: () => import('./features/new-product/new-product.component').then((m) => m.ProductAdminNewProductComponent),
      },
      // More routes here...,

      // This route is the default route for the product-admin area 
      // We want the base/entry route to be '' so that routing will happen relative to ProductAdminSectionRoutesDefs.BASE not 'home'
      {
        path: '',
        loadComponent: () => import('./features/home/home.component').then((m) => m.ProductAdminHomeComponent),
      },
      // This route redirects the 'home' route to ''.
      // We want the base/entry route to be '' so that routing will happen relative to ProductAdminSectionRoutesDefs.BASE not 'home'
      {
        path: ProductAdminSectionRoutesDefs.route('home'),
        redirectTo: '',
        pathMatch: 'full',
      },
      {
        path: '**',
        loadComponent: () => import('../../shared/features/not-found.component').then((m) => m.NotFoundComponent),
        pathMatch: 'full',
      },
    ],
  },
];`



}
