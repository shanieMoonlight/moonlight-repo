import { Injectable, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { DEFAULT_TRANSITION_DURATION, DEFAULT_TRANSITION_STYLE, DarkModeType, ThemeConfigService, ThemeOption, ThemingConfig, TransitionStyle } from '@spider-baby/material-theming/config';
import { BehaviorSubject } from 'rxjs';
import { SbThemeGeneratorService } from '../generator/theme-generator.service';


@Injectable({
    providedIn: 'root'
})
export class ThemeTransitionService {

    private themeGenerator = inject(SbThemeGeneratorService);
    private _config: ThemingConfig = inject(ThemeConfigService)

    //- - - - - - - - - - - - - - -//

    // Add transition style setting
    private _transitionStyle: TransitionStyle = this._config.transitionOptions.style ?? DEFAULT_TRANSITION_STYLE;

    //- - - - - - - - - - - - - - -//

    // Animation state
    private _isTransitioningBs = new BehaviorSubject<boolean>(false);
    readonly isTransitioning$ = this._isTransitioningBs.asObservable();
    readonly isTransitioning = toSignal(this.isTransitioning$);

    // Default duration in milliseconds
    private _transitionDuration = this._config.transitionOptions.duration ?? DEFAULT_TRANSITION_DURATION;

    // Transition overlay element
    private _overlay: HTMLElement | null = null;

    //-----------------------------//

    /**
     * Performs a smooth transition between themes
     * 
     * @param fromTheme The current theme
     * @param toTheme The target theme
     * @param darkMode Whether dark mode is enabled
     * @param duration Optional custom duration in milliseconds
     */
    // Update transitionThemes method
    transitionThemes(
        fromTheme: ThemeOption | null,
        toTheme: ThemeOption,
        darkMode: DarkModeType,
        duration: number = this._transitionDuration
    ): Promise<void> {

        if (!fromTheme) {
            // If no current theme, just apply immediately
            const themeWithDarkMode = { ...toTheme, darkMode };
            this.themeGenerator.applyTheme(themeWithDarkMode);
            return Promise.resolve();
        }

        this._isTransitioningBs.next(true);

        // Choose transition strategy based on style
        switch (this._transitionStyle) {
            case 'overlay':
                return this._transitionWithOverlay(toTheme, darkMode, duration);
            case 'morph':
                return this._transitionWithMorph(toTheme, darkMode, duration);
            // Add more cases here for future transition styles
            // case 'slide':
            //     return this._transitionWithSlide(toTheme, darkMode, duration);
            default:
                // Optional: Handle unknown style or default to one
                console.warn(`Unknown transition style: ${this._transitionStyle}. Defaulting to overlay.`);
                return this._transitionWithOverlay(toTheme, darkMode, duration);
        }

    }

    //-----------------------------//

    // Move existing overlay logic to a private method
    private _transitionWithOverlay(
        toTheme: ThemeOption,
        darkMode: DarkModeType,
        duration: number
    ): Promise<void> {
        // Your existing overlay transition code here
        this._ensureOverlay();

        // Start with current theme styles
        if (this._overlay) {
            this._overlay.style.opacity = '0';
            this._overlay.style.display = 'block';

            // Force a reflow to ensure the initial state is applied
            void this._overlay.offsetWidth;

            // Create a new theme with the updated darkMode
            const themeWithDarkMode = { ...toTheme, darkMode };

            // Apply new theme to the overlay (correct parameter order)
            this.themeGenerator.applyTheme(themeWithDarkMode, undefined, this._overlay);

            // Fade in the overlay with the new theme
            this._overlay.style.opacity = '1';

            // After overlay is fully visible, apply new theme to document and fade out overlay
            return new Promise<void>(resolve => {
                setTimeout(() => {
                    // Apply the new theme to the document
                    this.themeGenerator.applyTheme(themeWithDarkMode);

                    // Fade out the overlay
                    if (this._overlay) {
                        this._overlay.style.opacity = '0';

                        // When fade out completes, hide overlay and complete transition
                        setTimeout(() => {
                            if (this._overlay)
                                this._overlay.style.display = 'none';

                            this._isTransitioningBs.next(false);
                            resolve();
                        }, duration / 2);
                    }
                }, duration / 2);
            });
        }

        // Fallback
        const themeWithDarkMode = { ...toTheme, darkMode };
        this.themeGenerator.applyTheme(themeWithDarkMode);
        this._isTransitioningBs.next(false);
        return Promise.resolve();
    }

    //- - - - - - - - - - - - - - -//

    // Update _transitionWithMorph to properly use fromTheme
    private _transitionWithMorph(
        toTheme: ThemeOption,
        darkMode: DarkModeType,
        duration: number
    ): Promise<void> {
        const rootElement = document.documentElement;
        const themeWithDarkMode = { ...toTheme, darkMode };

        // 1. First, prepare the document for transitions
        rootElement.classList.add('theme-transitioning');

        // 2. Add the transition style element if it doesn't exist
        let styleEl = document.getElementById('theme-transition-styles');
        if (!styleEl) {
            styleEl = document.createElement('style');
            styleEl.id = 'theme-transition-styles';
            document.head.appendChild(styleEl);
        }

        // 3. Define the transition styles - target specific properties
        styleEl.textContent = `
        .theme-transitioning {
            transition-property: color, background-color, border-color, box-shadow;
            transition-duration: ${duration}ms;
            transition-timing-function: ease-in-out;
        }
        
        .theme-transitioning * {
            transition-property: color, background-color, border-color, box-shadow;
            transition-duration: ${duration}ms;
            transition-timing-function: ease-in-out;
        }
    `;

        // 4. Force a reflow before applying the new theme
        void rootElement.offsetWidth;

        // 5. Apply the new theme which will trigger the transitions
        this.themeGenerator.applyTheme(themeWithDarkMode);

        // 6. Return a promise that resolves when the transition is complete
        return new Promise<void>(resolve => {
            setTimeout(() => {
                // 7. Remove the transition class and styles after transition completes
                rootElement.classList.remove('theme-transitioning');
                if (styleEl) styleEl.textContent = '';

                this._isTransitioningBs.next(false);
                resolve();
            }, duration + 50); // Add a small buffer to ensure transitions complete
        });
    }

    //- - - - - - - - - - - - - - -//

    /**
     * Creates or ensures the overlay element exists in the DOM
     */
    private _ensureOverlay(): void {
        if (!this._overlay) {
            this._overlay = document.createElement('div');
            this._overlay.id = 'theme-transition-overlay';
            this._overlay.style.position = 'fixed';
            this._overlay.style.top = '0';
            this._overlay.style.left = '0';
            this._overlay.style.width = '100%';
            this._overlay.style.height = '100%';
            this._overlay.style.zIndex = '9999';
            this._overlay.style.pointerEvents = 'none';
            this._overlay.style.transition = `opacity ${this._transitionDuration / 2}ms ease-in-out`;
            this._overlay.style.display = 'none';
            this._overlay.style.opacity = '0';
            //   this._overlay.style.background = 'var(--mat-sys-primary)';
            this._overlay.style.background = 'var(--mat-sys-background)';
            document.body.appendChild(this._overlay);
        }
    }

}//Cls