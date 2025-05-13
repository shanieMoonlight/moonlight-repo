import { Route } from '@angular/router';
import { MainComponent } from './main.component';

export const mainRoutes: Route[] = [
  {
    path: '',
    component: MainComponent,
    children: [
      {
        path: 'home',
        loadComponent: () => import('@sb-hub/sections-main/features/home').then((m) => m.HubMainHomeComponent),
      },
      {
        path: 'open-source',
        loadComponent: () => import('@sb-hub/sections-main/features/open-source').then((m) => m.HubOpenSourceDemosComponent),
      },
      // {
      //   path: '',
      //   loadComponent: () => import('./features/open-source/demos.component').then((m) => m.HubOpenSourceDemosComponent),
      // },

      {
        path: '',
        redirectTo: 'open-source', // Change loadComponent to redirectTo
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
