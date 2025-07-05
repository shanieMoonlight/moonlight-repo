import { Route } from "@angular/router";
import { MyIdAccountSectionRoutesDefs } from "../../account-route-defs";

export function confirmPhoneRoutes(): Route[] {
    return [
        {
            path: MyIdAccountSectionRoutesDefs.route('confirm-phone'),
            loadComponent: () => import('./confirm-phone.component').then(m => m.ConfirmPhoneComponent)
        }
    ]
}