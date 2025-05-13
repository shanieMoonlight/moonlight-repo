import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  // {
  //   path: 'api',
  //   loadChildren: () =>
  //     import('./sections/api/api.routes').then((m) => m.apiRoutes),
  // },
  {
    path: '',
    loadChildren: () => import('./sections/main/main.routes').then((m) => m.mainRoutes),
  },
  {
    path: '**',
    loadComponent: () => import('@sb-hub/shared-features/not-found').then((m) => m.NotFoundComponent),
    pathMatch: 'full',
  },
];
