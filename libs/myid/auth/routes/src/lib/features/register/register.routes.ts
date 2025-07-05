import { Route } from "@angular/router";
import { MyIdAccountSectionRoutesDefs } from "../../account-route-defs";
import { RegisterCustomerRouteData, RegisterCustomerRouteDataOptions } from "./register.state.service";

export function registerCustomerRoutes(options: RegisterCustomerRouteDataOptions): Route[] {
    return [
        {
            path: MyIdAccountSectionRoutesDefs.route('register'),
            loadComponent: () => import('./register.component').then(m => m.RegisterCustomerComponent),
            data: RegisterCustomerRouteData.create(options),
        }
    ]
}