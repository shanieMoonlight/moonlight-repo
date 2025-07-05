import { Route } from "@angular/router";
import { MyIdAccountSectionRoutesDefs } from "../../account-route-defs";
import { loggedInGuard } from "@spider-baby/myid-auth/guards";

export function myDetailsRoutes(authenticate: boolean = true): Route[] {
    return [
        {
            path: MyIdAccountSectionRoutesDefs.route('my-details'),
            loadComponent: () => import('./update-self.component').then(m => m.UpdateSelfComponent),
            canActivate: authenticate ? [loggedInGuard] : [],
        }
    ]
}