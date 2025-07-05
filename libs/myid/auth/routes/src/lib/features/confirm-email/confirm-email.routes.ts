import { Route } from "@angular/router";
import { MyIdAccountSectionRoutesDefs } from "../../account-route-defs";

export function confirmEmailRoutes(): Route[] {
    return [
        {
            path: MyIdAccountSectionRoutesDefs.route('confirm-email'),
            loadComponent: () => import('./confirm-email.component').then(m => m.ConfirmEmailComponent)
        }
    ]
}