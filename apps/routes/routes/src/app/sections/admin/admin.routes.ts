import { Route } from '@angular/router';
import { AdminComponent } from './admin.component';
import { AdminSectionRoutesDefs } from './admin-route-defs';

export const adminRoutes: Route[] = [
  {
    path: '',
    component: AdminComponent,
    children: [
      {
        path: AdminSectionRoutesDefs.routes.route('reports'),
        loadComponent: () => import('./features/reports/reports.component').then((m) => m.ReportsComponent),
      },
      {
        path: AdminSectionRoutesDefs.routes.route('settings'),
        loadComponent: () => import('./features/settings/settings.component').then((m) => m.SettingsComponent),
      },
      {
        path: AdminSectionRoutesDefs.routes.route('content'),
        loadComponent: () => import('./features/content/content.component').then((m) => m.ContentComponent),
      },
      {
        path: AdminSectionRoutesDefs.routes.route('dashboard'),
        loadComponent: () => import('./features/dashboard/dashboard.component').then((m) => m.DashboardComponent),
      },
      {
        path: AdminSectionRoutesDefs.routes.route('users'),
        loadComponent: () => import('./features/users/users.component').then((m) => m.UsersComponent),
      },
      {
        path: `${AdminSectionRoutesDefs.routes.route('users')}/:id`,
        loadComponent: () => import('./features/users/user-detail/user-detail.component').then((m) => m.UserDetailComponent),
      },
      {
        path: AdminSectionRoutesDefs.routes.products.route(),
        loadChildren: () => import('../product-admin/product-admin.routes').then((m) => m.prodAdminRoutes),
      },
      {
        path: '',
        loadComponent: () => import('./features/home/home.component').then((m) => m.AdminHomeComponent),
      },
      {
        path: AdminSectionRoutesDefs.routes.route('home'),
        redirectTo: '',
        pathMatch: 'full',
      },
      {
        path: '**',
        loadComponent: () => import('../../shared/features/not-found.component').then((m) => m.NotFoundComponent),
        pathMatch: 'full',
      },
    ],
  },
];
