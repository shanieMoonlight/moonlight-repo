import { Route } from '@angular/router';
import { HubBlogAreaRoutesDefs } from '@sb-hub/sections-blog/route-defs';
import { routeBuilderChildren } from '@spider-baby/utils-routes/builder';
import { HubBlogComponent } from '../blog.component';

export const MAIN_ROUTES: Route[] = [
  {
    path: '',
    component: HubBlogComponent,
    children: [
      {
        path: HubBlogAreaRoutesDefs.route('home'),
        loadComponent: () =>
          import('@sb-hub/sections-blog/features/home').then(
            (m) => m.HubBlogHomeComponent
          ),
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

export const HubBlogRoutes = routeBuilderChildren(
  `${HubBlogAreaRoutesDefs.BASE}`,
  () => MAIN_ROUTES
);

//#################################################//
