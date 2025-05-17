import { Route } from '@angular/router';
import { <%= classNamePrefix %><%= className %>SectionRoutesDefs } from '@<%= prefix %>/sections-<%= name %>/route-defs';
import { routeBuilderChildren } from '@spider-baby/utils-routes/builder';
import { <%= classNamePrefix %><%= className %>Component } from '../<%= name %>.component';

export const <%= name %>Routes: Route[] = [
  {
    path: '',
    component: <%= classNamePrefix %><%= className %>Component,
    children: [
      // This route is the default route for the product-admin area 
      // We want the base/entry route to be '' so that routing will happen relative to <%= classNamePrefix %><%= className %>SectionRoutesDefs.BASE not 'home'
      {
        path: '',
        loadComponent: () => import('@<%= prefix %>/sections-<%= name %>/features-home').then((m) => m.<%= classNamePrefix %><%= className %>HomeComponent),
      },
      // This route redirects the 'home' route to ''.
      // We want the base/entry route to be '' so that routing will happen relative to <%= classNamePrefix %><%= className %>SectionRoutesDefs.BASE not 'home'
      {
        path: <%= classNamePrefix %><%= className %>SectionRoutesDefs.route('home'),
        redirectTo: '',
        pathMatch: 'full',
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
  () => <%= name %>Routes
);

//#################################################//
