import { Route } from "@angular/router";
import { mntcMinimumGuard } from "@spider-baby/myid-auth/guards";
import { MyIdAccountSectionRoutesDefs } from "../../account-route-defs";

export function customerTeamsRoutes(authenticate: boolean = true): Route[] {
    return [
        {
            path: MyIdAccountSectionRoutesDefs.route('teams'),
            loadComponent: () => import('./teams.component').then(m => m.TeamsTableComponent),
            canActivate: authenticate ? [mntcMinimumGuard] : [],
        }
    ]
}