import { Route } from "@angular/router";
import { superMinimumGuard } from "../../../../shared/id/auth/guards";
import { AccountSectionRoutesDefs } from "../../account-route-defs";

export function superTeamRoutes(authenticate: boolean = true): Route[] {
    return [
        {
            path: AccountSectionRoutesDefs.route('super-team'),
            loadComponent: () => import('./super-team.component').then(m => m.SuperTeamComponent),
            canActivate: authenticate ? [superMinimumGuard] : [],
        }
    ]
}