import { Route } from '@angular/router';

export const appRoutes: Route[] = [
    {
        path: 'theming',
        loadComponent: () => import('./features/theming/theming.component').then(m => m.ThemingComponent),
    },
    {
        path: '',
        loadComponent: () => import('./features/theming/theming.component').then(m => m.ThemingComponent),
    }
];
