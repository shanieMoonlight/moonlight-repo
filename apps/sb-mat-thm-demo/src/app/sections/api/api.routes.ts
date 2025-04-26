import { Route } from '@angular/router';
import { ApiComponent } from './api.component';

export const apiRoutes: Route[] = [
    {
        path: '',
        component: ApiComponent,
        children: [{
            path: 'home',
            loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent),
        },
        {
            path: 'variables-list',
            loadComponent: () => import('./features/complete-color-list/complete-color-list.component').then(m => m.CompleteColorListComponent),
        },
        {
            path: 'service-api',
            loadComponent: () => import('./features/theme-service-api/theme-service-api.component').then(m => m.ThemeServiceApiComponent),
        },
        {
            path: '',
            loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent),
        },
        {
          path: '**',
          loadComponent: () => import('../../shared/features/not-found.component').then((m) => m.NotFoundComponent),
          pathMatch: 'full',
        },], //Children
    },
];
