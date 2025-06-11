import { Route } from '@angular/router';
import { ApiComponent } from './api.component';
import { ApiSectionRoutesDefs } from './api-route-defs';

export const apiRoutes: Route[] = [
    {
        path: '',
        component: ApiComponent,
        children: [
            {
                path: ApiSectionRoutesDefs.route('home'),
                title: 'API - SpiderBaby MiniState',
                loadComponent: () => import('./features/home/home.component').then(m => m.ApiHomeComponent),
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
        ], 
    },
];
