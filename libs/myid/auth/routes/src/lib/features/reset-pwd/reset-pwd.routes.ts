import { Route } from "@angular/router";
import { AccountSectionRoutesDefs } from "../../account-route-defs";

export function resetPwdRoutes(): Route[] {
    return [
        {
            path: AccountSectionRoutesDefs.route('reset-password'),
            loadComponent: () => import('./reset-pwd.component').then(m => m.ResetPwdComponent),
        }
    ]
}