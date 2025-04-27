import { Route } from '@angular/router';
import { ApiComponent } from './api.component';

export const apiRoutes: Route[] = [
    {
        path: '',
        component: ApiComponent,
        children: [
            {
                path: 'home',
                loadComponent: () => import('./features/home/home.component').then(m => m.ApiHomeComponent),
            },
            {
                path: 'mini-state',
                loadComponent: () => import('./features/mini-state/mini-state-docs.component').then(m => m.MiniStateDocsComponent),
            },
            {
                path: 'mini-state-builder',
                loadComponent: () => import('./features/mini-state-builder/mini-state-builder-docs.component').then(m => m.MiniStateBuilderDocsComponent),
            },
            {
                path: 'mini-state-crud',
                loadComponent: () => import('./features/mini-state-crud/mini-state-crud-docs.component').then(m => m.MiniStateCrudDocsComponent),
            },
            {
                path: 'mini-state-combined',
                loadComponent: () => import('./features/mini-state-combined/mini-state-combined-docs.component').then(m => m.MiniStateCombinedDocsComponent),
            },
            {
                path: 'ms-utility',
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
