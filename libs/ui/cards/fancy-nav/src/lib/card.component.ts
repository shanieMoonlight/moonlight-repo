import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { HubAppImages } from '@sb-hub/core-config/images';
import { ProgImgLoaderFunctions, ProgressiveImageComponent } from '@spider-baby/utils-img/progressive';


//##########################################################//

const defaultSmallToLargeImgFn = ProgImgLoaderFunctions.replaceSegment('placeholder', 'large')

//##########################################################//


@Component({
    selector: 'sb-hub-fancy-nav-card',
    standalone: true,
    imports: [
        NgClass,
        RouterModule,
        MatCardModule,
        MatIconModule,
        ProgressiveImageComponent,
        MatButtonModule
    ],
    templateUrl: './card.component.html',
    styleUrl: './card.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HubUiFancyNavCardComponent {

    _icon = input.required<string>({ alias: 'icon' });
    _title = input.required<string>({ alias: 'title' });
    _description = input.required<string>({ alias: 'description' });
    _route = input<string | string[] | undefined>(undefined, { alias: 'route' });
    _url = input<string | undefined>(undefined, { alias: 'url' });
    _color = input<string | undefined>('primary', { alias: 'color' });
    _img = input<string | undefined>(HubAppImages.Logo.medium, { alias: 'img' });

    
  /**
   * A function that converts a small image URL to a large image URL.
   * This property allows for progressive image loading by providing a smaller placeholder image initially
   * and using this function to replace it with a larger, higher quality image after loading.
   * 
   * @param smlImgUrl - The URL of the small/placeholder image
   * @returns The URL of the corresponding large/high-quality image
   * @default defaultSmallToLargeImgFn - A default function that replaces small image URLs with large ones (ProgImgLoaderFunctions.replaceSegment('placeholder', 'xlarge'))
   */
  _smlToLrgFn = input<((smlImgUrl: string) => string) | undefined>(defaultSmallToLargeImgFn, { alias: 'smlToLrgFn' });




}
