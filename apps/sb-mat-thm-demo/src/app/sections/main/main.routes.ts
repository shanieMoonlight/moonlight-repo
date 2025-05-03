import { Route } from '@angular/router';
import { MainComponent } from './main.component';

export const mainRoutes: Route[] = [
    {
        path: '',
        component: MainComponent,
        children: [
            {
                path: 'home',
                title: 'Home - SpiderBaby Material Theming',
                loadComponent: () => import('./features/home/home.component').then(m => m.MainHomeComponent),
            },
            {
                path: 'custom-theming',
                title: 'Custom Theming - SpiderBaby Material Theming',
                loadComponent: () => import('./features/customization/customization.component').then(m => m.MainDemoCustomizationComponent),
            },
            {
                path: 'multi-demo',
                title: 'Multi-Theme Demo - SpiderBaby Material Theming',
                loadComponent: () => import('./features/multi-theme-demo/multi-theme-demo.component').then(m => m.MultiThemeApiDemoComponent),
            },
            {
                path: '',
                title: 'SpiderBaby Material Theming - Enhanced Angular Material Design',
                loadComponent: () => import('./features/home/home.component').then(m => m.MainHomeComponent),
            },
            {
                path: '**',
                title: 'Page Not Found - SpiderBaby Material Theming',
                loadComponent: () => import('../../shared/features/not-found.component').then((m) => m.NotFoundComponent),
                pathMatch: 'full',
            },
        ],
    },
];
