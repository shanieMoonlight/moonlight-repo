import { Route } from '@angular/router';
import { <%= classNamePrefix %><%= className %>SectionRoutesDefs } from '@<%= prefix %>/sections-<%= name %>/route-defs';
import { routeBuilderChildren } from '@spider-baby/utils-routes/builder';
import { <%= classNamePrefix %><%= className %>Component } from '../<%= name %>.component';

export const MAIN_ROUTES: Route[] = [
  {
    path: '',
    component: <%= classNamePrefix %><%= className %>Component,
    children: [
      {
        path: <%= classNamePrefix %><%= className %>AreaRoutesDefs.route('home'),
        loadComponent: () =>
          import('@<%= prefix %>/sections-<%= name %>/features/home').then(
            (m) => m.<%= classNamePrefix %><%= className %>HomeComponent
          ),
      },
      {
        path: '**',
        loadComponent: () =>
          import('@<%= prefix %>/shared-features/not-found').then(
            (m) => m.NotFoundComponent
          ),
        pathMatch: 'full',
      },
    ],
  },
];

//#################################################//

export const <%= classNamePrefix %><%= className %>Routes = routeBuilderChildren(
  `${<%= classNamePrefix %><%= className %>SectionRoutesDefs.BASE}`,
  () => MAIN_ROUTES
);

//#################################################//
