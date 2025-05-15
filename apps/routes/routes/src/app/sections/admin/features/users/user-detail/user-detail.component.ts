import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MatEverythingModule } from '@spider-baby/utils-mat-everything';
import { AppRouteDefs } from '../../../../../app-route-defs';
import { AppImages1 } from '../../../../../config/images';
import { HeroBannerComponent } from '../../../../../shared/ui/banner/hero-banner.component';

@Component({
    selector: 'rd-admin-user-detail',
    standalone: true,
    imports: [
        MatEverythingModule,
        RouterModule,
        HeroBannerComponent
    ],
    templateUrl: './user-detail.component.html',
    styleUrl: './user-detail.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminUserDetailComponent {

    private _router = inject(Router);

    //- - - - - - - - - - - - - - -//

    _id = input<string>('', { alias: 'id' });

    //- - - - - - - - - - - - - - -//

    protected _title = computed(() => `User Detail: ${this._id()}`);
    protected _subtitle = 'Detailed information about a user';
    protected _description = `This section provides detailed information about a specific user, including their profile, activity, and settings.`;
    protected _heroImageUrl = AppImages1.Logo.small
    protected _heroImageAlt = 'User Detail';

    //-----------------------------//

    backToUsers() {
        this._router.navigate([AppRouteDefs.fullPaths.admin.route('users')]);
    }

    

}
