import { Route } from "@angular/router";
import { AccountSectionRoutesDefs } from "../../account-route-defs";

export function update2FactorRoutes(): Route[] {
    return [
        {
            path: AccountSectionRoutesDefs.route('update-2-factor'),
            loadComponent: () => import('./update-2-factor.component').then(m => m.Update2FactorComponent),
        }
    ]
}