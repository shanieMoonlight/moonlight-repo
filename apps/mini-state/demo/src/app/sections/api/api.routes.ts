import { Route } from '@angular/router';
import { ApiComponent } from './api.component';

export const apiRoutes: Route[] = [
    {
        path: '',
        component: ApiComponent,
        children: [
            {
                path: 'home',
                title: 'API - SpiderBaby MiniState',
                loadComponent: () => import('./features/home/home.component').then(m => m.ApiHomeComponent),
            },
            {
                path: 'mini-state',
                title: 'API MiniState - SpiderBaby MiniState',
                loadComponent: () => import('./features/mini-state/mini-state-docs.component').then(m => m.MiniStateDocsComponent),
            },
            {
                path: 'mini-state-builder',
                title: 'API Builder - SpiderBaby MiniState',
                loadComponent: () => import('./features/mini-state-builder/mini-state-builder-docs.component').then(m => m.MiniStateBuilderDocsComponent),
            },
            {
                path: 'mini-state-crud',
                title: 'API Crud - SpiderBaby MiniState',
                loadComponent: () => import('./features/mini-state-crud/mini-state-crud-docs.component').then(m => m.MiniStateCrudDocsComponent),
            },
            {
                path: 'mini-state-combined',
                title: 'API Combined - SpiderBaby MiniState',
                loadComponent: () => import('./features/mini-state-combined/mini-state-combined-docs.component').then(m => m.MiniStateCombinedDocsComponent),
            },
            {
                path: 'mini-state-utility',
                title: 'API Utility - SpiderBaby MiniState',
                loadComponent: () => import('./features/mini-state-utility/mini-state-utility-docs.component').then(m => m.MiniStateUtilityDocsComponent),
            },
            {
                path: '',
                loadComponent: () => import('./features/home/home.component').then(m => m.ApiHomeComponent),
            },
            {
                path: '**',
                loadComponent: () => import('../../shared/features/not-found.component').then((m) => m.NotFoundComponent),
                pathMatch: 'full',
            },
        ], //Children
    },
];
