import { Route } from '@angular/router';
import { HubMainAreaRoutesDefs } from '@sb-hub/sections-main/route-defs';
import { routeBuilderChildren } from '@spider-baby/utils-routes/builder';
import { HubMainComponent } from '../main.component';

export const MAIN_ROUTES: Route[] = [
  {
    path: '',
    component: HubMainComponent,
    providers: [
    ],
    children: [
      {
        path: HubMainAreaRoutesDefs.route('tester'),
        loadComponent: () => import('@sb-hub/sections-main/features-tester')
          .then((m) => m.HubMainTesterComponent),
      },
      {
        path: HubMainAreaRoutesDefs.route('open-source'),
        loadComponent: () => import('@sb-hub/sections-main/features/open-source')
          .then((m) => m.HubOpenSourceDemosComponent),
      },
      // This route is the default route for the product-admin area 
      // We want the base/entry route to be '' so that routing will happen relative to HubBlogSectionRoutesDefs.BASE not 'home'
      {
        path: '',
        loadComponent: () => import('@sb-hub/sections-main/features/home')
          .then((m) => m.HubMainHomeComponent),
      },
      // This route redirects the 'home' route to ''.
      // We want the base/entry route to be '' so that routing will happen relative to HubBlogSectionRoutesDefs.BASE not 'home'
      {
        path: HubMainAreaRoutesDefs.route('home'),
        redirectTo: '',
        pathMatch: 'full',
      },
      {
        path: '',
        redirectTo: HubMainAreaRoutesDefs.route('home'),
        pathMatch: 'full', // Add pathMatch: 'full' for empty path redirects
      },
      {
        path: '**',
        loadComponent: () =>
          import('@sb-hub/shared-features/not-found').then(
            (m) => m.NotFoundComponent
          ),
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
