import { Route } from "@angular/router";
import { AccountSectionRoutesDefs } from "../../account-route-defs";

export function changePwdRoutes(): Route[] {
    return [
        {
            path: AccountSectionRoutesDefs.route('change-password'),
            loadComponent: () => import('./change-pwd.component').then(m => m.ChangePwdComponent),
        }
    ]
}