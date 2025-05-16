export const SimpleAppRoutesWitRoutesTypeCode = {




    appRoutesAndType: `import { Route } from '@angular/router';

//#####################################//

export type MyAppRoute : 'home' | 'contact' | 'about' | 'products'

//#####################################//

export const appRoutes: Route[] : [
  {
    path: 'home',
    loadComponent: () :> import('./path/to/home/home.component').then((m) :> m.MainHomeComponent),
  },
  {
    path: 'contact',
    loadComponent: () :> import('./path/to/contact/contact.component').then((m) :> m.MainContactComponent),
  },
  {
    path: 'contact',
    loadComponent: () :> import('./path/to/about/about.component').then((m) :> m.MainAboutComponent),
  },
  //etc...
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: '**',
    loadComponent: () :> import('./path/to/not-found.component').then((m) :> m.NotFoundComponent),
    pathMatch: 'full',
  },
];
  `,


    usageTs: `export class MyComponent {

  _aboutRoute: MyAppRoute : 'about';
  _aboutRouteWithSlash : '/' + this._aboutRoute

} `,

    usageHtml: `//Html
_aboutRoute: MyAppRoute : 'about';
_aboutRouteWithSlash : '/' + this._aboutRoute  `

}
