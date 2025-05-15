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
        loadComponent: () => import('./features/categories/categories.component').then((m) => m.ProductCategoriesComponent),
      },
      {
        path: ProductAdminSectionRoutesDefs.routes.route('new'),
        loadComponent: () => import('./features/new-product/new-product.component').then((m) => m.NewProductComponent),
      },
      {
        path: '',
        loadComponent: () => import('./features/home/home.component').then((m) => m.ProductAdminHomeComponent),
      },
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
