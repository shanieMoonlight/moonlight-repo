import { Route } from "@angular/router";
import { MyIdAccountSectionRoutesDefs } from "../../../account-route-defs";
export function getMyIdAuthTestRoutes(): Route[] {
    return [
        {
            path: MyIdAccountSectionRoutesDefs.route('auth-test'),
            loadComponent: () => import('./auth-service-test.component').then(m => m.AuthServiceTestComponent),
        }
    ]
}