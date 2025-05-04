import { Route } from '@angular/router';

export const appRoutes: Route[] = [
    {
      path: 'firebase',
      title: 'Firebase Tutorials',
      loadChildren: () => import('./sections/firebase/firebase.routes').then((m) => m.firebaseRoutes)
    }, 
    {
      path: '',
      redirectTo: 'firebase',
      pathMatch: 'full',
    },
    {
      path: '**',
      title: 'Page Not Found - SpiderBaby Material Theming',
      loadComponent: () => import('./shared/features/not-found.component').then((m) => m.NotFoundComponent),
      pathMatch: 'full',
    }
  ];
