import { Component, input } from '@angular/core';

@Component({
    selector: 'sb-user-info-card',
    standalone: true,
    templateUrl: './user-info.component.html',
    styleUrls: ['./user-info.component.scss'],
})
export class UserInfoCardComponent {

    username = input<string | undefined>(undefined); // Default value can be set if needed
    email = input<string | undefined>(undefined);
    teamType = input<string | undefined>(undefined);

}