import { Route } from '@angular/router';
import { MainComponent } from './main.component';

export const mainRoutes: Route[] = [
  {
    path: '',
    component: MainComponent,
    children: [
      {
        path: 'home',
        loadComponent: () => import('./features/home/home.component').then((m) => m.MainHomeComponent),
      },
      {
        path: 'open-source',
        loadComponent: () => import('./features/open-source/demos.component').then((m) => m.HubOpenSourceDemosComponent),
      },
      {
        path: '',
        loadComponent: () => import('./features/open-source/demos.component').then((m) => m.HubOpenSourceDemosComponent),
      },
      {
        path: '**',
        loadComponent: () => import('../../shared/features/not-found.component').then((m) => m.NotFoundComponent),
        pathMatch: 'full',
      },
    ],
  },
];
