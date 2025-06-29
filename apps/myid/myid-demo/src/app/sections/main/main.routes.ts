import { Route } from '@angular/router';
import { AMyIdRouter } from '../../shared/id/utils/services/id-navigation/id-router.service';
import { MainSectionRoutesDefs } from './main-route-defs';
import { MainComponent } from './main.component';
import { MyIdMainRouterService } from './utils/my-id-main-router/my-id-main-router.service';

export const mainRoutes: Route[] = [
    {
        path: '',
        component: MainComponent,
        
        providers: [
            {
                provide: AMyIdRouter,
                useExisting: MyIdMainRouterService,
            }
        ],
        children: [
            {
                path: MainSectionRoutesDefs.route('home'),
                loadComponent: () => import('./features/home/home.component').then(m => m.MainHomeComponent),
            },
            {
                path: MainSectionRoutesDefs.route('scratchpad'),
                loadComponent: () => import('./features/scratchpad/scratchpad.component').then(m => m.ScratchpadComponent),
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
                path: MainSectionRoutesDefs.route('confirm-email-with-password'),
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
                path: MainSectionRoutesDefs.route('verify-2-factor-cookie'),
                loadComponent: () => import('./features/verify-2-factor-cki/verify-2-factor-cki.component').then(m => m.Verify2FactorComponent),
            },
            {
                path: MainSectionRoutesDefs.route('my-details'),
                loadComponent: () => import('./features/update-self/update-self.component').then(m => m.UpdateSelfComponent),
            },
            {
                path: MainSectionRoutesDefs.route('update-2-factor'),
                loadComponent: () => import('./features/update-2-factor/update-2-factor.component').then(m => m.Update2FactorComponent),
            },
            {
                path: MainSectionRoutesDefs.route('mntc-team'),
                loadComponent: () => import('./features/mntc-team/mntc-team.component').then(m => m.MntcTeamComponent),
            },
            {
                path: MainSectionRoutesDefs.route('auth-test'),
                loadComponent: () => import('./features/auth-service-test/default/auth-service-test.component').then(m => m.AuthServiceTestComponent),
            },
            {
                path: MainSectionRoutesDefs.route('auth-test-firebase'),
                loadComponent: () => import('./features/auth-service-test/firebase/auth-service-firebase-test.component').then(m => m.AuthServiceFirebaseTestComponent),
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
