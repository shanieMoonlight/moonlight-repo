import { Route } from "@angular/router";
import { AccountSectionRoutesDefs } from "../../account-route-defs";
import { LoginCookieRouteData, LoginCookieRouteDataOptions } from "./login-cki.state.service";

export function loginCookieRoutes(options: LoginCookieRouteDataOptions): Route[] {
    return [
        {
            path: AccountSectionRoutesDefs.route('login-cookie'),
            loadComponent: () => import('./login-cki.component').then(m => m.LoginCkiComponent),
            data: LoginCookieRouteData.create(options), 
        }
    ]
}