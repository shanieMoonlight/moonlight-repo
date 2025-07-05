import { Route } from "@angular/router";
import { MyIdAccountSectionRoutesDefs } from "../../account-route-defs";
import { loggedInGuard } from "@spider-baby/myid-auth/guards";

export function changePwdRoutes(authenticate: boolean = true): Route[] {
    return [
        {
            path: MyIdAccountSectionRoutesDefs.route('change-password'),
            loadComponent: () => import('./change-pwd.component').then(m => m.ChangePwdComponent),
            canActivate: authenticate ? [loggedInGuard] : [],
        }
    ]
}