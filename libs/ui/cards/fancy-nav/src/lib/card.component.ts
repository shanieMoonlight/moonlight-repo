import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { HubAppImages } from '@sb-hub/core-config/images';

@Component({
    selector: 'sb-hub-fancy-nav-card',
    standalone: true,
    imports: [
        NgClass,
        RouterModule,
        MatCardModule,
        MatIconModule,
        MatButtonModule
    ],
    templateUrl: './card.component.html',
    styleUrl: './card.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SbHubUiFancyNavCardComponent {

    _icon = input.required<string>({ alias: 'icon' });
    _title = input.required<string>({ alias: 'title' });
    _description = input.required<string>({ alias: 'description' });
    _route = input.required<string | string[]>({ alias: 'route' });
    _color = input.required<string | undefined>({ alias: 'color' });
    _img = input<string | undefined>(HubAppImages.Logo.medium, { alias: 'img' });




}
