import { Route } from '@angular/router';
import { MainComponent } from './main.component';
import { MainSectionRoutesDefs } from './main-route-defs';

export const mainRoutes: Route[] = [
  {
    path: '',
    component: MainComponent,
    children: [
      {
        path: MainSectionRoutesDefs.routes.route('about'),
        loadComponent: () => import('./features/about/about.component').then((m) => m.MainAboutComponent),
      },
      {
        path: MainSectionRoutesDefs.routes.route('contact'),
        loadComponent: () => import('./features/contact/contact.component').then((m) => m.MainContactComponent),
      },
      {
        path: MainSectionRoutesDefs.routes.route('products'),
        loadComponent: () => import('./features/products/products.component').then((m) => m.MainProductsComponent),
      },      
      {
        path: MainSectionRoutesDefs.routes.route('categories'),
        loadComponent: () => import('./features/categories/categories.component').then((m) => m.MainCategoriesComponent),
      },
      // This route is the default route for the product-admin area 
      //We want the base/entry route to be '' so that routing will happen relative to MainSectionRoutesDefs.BASE not 'home'
      {
        path: '',
        loadComponent: () => import('./features/home/home.component').then((m) => m.MainHomeComponent),
      },
      // This route redirects the 'home' route to ''.
      // We want the base/entry route to be '' so that routing will happen relative to MainSectionRoutesDefs.BASE not 'home'
      {
        path: MainSectionRoutesDefs.routes.route('home'),
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
