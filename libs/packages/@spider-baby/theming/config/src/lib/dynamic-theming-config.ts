import { inject, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { BehaviorSubject } from 'rxjs';
import { DarkModeType, ThemeOption } from './theme-options';
import { ThemeTransitionOptions } from './theme-transition-options';
import { ThemeConfigService, ThemingConfig } from './theming-config';

@Injectable({
  providedIn: 'root'
})
export class DynamicThemeConfigService {

  // Inject the *initial* static config provided via app.config.ts
  private _initialConfig: ThemingConfig = inject(ThemeConfigService);

  //- - - - - - - - - - - - - - - //

  private _systemThemesBs = new BehaviorSubject<ThemeOption[]>([...this._initialConfig.themeOptions]);
  readonly systemThemes$ = this._systemThemesBs.asObservable()
  readonly systemThemes = toSignal(this.systemThemes$, { initialValue: this._initialConfig.themeOptions })

  private _defaultDarkModeTypeBs = new BehaviorSubject<DarkModeType>(this._initialConfig.defaultDarkModeType);
  readonly defaultDarkModeType$ = this._defaultDarkModeTypeBs.asObservable()
  public readonly defaultDarkModeType = toSignal(this.defaultDarkModeType$, { initialValue: this._initialConfig.defaultDarkModeType });

  // Dark mode class
  private _darkModeClassBs = new BehaviorSubject<string>(this._initialConfig.darkModeClass);
  readonly darkModeClass$ = this._darkModeClassBs.asObservable();
  readonly darkModeClass = toSignal(this.darkModeClass$, { initialValue: this._initialConfig.darkModeClass });

  // // Light mode class
  // private _lightModeClassBs = new BehaviorSubject<string>(this._initialConfig.lightModeClass);
  // readonly lightModeClass$ = this._lightModeClassBs.asObservable();
  // readonly lightModeClass = toSignal(this.lightModeClass$, { initialValue: this._initialConfig.lightModeClass });

  // Theme class prefix
  private _themeClassPrefixBs = new BehaviorSubject<string>(this._initialConfig.themeClassPrefix);
  readonly themeClassPrefix$ = this._themeClassPrefixBs.asObservable();
  readonly themeClassPrefix = toSignal(this.themeClassPrefix$, { initialValue: this._initialConfig.themeClassPrefix });

  // Transition options
  private _transitionOptionsBs = new BehaviorSubject<ThemeTransitionOptions>(this._initialConfig.transitionOptions);
  readonly transitionOptions$ = this._transitionOptionsBs.asObservable();
  readonly transitionOptions = toSignal(this.transitionOptions$, { initialValue: this._initialConfig.transitionOptions });


  //------------------------------//

  // System themes methods
  setSystemThemes(themes: ThemeOption[]): DynamicThemeConfigService {
    this._systemThemesBs.next([...themes]);
    return this;
  }

  addSystemTheme(theme: ThemeOption): DynamicThemeConfigService {
    const currentSystemThemes = this._systemThemesBs.getValue();
    
    if (currentSystemThemes.some(t => t.value === theme.value))
      return this;

    this._systemThemesBs.next([...currentSystemThemes, theme]);
    return this;
  }

  resetSystemThemesToInitial(): DynamicThemeConfigService {
    this._systemThemesBs.next([...this._initialConfig.themeOptions]);
    return this;
  }

  // Add setter methods for other properties
  setDarkModeClass(darkModeClass: string): DynamicThemeConfigService {
    this._darkModeClassBs.next(darkModeClass);
    return this;
  }

  // setLightModeClass(lightModeClass: string): DynamicThemeConfigService {
  //   this._lightModeClassBs.next(lightModeClass);
  //   return this;
  // }

  setThemeClassPrefix(themeClassPrefix: string): DynamicThemeConfigService {
    this._themeClassPrefixBs.next(themeClassPrefix);
    return this;
  }

  setDefaultDarkMode(defaultDarkMode: DarkModeType): DynamicThemeConfigService {
    this._defaultDarkModeTypeBs.next(defaultDarkMode);
    return this;
  }

  setTransitionOptions(transitionOptions: ThemeTransitionOptions): DynamicThemeConfigService {
    this._transitionOptionsBs.next({ ...transitionOptions });
    return this;
  }

  // Reset all configuration to initial values
  resetAllToInitial(): DynamicThemeConfigService {
    this._systemThemesBs.next([...this._initialConfig.themeOptions]);
    this._darkModeClassBs.next(this._initialConfig.darkModeClass);
    // this._lightModeClassBs.next(this._initialConfig.lightModeClass);
    this._themeClassPrefixBs.next(this._initialConfig.themeClassPrefix);
    this._defaultDarkModeTypeBs.next(this._initialConfig.defaultDarkModeType);
    this._transitionOptionsBs.next(this._initialConfig.transitionOptions );
    return this;
  }
  
}