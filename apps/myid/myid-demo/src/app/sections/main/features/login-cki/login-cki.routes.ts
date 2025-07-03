import { Route } from "@angular/router";
import { MainSectionRoutesDefs } from "../../main-route-defs";
import { LoginCookieRouteData, LoginCookieRouteDataOptions } from "./login-cki.state.service";

export function loginCookieRoutes(options: LoginCookieRouteDataOptions): Route[] {
    return [
        {
            path: MainSectionRoutesDefs.route('login-cookie'),
            loadComponent: () => import('./login-cki.component').then(m => m.LoginCkiComponent),
            data: LoginCookieRouteData.create(options), 
        }
    ]
}