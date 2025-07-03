import { Route } from "@angular/router";
import { loggedInGuard } from "../../../../shared/id/auth/guards";
import { AccountSectionRoutesDefs } from "../../account-route-defs";

export function changePwdRoutes(authenticate: boolean = true): Route[] {
    return [
        {
            path: AccountSectionRoutesDefs.route('change-password'),
            loadComponent: () => import('./change-pwd.component').then(m => m.ChangePwdComponent),
            canActivate: authenticate ? [loggedInGuard] : [],
        }
    ]
}