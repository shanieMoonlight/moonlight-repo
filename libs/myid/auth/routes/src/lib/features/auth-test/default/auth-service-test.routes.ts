import { Route } from "@angular/router";
import { AccountSectionRoutesDefs } from "../../../account-route-defs";
export function getMyIdAuthTestRoutes(): Route[] {
    return [
        {
            path: AccountSectionRoutesDefs.route('auth-test'),
            loadComponent: () => import('./auth-service-test.component').then(m => m.AuthServiceTestComponent),
        }
    ]
}