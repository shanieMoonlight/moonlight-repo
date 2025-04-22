import { Component, computed, DestroyRef, ElementRef, inject, input, OnInit } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { defaultThemeOption, ThemeOption } from '@moonlight/material/theming/config';
import { ThemeGeneratorService } from '@moonlight/material/theming/service';
import { devLog } from '@moonlight/utils/rxjs';
import { combineLatest, debounceTime, distinctUntilChanged, map, startWith, Subject } from 'rxjs';
import { CurrentThemeBannerComponent } from '../../../../../../shared/ui/banner/current-theme-banner.component';
import { LightDarkToggleComponent } from '../../../../../../shared/ui/light-dark-toggle/light-dark-toggle.component';
import { ThemePickerComponent } from '../../../../../../shared/ui/theme-picker/theme-picker.component';


//##########################################################//


export interface ThemeDemoConfig {
  title: string;
  subtitle: string;
  type: 'buttons' | 'info' | 'actions';
  codeExample: string;
  initialTheme?: string; // Theme value to start with
}


//##########################################################//


@Component({
  selector: 'ml-theme-demo-card',
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    MatFormFieldModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatProgressBarModule,
    CurrentThemeBannerComponent,
    MatTooltipModule,
    LightDarkToggleComponent,
    ThemePickerComponent
],
  templateUrl: './theme-demo-card.component.html',
  styleUrl: './theme-demo-card.component.scss',
  host: {
    // '[style.borderColor]': '_currentTheme().primaryColor'
  },
})
export class ThemeDemoCardComponent implements OnInit {

  private componentElementRef = inject(ElementRef);
  private themeGenerator = inject(ThemeGeneratorService);
  private _destroyor = inject(DestroyRef)

  //- - - - - - - - - - - - - - -//

  _config = input.required<ThemeDemoConfig>({ alias: 'config' });
  _availableThemes = input<ThemeOption[]>([], { alias: 'availableThemes' });
  _progressValue = input<number>(60, { alias: 'progressValue' });
  _intialDarkMode = input<boolean>(false, { alias: 'intialDarkMode' });

  //- - - - - - - - - - - - - - -//

  private static componentCount = 0
  private componentThemeClassPrefix = `theme-demo-card-${++ThemeDemoCardComponent.componentCount}`;
  protected _compareThemesFn = (o1: ThemeOption, o2: ThemeOption) => o1.value == o2.value

  //Where do we start?
  protected _initialTheme = computed(() => this._availableThemes()[0] ?? defaultThemeOption)
  protected _initialThemeCombined = computed(() => { return { ...this._initialTheme(), darkMode: this._intialDarkMode() } })


  // We'll manage our own internal state for the card's theme
  protected _changeThemeClick$ = new Subject<ThemeOption>();
  private _currentTheme$ = this._changeThemeClick$
    .pipe(startWith(this._initialTheme()))  //Make sure there's always a value
  protected _currentTheme = toSignal<ThemeOption>(this._currentTheme$);


  protected _changeDarkModeClick$ = new Subject<boolean>()
  private _currentDarkMode$ = this._changeDarkModeClick$
    .pipe(startWith(this._intialDarkMode())) //Make sure there's always a value    
  protected _currentDarkMode = toSignal(this._currentDarkMode$)


  private _currentData$ = combineLatest([this._currentTheme$, this._currentDarkMode$])
    .pipe(
      devLog('ThemeDemoCardComponent:currentData', (data) => data),
      debounceTime(100),
      distinctUntilChanged(),
      map(([themeOption, darkMode]) => {
        const themeWithCurrentDarkMode: ThemeOption = { ...themeOption, darkMode: darkMode }
        return themeWithCurrentDarkMode
      })
    )

  //-----------------------------//

  constructor() {

    this._currentData$.pipe(takeUntilDestroyed(this._destroyor))
      .subscribe(opt => this.applyLocalTheme(opt))
  }

  //-----------------------------//

  ngOnInit(): void {
    this.randomizeLocalTheme() 
  }

  //-----------------------------//

 protected randomizeLocalTheme() {

    const themes = this._availableThemes();
    const randomIndex = Math.floor(Math.random() * themes.length)    
    const randomTheme = themes[randomIndex]

    const randomDarkMode = Math.random() < 0.5
    
    this._changeThemeClick$.next(randomTheme);
    this._changeDarkModeClick$.next(randomDarkMode)    
  }
  
  //-----------------------------//


  protected resetToDefaults() {
    
    this._changeThemeClick$.next(this._initialTheme());
    this._changeDarkModeClick$.next(this._intialDarkMode())    
  }
  
  //-----------------------------//

  private applyLocalTheme(localTheme: ThemeOption) {
    
    this.themeGenerator.applyTheme(
      localTheme,
      `${this.componentThemeClassPrefix}-${localTheme.value}`, //optional
      this.componentElementRef.nativeElement // Apply theme just to this component only
    )
  }


  //-----------------------------//

}

