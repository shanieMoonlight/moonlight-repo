import { Route } from '@angular/router';
import { HubMainRoutes } from '@sb-hub/sections-main/entry-point';
import { HubMainAreaRoutesDefs } from '@sb-hub/sections-main/route-defs';

export const appRoutes: Route[] = [
  {
    path: 'api',
    loadChildren: () => import('./sections/api/api.routes').then((m) => m.apiRoutes),
  },
  // {
  //   path: '',
  //   loadChildren: () => import('./sections/main/main.routes').then((m) => m.mainRoutes),
  // },
  ...HubMainRoutes(),

  {
    path: '',
    redirectTo: HubMainAreaRoutesDefs.BASE, // Change loadComponent to redirectTo
    pathMatch: 'full',
  },
  {
    path: '**',
    loadComponent: () =>
      import('@sb-hub/shared-features/not-found').then((m) => m.NotFoundComponent),
    pathMatch: 'full',
  },
];
