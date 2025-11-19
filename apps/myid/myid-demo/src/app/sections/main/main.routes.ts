import { Route } from '@angular/router';
import { provideMyIdRouter, provideMyIdTeamPositionOptions, TwoFactorOption } from '@spider-baby/myid-auth/config';
import { createMyIdCustomGuard } from '@spider-baby/myid-auth/guards';
import { getAuthTestFirebaseRoutes, getMainMyIdAccountRoutes, getMyIdAuthTestRoutes, getMyIdCustomerRoutes, getMyIdMntsAndSuperRoutes } from '@spider-baby/myid-auth/routes';
import { userMgrAdminTeamPositionOptions } from '@spider-baby/myid-auth/user-mgr-admin';
import { MainSectionRoutesDefs } from './main-route-defs';
import { MainComponent } from './main.component';
import { MyIdMainRouterService } from './utils/my-id-main-router/my-id-main-router.service';
import { SocialAuthSetup } from '../../config/oauth.config.factory';
// import { createMyIdCustomGuard, myIdLoggedInGuard } from '../../shared/auth/guards';


export const customerOnlyGuard = createMyIdCustomGuard(
    (authService) => authService.isLoggedIn() && authService.isCustomer()
);



const twoFactorProviderOptions: TwoFactorOption[] = [
  { value: 'AuthenticatorApp', label: 'Authenticator App' },
//   { value: 'Sms', label: 'SMS' },
  { value: 'Email', label: 'Email' }
]

export const mainRoutes: Route[] = [
    {
        path: '',
        component: MainComponent,

        providers: [
            provideMyIdRouter(MyIdMainRouterService),
            provideMyIdTeamPositionOptions(userMgrAdminTeamPositionOptions),
            //  SocialAuthSetup.provideSocialLoginConfig(),
            // provideMyIdTeamPositionOptionsService(CustomTeamPositionOptionsProvider),
            // provideMyIdTwoFactorOptions(twoFactorProviderOptions),
        ],
        children: [
            ...getMainMyIdAccountRoutes({
                showSocialLinks: true,
            }),
            ...getMyIdCustomerRoutes({
                showSocialLinks: true,
            }),
            ...getMyIdMntsAndSuperRoutes(),
            ...getMyIdAuthTestRoutes(),
            ...getAuthTestFirebaseRoutes(),
            {
                path: MainSectionRoutesDefs.route('home'),
                loadComponent: () => import('./features/home/home.component').then(m => m.MainHomeComponent),
            },
            {
                path: MainSectionRoutesDefs.route('scratchpad'),
                loadComponent: () => import('./features/scratchpad/scratchpad.component').then(m => m.ScratchpadComponent),
                // canActivate: [customerOnlyGuard],
            },
            {
                path: MainSectionRoutesDefs.route('auth-test-user-mgr-admin'),
                loadComponent: () => import('@spider-baby/myid-auth/user-mgr-admin').then(m => m.AuthServiceUserMgrAdminComponent),
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
