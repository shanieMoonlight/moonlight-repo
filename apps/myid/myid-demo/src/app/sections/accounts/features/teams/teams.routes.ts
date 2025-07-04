import { Route } from "@angular/router";
import { mntcMinimumGuard } from "../../../../shared/id/auth/guards";
import { AccountSectionRoutesDefs } from "../../account-route-defs";

export function customerTeamsRoutes(authenticate: boolean = true): Route[] {
    return [
        {
            path: AccountSectionRoutesDefs.route('customer-teams'),
            loadComponent: () => import('./teams-table.component').then(m => m.TeamsTableComponent),
            canActivate: authenticate ? [mntcMinimumGuard] : [],
        }
    ]
}