import { Route } from "@angular/router";
import { AccountSectionRoutesDefs } from "../../account-route-defs";

export function confirmEmailRoutes(): Route[] {
    return [
        {
            path: AccountSectionRoutesDefs.route('confirm-email'),
            loadComponent: () => import('./confirm-email.component').then(m => m.ConfirmEmailComponent)
        }
    ]
}