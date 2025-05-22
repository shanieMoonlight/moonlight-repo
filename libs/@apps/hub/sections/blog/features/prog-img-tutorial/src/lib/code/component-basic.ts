export const ComponentBasicCode = `@Component({
    selector: 'sb-progressive-image',
    templateUrl: './progressive-image.component.html',
    styleUrls: ['./progressive-image.component.scss'],
    standalone: true,
    imports: [ProgressiveImageLoaderDirective],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class  SbProgressiveImageComponent {
    // Required input for small/placeholder image
    _placeholder = input.required<string>({ alias: 'placeholder' });
    
    // Optional inputs with default values
    _alt = input<string>('Progressive Image', { alias: 'alt' });
    _fallbackUrl = input<string | undefined>(undefined, { alias: 'fallbackUrl' });
    _smlToLrgFn = input<((smlImgUrl: string) => string) | undefined>(undefined, { alias: 'smlToLrgFn' });
    _lrgUrl = input<string | null | undefined>('', { alias: 'lrgUrl' });
    _retryTimeoutMs = input<number>(3000, { alias: 'retryTimeoutMs' });
    _retryCount = input<number>(3, { alias: 'retryCount' });
    
    // Styling inputs
    _objectFit = input<ObjectFit | undefined>('cover', { alias: 'objectFit' });
    _objectPosition = input<string | undefined>(undefined, { alias: 'objectPosition' });
    _imgWidth = input<string | undefined>(undefined, { alias: 'imgWidth' });
    _imgHeight = input<string | undefined>(undefined, { alias: 'imgHeight' });
    
    // For view transitions API
    _transitionId = input(undefined as string | undefined, {
        alias: 'transitionId',
        transform: sanitizeTransitionId
    });
    
    // Output for error handling
    _imgError = output<void>({ alias: 'imgError' });
}`
