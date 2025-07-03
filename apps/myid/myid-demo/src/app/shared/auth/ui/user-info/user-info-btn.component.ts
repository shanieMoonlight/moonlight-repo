import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { SbButtonIconCloseComponent, SbIconButtonComponent } from '@spider-baby/ui-kit/buttons';
import { AppSvgs } from '../../../../config/svgs';
import { UserInfoCardComponent } from './user-info.component';
import { TitleCasePipe } from '@angular/common';
import { MyIdAuthService } from '../../../id/auth/services/auth/myid-auth.browser.service';

@Component({
    selector: 'sb-user-info-btn',
    standalone: true,
    imports: [
        SbIconButtonComponent,
        SbButtonIconCloseComponent,
        UserInfoCardComponent,
        TitleCasePipe
    ],
    templateUrl: './user-info-btn.component.html',
    styleUrls: ['./user-info-btn.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserInfoButtonComponent {


    _auth = inject(MyIdAuthService)


    protected _userIcon = AppSvgs.USER_ICON;
    protected _username = this._auth.userName
    protected _email = this._auth.email
    protected _teamType = this._auth.teamType

    protected _showInfo = signal(false);
    protected _hideUserButton = computed(() => !this._auth.isLoggedIn() || this._showInfo());
    protected _loggedIn = this._auth.isLoggedIn


    protected closeInfo = () => {

        this._showInfo.set(false);
        console.log('closeInfo', this._showInfo());
    }

    protected openInfo = () => {
        console.log('openInfo');
        this._showInfo.set(true);
        console.log('openInfo', this._showInfo());
    }

}