import { Route } from "@angular/router";
import { AccountSectionRoutesDefs } from "../../../account-route-defs";

export function authTestUserMgrAdminRoutes(): Route[] {
    return [
        {
            path: AccountSectionRoutesDefs.route('auth-test-user-mgr-admin'),
            loadComponent: () => import('./user-mgr-admin.component').then(m => m.AuthServiceUserMgrAdminComponent),
        }
    ]
}