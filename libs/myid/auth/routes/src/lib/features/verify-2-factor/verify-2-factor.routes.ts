import { Route } from "@angular/router";
import { MyIdAccountSectionRoutesDefs } from "../../account-route-defs";

export function verify2FactorRoutes(): Route[] {
    return [
        {
            path: MyIdAccountSectionRoutesDefs.route('verify-2-factor'),
            loadComponent: () => import('./verify-2-factor.component').then(m => m.Verify2FactorComponent),
        }
    ]
}