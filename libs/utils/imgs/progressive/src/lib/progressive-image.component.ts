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

    _placeholder = input.required<string>({alias: 'placeholder'});
    _alt = input<string>('Progressive Image', {alias: 'alt'});
    _fallbackUrl = input<string | undefined>(undefined, {alias: 'fallbackUrl'});
    _smlToLrgFn = input<((smlImgUrl: string) => string) | undefined>(undefined, {alias: 'smlToLrgFn'});
    _lrgUrl = input<string | null | undefined>('', {alias: 'lrgUrl'});
    _retryTimeoutMs = input<number>(3000, {alias: 'retryTimeoutMs'});
    _retryCount = input<number>(3, {alias: 'retryCount'});
    _objectFit = input<ObjectFit | undefined>('cover', {alias: 'objectFit'});
    _objectPosition = input<string | undefined>(undefined, {alias: 'objectPosition'});
    _imgWidth = input<string | undefined>(undefined, {alias: 'imgWidth'});
    _imgHeight = input<string | undefined>(undefined, {alias: 'imgHeight'});

    //- - - - - - Outputs - - - - - - - - //

    _imgError = output<void>({alias: 'imgError'});

}
