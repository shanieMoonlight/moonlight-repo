import { Route } from '@angular/router';
import { HubMainAreaRoutesDefs } from '@sb-hub/sections-main/route-defs';
import { routeBuilderChildren } from '@sb-hub/shared-utils/routes/builder';
import { HubMainComponent } from '../main.component';

export const MAIN_ROUTES: Route[] = [
  {
    path: '',
    component: HubMainComponent,
    children: [
      {
        path: HubMainAreaRoutesDefs.route('home'),
        loadComponent: () => import('@sb-hub/sections-main/features/home').then((m) => m.HubMainHomeComponent),
      },
      {
        path: HubMainAreaRoutesDefs.route('open-source'),
        loadComponent: () => import('@sb-hub/sections-main/features/open-source').then((m) => m.HubOpenSourceDemosComponent),
      },
      {
        path: '',
        redirectTo: HubMainAreaRoutesDefs.route('open-source'), 
        pathMatch: 'full', // Add pathMatch: 'full' for empty path redirects
      },
      {
        path: '**',
        loadComponent: () => import('@sb-hub/shared-features/not-found').then((m) => m.NotFoundComponent),
        pathMatch: 'full',
      },
    ],
  },
];

//#################################################//

export const HubMainRoutes = routeBuilderChildren(
  `${HubMainAreaRoutesDefs.BASE}`,
  () => MAIN_ROUTES
);

//#################################################//
