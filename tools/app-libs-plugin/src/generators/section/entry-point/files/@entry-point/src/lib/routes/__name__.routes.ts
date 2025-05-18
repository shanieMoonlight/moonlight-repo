import { Route } from '@angular/router';
import { <%= sectionClassNamePrefix %>SectionRoutesDefs } from '@<%= prefix %>/sections-<%= name %>/route-defs';
import { routeBuilderChildren } from '@spider-baby/utils-routes/builder';
import { <%= sectionClassNamePrefix %>Component } from '../<%= name %>.component';

export const <%= name %>Routes: Route[] = [
  {
    path: '',
    component: <%= sectionClassNamePrefix %>Component,
    children: [
      // This route is the default route for the product-admin area 
      // We want the base/entry route to be '' so that routing will happen relative to <%= sectionClassNamePrefix %>SectionRoutesDefs.BASE not 'home'
      {
        path: '',
        loadComponent: () => import('@<%= prefix %>/sections-<%= name %>/features-home').then((m) => m.<%= sectionClassNamePrefix %>HomeComponent),
      },
      // This route redirects the 'home' route to ''.
      // We want the base/entry route to be '' so that routing will happen relative to <%= sectionClassNamePrefix %>SectionRoutesDefs.BASE not 'home'
      {
        path: <%= sectionClassNamePrefix %>SectionRoutesDefs.route('home'),
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

export const <%= sectionClassNamePrefix %>Routes = routeBuilderChildren(
  `${<%= sectionClassNamePrefix %>SectionRoutesDefs.BASE}`,
  () => <%= name %>Routes
);

//#################################################//
