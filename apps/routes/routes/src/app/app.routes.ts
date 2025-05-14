import { Route } from '@angular/router';
import { AppRouteDefs } from './app-route-defs';

export const appRoutes: Route[] = [
  {
    path: AppRouteDefs.routes.admin.route(),
    loadChildren: () => import('./sections/admin/admin.routes').then((m) => m.adminRoutes),
  },
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
  },
];
