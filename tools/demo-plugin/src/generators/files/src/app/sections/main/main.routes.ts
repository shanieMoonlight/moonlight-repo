import { Route } from '@angular/router';
import { MainSectionRoutesDefs } from './main-route-defs';
import { MainComponent } from './main.component';

export const mainRoutes: Route[] = [
    {
        path: '',
        component: MainComponent,
        children: [
            {
                path: MainSectionRoutesDefs.route('home'),
                loadComponent: () => import('./features/home/home.component').then(m => m.MainHomeComponent),
            },
            {
                path: '',
                loadComponent: () => import('./features/home/home.component').then(m => m.MainHomeComponent),
            },
            {
                path: '**',
                loadComponent: () => import('../../shared/features/not-found.component').then((m) => m.NotFoundComponent),
                pathMatch: 'full',
            },], 
    },
];
