import { Route } from '@angular/router';

export const appRoutes: Route[] = [
    {
      path: 'seasons',
      title: 'Seasonal Themes Demo - SpiderBaby Material Theming',
      loadChildren: () => import('./sections/seasons/seasons.routes').then((m) => m.seasonalRoutes),
    }, 
    {
      path: 'api',
      title: 'API Documentation - SpiderBaby Material Theming',
      loadChildren: () => import('./sections/api/api.routes').then((m) => m.apiRoutes),
    },  
    {
      path: 'main',
      title: 'SpiderBaby Material Theming - Enhanced Angular Material Design',
      loadChildren: () => import('./sections/main/main.routes').then((m) => m.mainRoutes),
    },
    {
      path: '',
      redirectTo: 'main',
      pathMatch: 'full',
    },
    {
      path: '**',
      title: 'Page Not Found - SpiderBaby Material Theming',
      loadComponent: () => import('./shared/features/not-found.component').then((m) => m.NotFoundComponent),
      pathMatch: 'full',
    }
  ];