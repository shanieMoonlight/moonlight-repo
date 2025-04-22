import { Route } from '@angular/router';



export const appRoutes: Route[] = [
    {
      path: 'seasons',
      loadChildren: () => import('./sections/seasons/seasonal-routes').then((m) => m.seasonalRoutes)
    }, 
    {
      path: 'main',
      loadChildren: () => import('./sections/main/main.routes').then((m) => m.mainRoutes)
    },  
    {
      path: '',
      redirectTo: 'main',
      pathMatch: 'full',
    },
    {
      path: '**',
      loadComponent: () => import('./shared/features/not-found.component').then((m) => m.NotFoundComponent),
      pathMatch: 'full',
    },
    // {
    //   path: '**',
    //   loadComponent: () => import('@inigo/not-found/with-footer').then((m) => NotFoundWithFooterComponent),
    //   data: DelayPreloader(9000),
    // },
  ];