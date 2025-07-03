import { Route } from '@angular/router';
import { teamPositionOptions } from '../../shared/auth/user-mgr-admin/utils/posiition/team-position-options';
import { createMyIdCustomGuard } from '../../shared/id/auth/guards';
import { provideMyIdTeamPositionOptions } from '../../shared/id/utils/options/team-position/team-position-option.config';
import { provideMyIdRouter } from '../../shared/id/utils/services/id-navigation/id-router.config';
import { getMyIdCustomerRoutes, getMainMyIdAccountRoutes, getMyIdMntsAndSuperRoutes } from '../accounts/account.routes';
import { MainSectionRoutesDefs } from './main-route-defs';
import { MainComponent } from './main.component';
import { MyIdMainRouterService } from './utils/my-id-main-router/my-id-main-router.service';
import { TwoFactorOption } from '../../shared/id/utils/options/mfa/two-factor-options-provider';
import { provideMyIdTwoFactorOptions } from '../../shared/id/utils/options/mfa/two-factor-options.config';
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
            provideMyIdTeamPositionOptions(teamPositionOptions),
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
                path: MainSectionRoutesDefs.route('auth-test'),
                loadComponent: () => import('../accounts/features/auth-service-test/default/auth-service-test.component').then(m => m.AuthServiceTestComponent),
            },
            {
                path: MainSectionRoutesDefs.route('auth-test-firebase'),
                loadComponent: () => import('../accounts/features/auth-service-test/firebase/auth-service-firebase-test.component').then(m => m.AuthServiceFirebaseTestComponent),
            },
            {
                path: MainSectionRoutesDefs.route('auth-test-user-mgr-admin'),
                loadComponent: () => import('../accounts/features/auth-service-test/user-mgr-admin/user-mgr-admin.component').then(m => m.AuthServiceUserMgrAdminComponent),
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
