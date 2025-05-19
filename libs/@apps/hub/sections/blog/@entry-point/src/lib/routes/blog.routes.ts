import { Route } from '@angular/router';
import { HubBlogSectionRoutesDefs } from '@sb-hub/sections-blog/route-defs';
import { routeBuilderChildren } from '@spider-baby/utils-routes/builder';
import { HubBlogComponent } from '../blog.component';

export const blogRoutes: Route[] = [
  {
    path: '',
    component: HubBlogComponent,
    children: [
      {
      path: HubBlogSectionRoutesDefs.route('hash'),
      loadComponent: () => import('@sb-hub/sections-blog/features-hash')
        .then((m) => m.HubBlogHashComponent),
    },
    {
        path: HubBlogSectionRoutesDefs.route('route-defs-tutorial'),
        loadComponent: () => import('@spider-baby/posts-route-defs-tutorial').then((m) => m.PostRouteDefsTutorialComponent),
        data: { pageTitle: 'Route Definitions Tutorial', showDemoLink: true } // Example data
      },

      // This route is the default route for the product-admin area 
      // We want the base/entry route to be '' so that routing will happen relative to HubBlogSectionRoutesDefs.BASE not 'home'
      {
        path: '',
        loadComponent: () => import('@sb-hub/sections-blog/features-home').then((m) => m.HubBlogHomeComponent),
      },
      // This route redirects the 'home' route to ''.
      // We want the base/entry route to be '' so that routing will happen relative to HubBlogSectionRoutesDefs.BASE not 'home'
      {
        path: HubBlogSectionRoutesDefs.route('home'),
        redirectTo: '',
        pathMatch: 'full',
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
  `${HubBlogSectionRoutesDefs.BASE}`,
  () => blogRoutes
);

//#################################################//
