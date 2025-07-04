// import { createMyIdCustomGuard, myIdLoggedInGuard } from '../../shared/auth/guards';

import { CanActivate, CanActivateFn, CanLoadFn, CanMatch, CanMatchFn, Route } from '@angular/router';
import { AccountSectionRoutesDefs } from './account-route-defs';
import { changePwdRoutes } from './features/change-pwd/change-pwd.routes';
import { confirmEmailRoutes } from './features/confirm-email/confirm-email.routes';
import { confirmPhoneRoutes } from './features/confirm-phone/confirm-phone.routes';
import { customersRoutes } from './features/customers/customers.routes';
import { loginCookieRoutes } from './features/login-cki/login-cki.routes';
import { loginJwtRoutes } from './features/login-jwt/login-jwt.routes';
import { registerCustomerRoutes } from './features/register/register.routes';
import { resetPwdRoutes } from './features/reset-pwd/reset-pwd.routes';
import { update2FactorRoutes } from './features/update-2-factor/update-2-factor.routes';
import { myDetailsRoutes } from './features/update-self/update-self.routes';
import { verify2FactorCookieRoutes } from './features/verify-2-factor-cki/verify-2-factor-cki.routes';
import { verify2FactorRoutes } from './features/verify-2-factor/verify-2-factor.routes';
import { mntcTeamRoutes } from './features/mntc-team/mntc-team.routes';
import { superTeamRoutes } from './features/super-team/super-team.routes';
import { Type } from '@angular/core';
import { confirmEmailWithPasswordRoutes } from './features/confirm-email-with-pwd/confirm-email-with-pwd.routes';


//##############################//

export type MyIdRouteOptions = {
    showSocialLinks?: boolean;
    basePath?: string;
    canActivate?: Array<Type<CanActivate> | CanActivateFn>;
    canLoad?: Array<Type<CanMatch> | CanMatchFn>;
}


/**
 * Generates the main set of account-related Angular routes for the MyID application.
 *
 * This factory function returns a single root route (with optional custom base path, will default to AccountSectionRoutesDefs.BASE if omitted)
 * whose children include all major account features: phone/email confirmation, password management,
 * login (JWT and cookie), two-factor flows, and user self-update.
 *
 * @param options - Configuration options for the account routes.
 * @param options.showSocialLinks - If true, enables social login buttons on supported login routes.
 * @param options.basePath - Optionally override the default base path for the account section.
 *
 * @returns An array containing a single root Route object with all account feature child routes.
 *
 * @example
 * // Add account routes under the default base path, with social logins enabled:
 * const routes = getMainMyIdAccountRoutes({ showSocialLinks: true });
 *
 * // Add account routes under a custom path:
 * const routes = getMainMyIdAccountRoutes({ basePath: 'user', showSocialLinks: false });
 *
 * // Resulting structure:
 * // [
 * //   {
 * //     path: 'accounts' | options.basePath,
 * //     providers: [],
 * //     children: [
 * //       ...confirmPhoneRoutes(),
 * //       ...changePwdRoutes(),
 * //       ...confirmEmailRoutes(),
 * //       ...loginJwtRoutes({ showSocialLinks }),
 * //       ...loginCookieRoutes({ showSocialLinks }),
 * //       ...resetPwdRoutes(),
 * //       ...update2FactorRoutes(),
 * //       ...myDetailsRoutes(),
 * //       ...verify2FactorCookieRoutes(),
 * //       ...verify2FactorRoutes(),
 * //     ]
 * //   }
 * // ]
 */
