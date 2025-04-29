import { Route } from '@angular/router';


export const appRoutes: Route[] = [
    {
      path: 'api',
      loadChildren: () => import('./sections/api/api.routes').then((m) => m.apiRoutes)
    },  
    {
      path: '',
      loadChildren: () => import('./sections/main/main.routes').then((m) => m.mainRoutes)
    },
    // {
    //   path: '',
    //   redirectTo: 'main',
    //   pathMatch: 'full',
    // },
    {
      path: '**',
      loadComponent: () => import('./shared/features/not-found.component').then((m) => m.NotFoundComponent),
      pathMatch: 'full',
    }
  ];