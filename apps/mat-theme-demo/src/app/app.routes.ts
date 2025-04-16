import { Route } from '@angular/router';

export const appRoutes: Route[] = [
    {
        path: 'home',
        loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent),
    },
    {
        path: '',
        loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent),
    }
];
