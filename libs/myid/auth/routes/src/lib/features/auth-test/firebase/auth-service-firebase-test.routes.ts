import { Route } from "@angular/router";
import { MyIdAccountSectionRoutesDefs } from "../../../account-route-defs";

export function getAuthTestFirebaseRoutes(): Route[] {
    return [
        {
            path: MyIdAccountSectionRoutesDefs.route('auth-test-firebase'),
            loadComponent: () => import('./auth-service-firebase-test.component').then(m => m.AuthServiceFirebaseTestComponent),
        }
    ]
}