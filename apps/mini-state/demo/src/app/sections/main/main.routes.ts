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
                loadComponent: () => import('./features/detail/detail.component').then(m => m.DetailComponent),
            },
            {
                path: 'detail/:id',
                loadComponent: () => import('./features/detail/detail.component').then(m => m.DetailComponent),
            },
            {
                path: 'simple',
                loadComponent: () => import('./features/simple/simple.component').then(m => m.SimpleComponent),
            },
            {
                path: 'manual-crud',
                loadComponent: () => import('./features/manual-crud/manual-crud.component').then(m => m.ManualCrudComponent),
            },
            {
                path: 'crud',
                loadComponent: () => import('./features/crud/crud.component').then(m => m.CrudComponent),
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
