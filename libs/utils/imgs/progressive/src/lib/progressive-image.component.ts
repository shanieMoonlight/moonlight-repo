/* eslint-disable @angular-eslint/no-output-native */
import { Component, input, output } from '@angular/core';
import { ProgressiveImageLoaderDirective } from './progressive-image-loader.directive';

//##########################################################//

type ObjectFit = 'fill' | 'contain' | 'cover' | 'none' | 'scale-down';


//##########################################################//

@Component({
    selector: 'sb-progressive-image',
    templateUrl: './progressive-image.component.html',
    styleUrls: ['./progressive-image.component.scss'],
    standalone: true,
    imports: [ProgressiveImageLoaderDirective]
})
export class ProgressiveImageComponent {

    //- - - - - - Inputs - - - - - - - - //

    placeholder = input.required<string>();
    alt = input<string>('Progressive Image');
    fallbackUrl = input<string | undefined>(undefined);
    smlToLrgFn = input<((smlImgUrl: string) => string) | undefined>(undefined);
    lrgUrl = input<string | null | undefined>('');
    retryTimeoutMs = input<number>(3000);
    retryCount = input<number>(3);
    objectFit = input<ObjectFit | undefined>('cover');
    objectPosition = input<string | undefined>(undefined);

    //- - - - - - Outputs - - - - - - - - //

    imgError = output<void>();

    // No internal logic needed, defers to ProgressiveImageLoaderDirective
}
