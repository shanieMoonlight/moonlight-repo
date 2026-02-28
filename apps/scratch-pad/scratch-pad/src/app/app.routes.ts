import { Route } from '@angular/router';
import { ScratchPadAppRouteDefs } from './app-route-defs';

export const appRoutes: Route[] = [
      {
        path: ScratchPadAppRouteDefs.route('first-error'),
        loadComponent: () => import('./pages/first-error/first-error').then((m) => m.FirstErrorPage),
      },
      // This route is the default route for the product-admin area 
      // We want the base/entry route to be '' so that routing will happen relative to MainSectionRoutesDefs.BASE not 'home'
      {
        path: '',
        loadComponent: () => import('./pages/home/home').then((m) => m.ScratchPadHomePage),
      },
      // This route redirects the 'home' route to ''.
      // We want the base/entry route to be '' so that routing will happen relative to MainSectionRoutesDefs.BASE not 'home'
      {
        path: ScratchPadAppRouteDefs.route('home'),
        redirectTo: '',
        pathMatch: 'full',
      },];
