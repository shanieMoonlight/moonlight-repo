import { Route } from "@angular/router";
import { AccountSectionRoutesDefs } from "../../account-route-defs";
import { loggedInGuard } from "../../../../shared/id/auth/guards";

export function update2FactorRoutes(authenticate: boolean = true): Route[] {
    return [
        {
            path: AccountSectionRoutesDefs.route('update-2-factor'),
            loadComponent: () => import('./update-2-factor.component').then(m => m.Update2FactorComponent),
            canActivate: authenticate ? [loggedInGuard] : [],
        }
    ]
}