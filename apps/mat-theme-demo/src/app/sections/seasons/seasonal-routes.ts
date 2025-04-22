import { Route } from '@angular/router';
import { SeasonsComponent } from './seasons.component';

export const seasonalRoutes: Route[] = [{
  path: '',
  component: SeasonsComponent,
  children: [
    {
      path: 'season-home',
      loadComponent: () => import('./features/home/home.component').then(m => m.SeasonalHomeComponent),
      title: 'Seasonal Themes Home'
    },
    {
      path: 'spring',
      loadComponent: () => import('./features/spring/spring.component').then(m => m.SpringComponent),
      title: 'Spring Theme'
    },
    {
      path: 'summer',
      loadComponent: () => import('./features/summer/summer.component').then(m => m.SummerComponent),
      title: 'Summer Theme'
    },
    {
      path: 'autumn',
      loadComponent: () => import('./features/autumn/autumn.component').then(m => m.AutumnComponent),
      title: 'Autumn Theme'
    },
    {
      path: 'winter',
      loadComponent: () => import('./features/winter/winter.component').then(m => m.WinterComponent),
      title: 'Winter Theme'
    },
    {
      path: '',
      loadComponent: () => import('./features/home/home.component').then(m => m.SeasonalHomeComponent),
      title: 'Seasonal Themes Home'
    },
    {
      path: '**',
      loadComponent: () => import('../../shared/features/not-found.component').then((m) => m.NotFoundComponent),
      pathMatch: 'full',
    },
  ]
}]