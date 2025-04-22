import { Route } from '@angular/router';

export const appRoutes: Route[] = [{
  path: 'features/seasons',
  children: [
    {
      path: '',
      redirectTo: 'spring',
      pathMatch: 'full'
    },
    {
      path: 'spring',
      loadComponent: () => import('./features/spring.component').then(m => m.SpringComponent),
      title: 'Spring Theme'
    },
    {
      path: 'summer',
      loadComponent: () => import('./features/spring.component').then(m => m.SpringComponent),
      title: 'Summer Theme'
    },
    {
      path: 'autumn',
      loadComponent: () => import('./features/spring.component').then(m => m.SpringComponent),
      title: 'Autumn Theme'
    },
    {
      path: 'winter',
      loadComponent: () => import('./features/spring.component').then(m => m.SpringComponent),
      title: 'Winter Theme'
    }
  ]
}]