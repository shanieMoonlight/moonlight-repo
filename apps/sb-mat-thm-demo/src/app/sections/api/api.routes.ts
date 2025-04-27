import { Route } from '@angular/router';
import { ApiComponent } from './api.component';

export const apiRoutes: Route[] = [
    {
        path: '',
        component: ApiComponent,
        children: [{
            path: 'home',
            title: 'API Documentation Home - SpiderBaby Material Theming',
            loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent),
        },
        {
            path: 'variables-list',
            title: 'CSS Variables List - SpiderBaby Material Theming',
            loadComponent: () => import('./features/complete-color-list/complete-color-list.component').then(m => m.CompleteColorListComponent),
        },
        {
            path: 'service-api',
            title: 'Theme Service API - SpiderBaby Material Theming',
            loadComponent: () => import('./features/theme-service-api/theme-service-api.component').then(m => m.ThemeServiceApiComponent),
        },
        {
            path: '',
            title: 'API Documentation - SpiderBaby Material Theming',
            loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent),
        },
        {
          path: '**',
          title: 'Page Not Found - SpiderBaby Material Theming',
          loadComponent: () => import('../../shared/features/not-found.component').then((m) => m.NotFoundComponent),
          pathMatch: 'full',
        },], //Children
    },
];
