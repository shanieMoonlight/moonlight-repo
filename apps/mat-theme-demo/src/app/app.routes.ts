import { Route } from '@angular/router';

export const appRoutes: Route[] = [    
    {
        path: 'home',
        loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent),
    },
    {
        path: 'custom-theming',
        loadComponent: () => import('./features/theming/theming.component').then(m => m.ThemingComponent),
    },
    {
        path: '',
        loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent),
    }
];
