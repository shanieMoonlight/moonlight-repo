import { Route } from '@angular/router';
import { ApiComponent } from './api.component';

export const apiRoutes: Route[] = [
    {
        path: '',
        component: ApiComponent,
        children: [{
            path: 'home',
            title: 'API Documentation Home - SpiderBaby Material Theming',
            loadComponent: () => import('./features/home/home.component').then(m => m.ApiHomeComponent),
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
          path: 'theme-picker-api',
          title: 'Theme Picker API - SpiderBaby Material Theming',
          loadComponent: () => import('./features/theme-picker-api/theme-picker-api.component').then(m => m.ThemePickerApiComponent),
        },
        {
          path: 'dark-mode-toggle-api',
          title: 'Dark Mode Toggle API - SpiderBaby Material Theming',
          loadComponent: () => import('./features/dark-mode-toggle-api/dark-mode-toggle-api.component').then(m => m.DarkModeToggleApiComponent),
        },
        {
          path: 'apply-theme-api',
          title: 'Apply Theme Directive API - SpiderBaby Material Theming',
          loadComponent: () => import('./features/apply-theme-api/apply-theme-api.component').then(m => m.ApplyThemeApiComponent),
        },
        {
            path: '',
            title: 'API Documentation - SpiderBaby Material Theming',
            loadComponent: () => import('./features/home/home.component').then(m => m.ApiHomeComponent),
        },
        {
          path: '**',
          title: 'Page Not Found - SpiderBaby Material Theming',
          loadComponent: () => import('../../shared/features/not-found.component').then((m) => m.NotFoundComponent),
          pathMatch: 'full',
        },], //Children
    },
];
