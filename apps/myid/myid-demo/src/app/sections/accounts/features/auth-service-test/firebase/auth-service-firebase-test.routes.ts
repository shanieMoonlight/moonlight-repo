import { Route } from "@angular/router";
import { AccountSectionRoutesDefs } from "../../../account-route-defs";

export function getAuthTestFirebaseRoutes(): Route[] {
    return [
        {
            path: AccountSectionRoutesDefs.route('auth-test-firebase'),
            loadComponent: () => import('./auth-service-firebase-test.component').then(m => m.AuthServiceFirebaseTestComponent),
        }
    ]
}