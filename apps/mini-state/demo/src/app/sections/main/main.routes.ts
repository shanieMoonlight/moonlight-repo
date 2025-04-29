import { Route } from '@angular/router';
import { MainComponent } from './main.component';

export const mainRoutes: Route[] = [
    {
        path: '',
        component: MainComponent,
        children: [
            {
                path: 'home',
                loadComponent: () => import('./features/home/home.component').then(m => m.MainHomeComponent),
            },
            {
                path: 'detail',
                loadComponent: () => import('./features/detail/detail.component').then(m => m.MainDemoDetailComponent),
            },
            {
                path: 'detail/:id',
                loadComponent: () => import('./features/detail/detail.component').then(m => m.MainDemoDetailComponent),
            },
            {
                path: 'simple',
                loadComponent: () => import('./features/simple/simple.component').then(m => m.MainDemoSimpleComponent),
            },
            {
                path: 'combined',
                loadComponent: () => import('./features/combined/combined.component').then(m => m.MainDemoCombinedComponent),
            },
            {
                path: 'crud',
                loadComponent: () => import('./features/crud/crud.component').then(m => m.MainDemoCrudComponent),
            },
            {
                path: 'crud-state',
                loadComponent: () => import('./features/crud-state/crud-state.component').then(m => m.MainDemoCrudWithSeparateStateComponent),
            },
            {
                path: '',
                loadComponent: () => import('./features/home/home.component').then(m => m.MainHomeComponent),
            },
            {
                path: '**',
                loadComponent: () => import('../../shared/features/not-found.component').then((m) => m.NotFoundComponent),
                pathMatch: 'full',
            },], //Children
    },
];
