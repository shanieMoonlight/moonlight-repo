import { ChangeDetectionStrategy, Component, inject, signal, input, computed } from '@angular/core';
import { MyIdAuthService } from '../../services/auth/myid-auth.browser.service';
import { NgStyle, TitleCasePipe } from '@angular/common';

//###############################//

export type TeamStyle = {
    color: string;
    background: string;
}


export const TEAM_COLORS: Record<string, TeamStyle> = {
    super: { color: '#fff', background: '#3f51b5' },
    maintenance: { color: '#fff', background: '#388e3c' },
    customer: { color: '#fff', background: '#fbc02d' },
    default: { color: '#fff', background: '#757575' },
};

//###############################//

@Component({
    selector: 'sb-team-badge',
    standalone: true,
    imports: [TitleCasePipe, NgStyle],
    templateUrl: './team-badge.component.html',
    styleUrls: ['./team-badge.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TeamBadgeComponent {

    auth = inject(MyIdAuthService);


    protected _teamType = this.auth.teamType;
    protected _isLoggedIn = this.auth.isLoggedIn;


    protected _badgeStyles = computed(() => {
        const t = (this._teamType() || '').toLowerCase();
        return TEAM_COLORS[t] || TEAM_COLORS['default'];
    })
}
