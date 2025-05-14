import { Route } from '@angular/router';
import { MainComponent } from './main.component';
import { MainSectionRoutesDefs } from './main-route-defs';

export const mainRoutes: Route[] = [
  {
    path: '',
    component: MainComponent,
    children: [
      {
        path: MainSectionRoutesDefs.routes.route('home'),
        loadComponent: () => import('./features/home/home.component').then((m) => m.MainHomeComponent),
      },
      {
        path: MainSectionRoutesDefs.routes.route('about'),
        loadComponent: () => import('./features/about/about.component').then((m) => m.AboutComponent),
      },
      {
        path: MainSectionRoutesDefs.routes.route('contact'),
        loadComponent: () => import('./features/contact/contact.component').then((m) => m.ContactComponent),
      },
      {
        path: MainSectionRoutesDefs.routes.route('products'),
        loadComponent: () => import('./features/products/products.component').then((m) => m.MainProductsComponent),
      },
      {
        path: '',
        loadComponent: () => import('./features/home/home.component').then((m) => m.MainHomeComponent),
      },
      {
        path: '**',
        loadComponent: () => import('../../shared/features/not-found.component').then((m) => m.NotFoundComponent),
        pathMatch: 'full',
      },
    ],
  },
];
