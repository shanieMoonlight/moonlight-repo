import { Route } from '@angular/router';
import { MainComponent } from './main.component';
import { MainSectionRoutesDefs } from './main-route-defs';

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
                path: MainSectionRoutesDefs.route('oauth'),
                loadComponent: () => import('./features/oauth/oauth.component').then(m => m.OauthComponent),
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
