import { Route } from '@angular/router';

export const appRoutes: Route[] = [    
    {
        path: 'home',
        loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent),
    },
    {
        path: 'custom-theming',
        loadComponent: () => import('./features/customization/customization.component').then(m => m.CustomizationComponent),
    },
    {
        path: 'multi-demo',
        loadComponent: () => import('./features/multi-theme-demo/multi-theme-demo.component').then(m => m.MultiThemeApiDemoComponent),
    },
    {
        path: '',
        loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent),
    }
];
