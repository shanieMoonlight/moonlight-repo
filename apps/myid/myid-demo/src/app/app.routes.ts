import { Route } from '@angular/router';
import { AppRouteDefs } from './app-route-defs';


export const appRoutes: Route[] = [
  // {
  //   path: AppRouteDefs.routes.api.route(),
  //   loadChildren: () => import('./sections/api/api.routes').then((m) => m.apiRoutes)
  // },
  {
    path: AppRouteDefs.routes.main.route(),
    loadChildren: () => import('./sections/main/main.routes').then((m) => m.mainRoutes),
  },
  {
    path: '',
    redirectTo: AppRouteDefs.routes.main.route(),
    pathMatch: 'full',
  },
  {
    path: '**',
    loadComponent: () => import('./shared/features/not-found.component').then((m) => m.NotFoundComponent),
    pathMatch: 'full',
  }
];
