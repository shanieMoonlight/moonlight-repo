import { Route } from "@angular/router";
import { mntcMinimumGuard } from "@spider-baby/myid-auth/guards";
import { MyIdAccountSectionRoutesDefs } from "../../account-route-defs";

export function customersRoutes(authenticate: boolean = true): Route[] {
    return [
        {
            path: MyIdAccountSectionRoutesDefs.route('customers'),
            loadComponent: () => import('./customers.component').then(m => m.CustomersComponent),
            canActivate: authenticate ? [mntcMinimumGuard] : [],
        }
    ]
}