import { Route } from '@angular/router';
import { HubMainRoutes } from '@sb-hub/sections-main/entry-point';
import { HubBlogRoutes } from '@sb-hub/sections-blog/entry-point';
import { HubMainAreaRoutesDefs } from '@sb-hub/sections-main/route-defs';

export const appRoutes: Route[] = [
  ...HubMainRoutes(),
  ...HubBlogRoutes(),
  //..more section to come
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
