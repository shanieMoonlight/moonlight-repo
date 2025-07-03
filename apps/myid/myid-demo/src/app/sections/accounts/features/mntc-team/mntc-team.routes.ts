import { Route } from "@angular/router";
import { mntcMinimumGuard } from "../../../../shared/id/auth/guards";
import { AccountSectionRoutesDefs } from "../../account-route-defs";

export function mntcTeamRoutes(authenticate: boolean = true): Route[] {
    return [
        {
            path: AccountSectionRoutesDefs.route('mntc-team'),
            loadComponent: () => import('./mntc-team.component').then(m => m.MntcTeamComponent),
            canActivate: authenticate ? [mntcMinimumGuard] : [],
        }
    ]
}