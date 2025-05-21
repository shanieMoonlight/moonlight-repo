import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { ProgressiveImageLoaderDirective } from './progressive-image-loader.directive';

//##########################################################//

type ObjectFit = 'fill' | 'contain' | 'cover' | 'none' | 'scale-down';


//##########################################################//

function sanitizeTransitionId(value: string | undefined): string | undefined {
    if (!value?.trim())
        return undefined

    let sanitized = String(value);
    // Replace slashes with hyphens
    sanitized = sanitized.replace(/\//g, '-');
    // Replace any character that is not a letter, number, or hyphen with a hyphen
    sanitized = sanitized.replace(/[^a-zA-Z0-9-]/g, '-');
    // Collapse multiple consecutive hyphens into a single hyphen
    sanitized = sanitized.replace(/-{2,}/g, '-');
    // Remove leading or trailing hyphens
    sanitized = sanitized.replace(/^-+|-+$/g, '');
    // If the sanitization results in an empty string, return undefined
    return sanitized === '' ? undefined : sanitized;
}

//##########################################################//

@Component({
    selector: 'sb-progressive-image',
    templateUrl: './progressive-image.component.html',
    styleUrls: ['./progressive-image.component.scss'],
    standalone: true,
    imports: [ProgressiveImageLoaderDirective],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProgressiveImageComponent {

    //- - - - - - Inputs - - - - - - - - //

    _placeholder = input.required<string>({ alias: 'placeholder' });
    _alt = input<string>('Progressive Image', { alias: 'alt' });
    _fallbackUrl = input<string | undefined>(undefined, { alias: 'fallbackUrl' });
    _smlToLrgFn = input<((smlImgUrl: string) => string) | undefined>(undefined, { alias: 'smlToLrgFn' });
    _lrgUrl = input<string | null | undefined>('', { alias: 'lrgUrl' });
    _retryTimeoutMs = input<number>(3000, { alias: 'retryTimeoutMs' });
    _retryCount = input<number>(3, { alias: 'retryCount' });
    _objectFit = input<ObjectFit | undefined>('cover', { alias: 'objectFit' });
    _objectPosition = input<string | undefined>(undefined, { alias: 'objectPosition' });
    _imgWidth = input<string | undefined>(undefined, { alias: 'imgWidth' });
    _imgHeight = input<string | undefined>(undefined, { alias: 'imgHeight' });

    _transitionId = input(
        'test-transition-id' as (string | undefined), // Cast initialValue
        {
            alias: 'transitionId',
            transform: sanitizeTransitionId
        }
    );

    //- - - - - - Outputs - - - - - - - - //

    _imgError = output<void>({ alias: 'imgError' });

}
