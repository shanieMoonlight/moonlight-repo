import { Route } from "@angular/router";
import { MyIdAccountSectionRoutesDefs } from "../../account-route-defs";

export function verify2FactorCookieRoutes(): Route[] {
    return [
        {
            path: MyIdAccountSectionRoutesDefs.route('verify-2-factor-cookie'),
            loadComponent: () => import('./verify-2-factor-cki.component').then(m => m.Verify2FactorCookieComponent),
        }
    ]
}