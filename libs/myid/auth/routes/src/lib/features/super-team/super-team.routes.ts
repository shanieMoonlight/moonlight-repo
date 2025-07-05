import { Route } from "@angular/router";
import { superMinimumGuard } from "@spider-baby/myid-auth/guards";
import { MyIdAccountSectionRoutesDefs } from "../../account-route-defs";

export function superTeamRoutes(authenticate: boolean = true): Route[] {
    return [
        {
            path: MyIdAccountSectionRoutesDefs.route('super-team'),
            loadComponent: () => import('./super-team.component').then(m => m.SuperTeamComponent),
            canActivate: authenticate ? [superMinimumGuard] : [],
        }
    ]
}