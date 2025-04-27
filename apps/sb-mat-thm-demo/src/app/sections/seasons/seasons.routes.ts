import { Route } from '@angular/router';
import { SeasonsComponent } from './seasons.component';

export const seasonalRoutes: Route[] = [
    {
        path: '',
        component: SeasonsComponent,
        children: [
            {
                path: 'season-home',
                title: 'Seasons Home - SpiderBaby Material Theming',
                loadComponent: () => import('./features/home/home.component').then(m => m.SeasonalHomeComponent)
            },
            {
                path: 'summer',
                title: 'Summer Theme - SpiderBaby Material Theming',
                loadComponent: () => import('./features/summer/summer.component').then(m => m.SummerComponent)
            },
            {
                path: 'autumn',
                title: 'Fall Theme - SpiderBaby Material Theming',
                loadComponent: () => import('./features/autumn/autumn.component').then(m => m.AutumnComponent)
            },
            {
                path: 'winter',
                title: 'Winter Theme - SpiderBaby Material Theming',
                loadComponent: () => import('./features/winter/winter.component').then(m => m.WinterComponent)
            },
            {
                path: 'spring',
                title: 'Spring Theme - SpiderBaby Material Theming',
                loadComponent: () => import('./features/spring/spring.component').then(m => m.SpringComponent)
            },
            {
                path: '',
                title: 'Seasonal Themes - SpiderBaby Material Theming',
                loadComponent: () => import('./features/home/home.component').then(m => m.SeasonalHomeComponent)
            },
            {
              path: '**',
              title: 'Page Not Found - SpiderBaby Material Theming',
              loadComponent: () => import('../../shared/features/not-found.component').then((m) => m.NotFoundComponent),
              pathMatch: 'full',
            },
        ]
    }
];