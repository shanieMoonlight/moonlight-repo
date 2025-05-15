import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatEverythingModule } from '@spider-baby/material-theming/utils';
import { HighlightModule } from 'ngx-highlightjs';
import { AppRouteDefs } from '../../../../app-route-defs';
console.log(AppRouteDefs.routes.admin.products.route('new-product'));

@Component({
  selector: 'rd-route-architecture',
  templateUrl: './route-architecture.component.html',
  styleUrls: ['./route-architecture.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    HighlightModule,
    MatEverythingModule
  ],
})
export class RouteArchitectureComponent {
  
  getAppRouteDefs(): string {
    return `export class AppRouteDefs {
  /** Base path for the application (typically empty string for root). */
  static readonly BASE = '';

  /**
   * Access to relative route segments for descendant areas.
   */
  static routes = {
    main: MainSectionRoutesDefs.routes,
    admin: AdminSectionRoutesDefs.routes,
  };

  /**
   * Access to full, absolute route paths from the application root.
   * Use for routing relative to base
   */
  static fullPaths = {
    main: MainSectionRoutesDefs.fullPathFn(this.BASE),
    admin: AdminSectionRoutesDefs.fullPathFn(this.BASE),
  };

  /**
   * Access to full, absolute route paths from the application root.
   * Will prepend a leading slash to the path. Use for routing relative to base
   */
  static fullPathsWithSlash = wrapWithLeadingSlash(AppRouteDefs.fullPaths); //Description of wrapWithLeadingSlash function below
}`;
  }

  getAdminRouteDefs(): string {
    return `//#################################################//

/** Base route for the admin application area. */
const BaseRoute = 'admin';

/** Type alias for the child routes of the admin application area: 'home' | 'dashboard'. */
type CHILD_ROUTE = 'home' | 'dashboard' | 'users' | 'reports' | 'settings' | 'content';
// CHILD_ROUTE will allow us to use the route in the IDE and use intellisense to get auto-completion.
//When you add a new route to the admin area, you can add it here and it will be available in the IDE. 
//Nothing else needs to change.

//#################################################//
    
    
    export class AdminSectionRoutesDefs {
  /** Base route path for the admin area (e.g., 'admin'). */
  public static readonly BASE = 'admin';

  /**
   * Returns the provided route segment.
   * Primarily for use in this area's Angular route configuration.
   */
  static route = (route?: CHILD_ROUTE) => route ?? AdminSectionRoutesDefs.BASE

  /**
   * Access to relative route segments for this area and its child sections/areas.
   * Will be used by parent routeDefs
   */
  static routes = {
    route: (route?: CHILD_ROUTE) => route ?? AdminSectionRoutesDefs.BASE,
    products: ProductAdminSectionRoutesDefs.routes,
  };

  /**
   * Factory for creating full path functions for this area and its children.
   * This will be used by parent routeDefs
   * @param parentRoute - The parent route to prefix paths with.
   */
  static fullPathFn = (parentRoute: string) => {
    const basePath = RouteUtility.Combine(parentRoute, AdminSectionRoutesDefs.BASE);
    return {
      route: (route?: CHILD_ROUTE) => RouteUtility.Combine(basePath, route),
      products: ProductAdminSectionRoutesDefs.fullPathFn(basePath),
    }
  }
}`;
  }

  getProductAdminRouteDefs(): string {
    return `//#################################################//

/** Base route for the main application area. */
const BaseRoute = 'product-admin';

/** Type alias for the child routes of the main application area: 'home' | 'open-source'. */
type CHILD_ROUTE = 'home' | 'new-product' | 'categories';
// CHILD_ROUTE will allow us to use the route in the IDE and use intellisense to get auto-completion.
// When you add a new route to the admin area, you can add it here and it will be available in the IDE. 
// Nothing else needs to change.

//#################################################//


export class ProductAdminSectionRoutesDefs {
  /** Base route path for the product-admin area */
  public static readonly BASE = 'product-admin';

  /**
   * Returns the provided route segment.
   * @param route - The route segment or the base route if not provided.
   */
  static route = (route?: CHILD_ROUTE) => route ?? ProductAdminSectionRoutesDefs.BASE;

  /**
   * Access to relative route segments for this area and its child sections/areas.
   */
  static routes = {
    route: (route?: CHILD_ROUTE) => route ?? ProductAdminSectionRoutesDefs.BASE,
    // Child sections would go here...
  };

  /**
   * Factory for creating full path functions for this area and its children.
   * @param parentRoute - The parent route to prefix paths with.
   */
  static fullPathFn = (parentRoute: string) => {
    const basePath = RouteUtility.Combine(parentRoute, ProductAdminSectionRoutesDefs.BASE);
    return {
      route: (route?: CHILD_ROUTE) => RouteUtility.Combine(basePath, route),
      // Child sections would go here...
    };
  };
}`;
  }

  getMainRoutes(): string {
    return `export const mainRoutes: Route[] = [
  {
    path: '',
    component: MainComponent,
    children: [
      {
        path: MainSectionRoutesDefs.routes.route('about'),
        loadComponent: () => import('./features/about/about.component')
          .then((m) => m.MainAboutComponent),
      },
      {
        path: MainSectionRoutesDefs.routes.route('contact'),
        loadComponent: () => import('./features/contact/contact.component')
          .then((m) => m.MainContactComponent),
      },
      // Default route pattern
      {
        path: '',
        loadComponent: () => import('./features/home/home.component')
          .then((m) => m.MainHomeComponent),
      },
      // Redirect 'home' to the default route ('')
      {
        path: MainSectionRoutesDefs.routes.route('home'),
        redirectTo: '',
        pathMatch: 'full',
      },
    ],
  },
];`;
  }

  getWrapWithLeadingSlash(): string {
    return `function wrapWithLeadingSlash<T>(fullPathsObj: T): T {
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
}`;
  }

  getRouteUsageExamples(): string {
    return `// Basic route segment. Use when nvaigating form MainSection base or home
const aboutRoute = MainSectionRoutesDefs.routes.route('about');
// Result: "about"

// Full path from app root
const adminUsersPath = AppRouteDefs.fullPaths.admin.route('users');
// Result: "admin/users"

// Full path with leading slash.  Use to navigate from anywhere in the app relative to the base
const productsPathWithSlash = AppRouteDefs.fullPathsWithSlash.main.route('products');
// Result: "/main/products"

// Nested route full path (Product Admin within Admin)
const newProductPath = AppRouteDefs.fullPaths.admin.products.route('new-product');
// Result: "admin/product-admin/new-product"

// Nested route (Product Admin within Admin). Use to to display the route in a tooltip or similar. (Gets the final segment in the path)
const newProductPath = AppRouteDefs.routes.admin.products.route('new-product');
// Result: new-product"`;

  }

  getDefaultRoutePattern(): string {
    return `// Default route pattern:
// 1. Empty path for default content
{
  path: '',
  loadComponent: () => import('./features/home/home.component')
    .then((m) => m.MainHomeComponent),
},
// 2. Redirect explicit 'home' route to the empty path
{
  path: MainSectionRoutesDefs.routes.route('home'),
  redirectTo: '',
  pathMatch: 'full',
},`;
  }
}