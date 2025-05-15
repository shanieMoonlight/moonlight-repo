import { Route } from '@angular/router';
import { ProductAdminComponent } from './product-admin.component';
import { ProductAdminSectionRoutesDefs } from './product-admin-route-defs';

export const prodAdminRoutes: Route[] = [
  {
    path: '',
    component: ProductAdminComponent,
    children: [
      {
        path: ProductAdminSectionRoutesDefs.routes.route('categories'),
        loadComponent: () => import('./features/categories/categories.component').then((m) => m.ProductAdminCategoriesComponent),
      },
      {
        path: ProductAdminSectionRoutesDefs.routes.route('new-product'),
        loadComponent: () => import('./features/new-product/new-product.component').then((m) => m.ProductAdminNewProductComponent),
      },
      // This route is the default route for the product-admin area 
      // We want the base/entry route to be '' so that routing will happen relative to ProductAdminSectionRoutesDefs.BASE not 'home'
      {
        path: '',
        loadComponent: () => import('./features/home/home.component').then((m) => m.ProductAdminHomeComponent),
      },
      // This route redirects the 'home' route to ''.
      // We want the base/entry route to be '' so that routing will happen relative to ProductAdminSectionRoutesDefs.BASE not 'home'
      {
        path: ProductAdminSectionRoutesDefs.routes.route('home'),
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
];
