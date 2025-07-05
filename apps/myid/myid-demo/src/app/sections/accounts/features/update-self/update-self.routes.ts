import { Route } from "@angular/router";
import { AccountSectionRoutesDefs } from "../../account-route-defs";
import { loggedInGuard } from "@spider-baby/myid-auth/guards";

export function myDetailsRoutes(authenticate: boolean = true): Route[] {
    return [
        {
            path: AccountSectionRoutesDefs.route('my-details'),
            loadComponent: () => import('./update-self.component').then(m => m.UpdateSelfComponent),
            canActivate: authenticate ? [loggedInGuard] : [],
        }
    ]
}