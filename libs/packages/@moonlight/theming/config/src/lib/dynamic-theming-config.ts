import { inject, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { BehaviorSubject } from 'rxjs';
import { ThemeOption } from './theme-options';
import { ThemeTransitionOptions } from './theme-transition-options';
import { ThemeConfigService, ThemeMode, ThemingConfig } from './theming-config';

@Injectable({
  providedIn: 'root'
})
export class DynamicThemeConfigService {

  // Inject the *initial* static config provided via app.config.ts
  private _initialConfig: ThemingConfig = inject(ThemeConfigService);

  //- - - - - - - - - - - - - - - //

  // Hold the theme options in a WritableSignal, initialized from the static config
  // private _themeOptionsSignal: WritableSignal<ThemeOption[]> = signal<ThemeOption[]>([...this._initialConfig.themeOptions]);
  private _systemThemesBs = new BehaviorSubject<ThemeOption[]>([...this._initialConfig.themeOptions]);
  readonly systemThemes$ = this._systemThemesBs.asObservable();
  // Expose a read-only Signal for consumers
  // public readonly themeOptions: Signal<ThemeOption[]> = this._themeOptionsSignal.asReadonly();
  readonly systemThemes = toSignal(this.systemThemes$, { initialValue: this._initialConfig.themeOptions })

  // --- Other config properties (can also be signals if needed) ---
  // For simplicity, let's keep others static for now, read from initialConfig
  public readonly darkModeClass: string = this._initialConfig.darkModeClass;
  public readonly lightModeClass: string = this._initialConfig.lightModeClass;
  public readonly themeClassPrefix: string = this._initialConfig.themeClassPrefix;
  public readonly defaultDarkMode: ThemeMode = this._initialConfig.defaultDarkMode;
  public readonly transitionOptions: ThemeTransitionOptions = this._initialConfig.transitionOptions;

  //------------------------------//

  constructor() {
    // console.log('DynamicThemeConfigService Initialized with:', this._initialConfig.themeOptions);
  }

  //------------------------------//

  /**
   * Updates the list of available system themes.
   * @param themes The new array of ThemeOption objects.
   */
  setSystemThemes(themes: ThemeOption[]): void {
    // console.log('DynamicThemeConfigService: Setting system themes to:', themes);
    this._systemThemesBs.next([...themes]); // Set the signal with a new array copy
  }

  //------------------------------//

  /**
   * Adds a single theme to the current list of system themes.
   * Avoids duplicates based on theme value.
   * @param theme The ThemeOption to add.
   */
  addSystemTheme(theme: ThemeOption): void {

    const currentSystemThemes = this._systemThemesBs.getValue(); // Get the current themes from BehaviorSubject

    if (currentSystemThemes.some(t => t.value === theme.value))
      return  // Already exists, do nothing

    this._systemThemesBs.next([...currentSystemThemes, theme]); // Add new theme to the BehaviorSubject
  }

  //------------------------------//

  /**
   * Resets the system themes back to the initial configuration provided at startup.
   */
  resetSystemThemesToInitial(): void {
    // console.log('DynamicThemeConfigService: Resetting system themes to initial.');
    this._systemThemesBs.next([...this._initialConfig.themeOptions]);
  }

  //------------------------------//

}//Cls