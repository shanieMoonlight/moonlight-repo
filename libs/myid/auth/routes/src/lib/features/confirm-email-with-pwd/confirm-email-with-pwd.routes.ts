import { Route } from "@angular/router";
import { MyIdAccountSectionRoutesDefs } from "../../account-route-defs";

export function confirmEmailWithPasswordRoutes(): Route[] {
    return [
        {
            path: MyIdAccountSectionRoutesDefs.route('confirm-email-with-password'),
            loadComponent: () => import('./confirm-email-with-pwd.component').then(m => m.ConfirmEmailWithPwdComponent)
        }
    ]
}