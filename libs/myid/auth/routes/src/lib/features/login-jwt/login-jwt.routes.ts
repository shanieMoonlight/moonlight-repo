import { Route } from "@angular/router";
import { AccountSectionRoutesDefs } from "../../account-route-defs";
import { LoginJwtRouteData, LoginJwtRouteDataOptions } from "./login-jwt.state.service";

export function loginJwtRoutes(options: LoginJwtRouteDataOptions): Route[] {
    return [
        {
            path: AccountSectionRoutesDefs.route('login-jwt'),
            loadComponent: () => import('./login-jwt.component').then(m => m.LoginJwtComponent),
            data: LoginJwtRouteData.create(options),
        }
    ]
}