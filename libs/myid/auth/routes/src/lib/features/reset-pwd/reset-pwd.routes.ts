import { Route } from "@angular/router";
import { MyIdAccountSectionRoutesDefs } from "../../account-route-defs";

export function resetPwdRoutes(): Route[] {
    return [
        {
            path: MyIdAccountSectionRoutesDefs.route('reset-password'),
            loadComponent: () => import('./reset-pwd.component').then(m => m.ResetPwdComponent),
        }
    ]
}