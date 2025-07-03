import { Route } from "@angular/router";
import { AccountSectionRoutesDefs } from "../../account-route-defs";

export function confirmEmailWithPasswordRoutes(): Route[] {
    return [
        {
            path: AccountSectionRoutesDefs.route('confirm-email-with-password'),
            loadComponent: () => import('./confirm-email-with-pwd.component').then(m => m.ConfirmEmailWithPwdComponent)
        }
    ]
}