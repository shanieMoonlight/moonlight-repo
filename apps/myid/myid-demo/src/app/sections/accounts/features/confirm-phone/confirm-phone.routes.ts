import { Route } from "@angular/router";
import { AccountSectionRoutesDefs } from "../../account-route-defs";

export function confirmPhoneRoutes(): Route[] {
    return [
        {
            path: AccountSectionRoutesDefs.route('confirm-phone'),
            loadComponent: () => import('./confirm-phone.component').then(m => m.ConfirmPhoneComponent)
        }
    ]
}