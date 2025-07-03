
// import { createMyIdCustomGuard, myIdLoggedInGuard } from '../../shared/auth/guards';

import { Route } from '@angular/router';
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


//##############################//

export type MyIdRouteOptions = {
    showSocialLinks?: boolean;
    basePath?: string;
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
export function getMainMyIdAccountRoutes(options: MyIdRouteOptions): Route[] {
    return [
        {
            path: options.basePath ?? AccountSectionRoutesDefs.BASE,
            providers: [],
            children: [
                ...confirmPhoneRoutes(),
                ...changePwdRoutes(),
                ...confirmEmailRoutes(),
                ...loginJwtRoutes({
                    showSocialLinks: options.showSocialLinks,
                }),
                ...loginCookieRoutes({
                    showSocialLinks: options.showSocialLinks,
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


export function getMyIdCustomerRoutes(options: MyIdRouteOptions): Route[] {
    return [
        {
            path: options.basePath ?? AccountSectionRoutesDefs.BASE,
            providers: [],
            children: [
                ...customersRoutes(),
                ...registerCustomerRoutes({
                    showSocialLinks: options.showSocialLinks,
                })
            ],
        },
    ];
}


//##############################//