export function getMainMyIdAccountRoutes(options?: MyIdRouteOptions): Route[] {

    const showSocialLinks = !!options?.showSocialLinks

    return [
        {
            path: options?.basePath ?? AccountSectionRoutesDefs.BASE,
            providers: [],
            ...(options?.canActivate ? { canActivate: options.canActivate } : {}),
            ...(options?.canLoad ? { canLoad: options.canLoad } : {}),
            children: [
                ...confirmPhoneRoutes(),
                ...changePwdRoutes(),
                ...confirmEmailRoutes(),
                ...confirmEmailWithPasswordRoutes(),
                ...loginJwtRoutes({
                    showSocialLinks: showSocialLinks,
                }),
                ...loginCookieRoutes({
                    showSocialLinks: showSocialLinks,
                }),
                ...resetPwdRoutes(),
                ...update2FactorRoutes(),
                ...myDetailsRoutes(),
                ...verify2FactorCookieRoutes(),
                ...verify2FactorRoutes(),
            ],
        },
    ];
}


//##############################//


/**
 * Generates the customer-related Angular routes for the MyID application.
 *
 * This factory function returns a single root route (with optional custom base path, defaults to AccountSectionRoutesDefs.BASE)
 * whose children include customer management and customer registration features.
 *
 * @param options - Configuration options for the customer routes.
 * @param options.showSocialLinks - If true, enables social login buttons on supported registration routes.
 * @param options.basePath - Optionally override the default base path for the customer section.
 *
 * @returns An array containing a single root Route object with all customer feature child routes.
 *
 * @example
 * // Add customer routes under the default base path, with social logins enabled:
 * const routes = getMyIdCustomerRoutes({ showSocialLinks: true });
 *
 * // Add customer routes under a custom path:
 * const routes = getMyIdCustomerRoutes({ basePath: 'clients', showSocialLinks: false });
 *
 * // Resulting structure:
 * // [
 * //   {
 * //     path: 'accounts' | options.basePath,
 * //     providers: [],
 * //     children: [
 * //       ...customersRoutes(),
 * //       ...registerCustomerRoutes({ showSocialLinks }),
 * //     ]
 * //   }
 * // ]
 */
export function getMyIdCustomerRoutes(options?: MyIdRouteOptions): Route[] {
    const showSocialLinks = !!options?.showSocialLinks;
    return [
        {
            path: options?.basePath ?? AccountSectionRoutesDefs.BASE,
            providers: [],
            ...(options?.canActivate ? { canActivate: options.canActivate } : {}),
            ...(options?.canLoad ? { canLoad: options.canLoad } : {}),
            children: [
                ...customersRoutes(),
                ...registerCustomerRoutes({
                    showSocialLinks: showSocialLinks,
                })
            ],
        },
    ];
}


//##############################//


export type MyIdMntcRouteOptions = {
    basePath?: string;
    canActivate?: Array<Type<CanActivate> | CanActivateFn>;
    canLoad?: Array<Type<CanMatch> | CanMatchFn>;
}

/**
 * Generates the maintenance and super team Angular routes for the MyID application.
 *
 * This factory function returns a single root route (with optional custom base path, defaults to AccountSectionRoutesDefs.BASE)
 * whose children include the maintenance team and super team features.
 *
 * @param options - Configuration options for the maintenance and super team routes.
 * @param options.basePath - Optionally override the default base path for this section.
 *
 * @returns An array containing a single root Route object with maintenance and super team child routes.
 *
 * @example
 * // Add maintenance and super team routes under the default base path:
 * const routes = getMyIdMntsAndSuperRoutes();
 *
 * // Add routes under a custom path:
 * const routes = getMyIdMntsAndSuperRoutes({ basePath: 'teams' });
 *
 * // Resulting structure:
 * // [
 * //   {
 * //     path: 'accounts' | options.basePath,
 * //     providers: [],
 * //     children: [
 * //       ...mntcTeamRoutes(),
 * //       ...superTeamRoutes(),
 * //     ]
 * //   }
 * // ]
 */
export function getMyIdMntsAndSuperRoutes(options?: MyIdMntcRouteOptions): Route[] {
    return [
        {
            path: options?.basePath ?? AccountSectionRoutesDefs.BASE,
            providers: [],
            ...(options?.canActivate ? { canActivate: options.canActivate } : {}),
            ...(options?.canLoad ? { canLoad: options.canLoad } : {}),
            children: [
                ...mntcTeamRoutes(),
                ...superTeamRoutes()
            ],
        },
    ];
}


//##############################//
