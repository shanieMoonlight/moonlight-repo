import { Route } from '@angular/router';
import { MainComponent } from './main.component';
import { MainSectionRoutesDefs } from './main-route-defs';

export const mainRoutes: Route[] = [
    {
        path: '',
        component: MainComponent,
        children: [
            {
                path: MainSectionRoutesDefs.route('home'),
                loadComponent: () => import('./features/home/home.component').then(m => m.MainHomeComponent),
            },
            {
                path: MainSectionRoutesDefs.route('oauth'),
                loadComponent: () => import('./features/oauth/oauth.component').then(m => m.OauthComponent),
            },
            {
                path: MainSectionRoutesDefs.route('login-jwt'),
                loadComponent: () => import('./features/login-jwt/login-jwt.component').then(m => m.LoginJwtComponent),
            },
            {
                path: MainSectionRoutesDefs.route('login-cookie'),
                loadComponent: () => import('./features/login-cki/login-cki.component').then(m => m.LoginCkiComponent),
            },
            {
                path: MainSectionRoutesDefs.route('confirm-email'),
                loadComponent: () => import('./features/confirm-email/confirm-email.component').then(m => m.ConfirmEmailComponent),
            },
            {
                path: MainSectionRoutesDefs.route('confirm-email-with-pwd'),
                loadComponent: () => import('./features/confirm-email-with-pwd/confirm-email-with-pwd.component').then(m => m.ConfirmEmailWithPwdComponent),
            },
            {
                path: MainSectionRoutesDefs.route('confirm-phone'),
                loadComponent: () => import('./features/confirm-phone/confirm-phone.component').then(m => m.ConfirmPhoneComponent),
            },
            {
                path: MainSectionRoutesDefs.route('reset-password'),
                loadComponent: () => import('./features/reset-pwd/reset-pwd.component').then(m => m.ResetPwdComponent),
            },
            {
                path: MainSectionRoutesDefs.route('change-pwd'),
                loadComponent: () => import('./features/change-pwd/change-pwd.component').then(m => m.ChangePwdComponent),
            },
            {
                path: MainSectionRoutesDefs.route('verify-2-factor'),
                loadComponent: () => import('./features/verify-2-factor/verify-2-factor.component').then(m => m.Verify2FactorComponent),
            },
            {
                path: '',
                loadComponent: () => import('./features/home/home.component').then(m => m.MainHomeComponent),
            },
            {
                path: '**',
                loadComponent: () => import('../../shared/features/not-found.component').then((m) => m.NotFoundComponent),
                pathMatch: 'full',
            },], 
    },
];
