import { ChangeDetectionStrategy, Component, inject, OnInit, computed, signal } from '@angular/core'
import { MatExpansionModule } from '@angular/material/expansion'
import { MatTabsModule } from '@angular/material/tabs'
import { Router } from '@angular/router'
import { SeoService } from '@spider-baby/utils-seo'
import { HighlightModule } from 'ngx-highlightjs'
import { THEME_SERVICE_METHODS } from './service-methods-docs'
import { THEME_SERVICE_PROPERTIES } from './service-props-docs'

//##############################################//


const BASIC_USAGE_EXAMPLE = `import { Component, inject } from '@angular/core'
import { ThemeService } from '@spider-baby/material-theming/service'

@Component({
  selector: 'app-theme-demo',
 template: \`
    <button (click)="toggleDarkMode()">Toggle Dark Mode</button>

    <mat-form-field appearance="outline">
      <mat-label>Choose Component Theme</mat-label>
      <mat-select (valueChange)="changeTheme($event)">
        @for (theme of _dynamicThemes track theme.value) {
          <mat-option [value]="theme">
            {{ theme.label }}
          </mat-option>
        }
      </mat-select>
  </mat-form-field>

  <mat-form-field appearance="outline">
      <mat-label>Choose System Theme</mat-label>
      <mat-select (valueChange)="changeTheme($event)">
        @for (theme of _allSystemThemes track theme.value) {
          <mat-option [value]="theme">
            {{ theme.label }}
          </mat-option>
        }
      </mat-select>
  </mat-form-field>

  Current Global Theme: {{_themeService.currentTheme().value}}
  \`
})
export class ThemeDemoTesterComponent {
  protected _themeService = inject(ThemeService)

  _dynamicThemes = [
    ThemeOption.create({
      darkMode: 'system',
      label: 'SpecialTheme1',
      value: 'special-theme1',
      primaryColor: '#4682B4',
      secondaryColor: '#D2691E'
    }),
    ThemeOption.create({
      darkMode: 'system',
      label: 'SpecialTheme2',
      value: 'special-theme2',
      primaryColor: '#FB3640',
      secondaryColor: '#1976D2'
    }),
    //..Define your custom themes here
  ]

  _allSystemThemes = this._themeService.availableThemes()


  toggleDarkMode() {
    const isDark = this._themeService.isDarkMode()
    this._themeService.setDarkMode(isDark ? 'light' : 'dark')
  }


  changeTheme = (theme: ThemeOption) =>
    this._themeService.applyTheme(theme) //<--- set Dynamic theme. Specify element if you don't want to apply global theme

}`

const LOCAL_THEMING_EXAMPLE = `import { Component, ElementRef, inject, ViewChild } from '@angular/core'
import { ThemeService } from '@spider-baby/material-theming/service'

@Component({
  selector: 'app-local-theme-demo',
    template: \`
    <div class="container">
      <div #localThemeArea 
        class="themed-area" 
        style="background-color: var(--mat-sys-surface) color: var(--mat-sys-on-primary) border:1px solid red">
        
        <h1 style="background-color: var(--mat-sys-primary) color: var(--mat-sys-on-primary)">This area has its own theme!</h1>
        
      </div>
    <button (click)="toggleDarkMode()">Toggle Dark Mode</button>
    <mat-form-field appearance="outline">
      <mat-label>Choose Component Theme</mat-label>
      <mat-select (valueChange)="changeTheme($event)">
        @for (theme of _dynamicThemes track theme.value) {
          <mat-option [value]="theme">
            {{ theme.label }}
          </mat-option>
        }
      </mat-select>
  </mat-form-field>

  <mat-form-field appearance="outline">
      <mat-label>Choose System Theme</mat-label>
      <mat-select (valueChange)="changeTheme($event)">
        @for (theme of _allSystemThemes track theme.value) {
          <mat-option [value]="theme">
            {{ theme.label }}
          </mat-option>
        }
      </mat-select>
  </mat-form-field>
  </div>

  Current Local Theme: {{_currentTheme.value}}
  \`
})
export class ThemeDemoLocalTesterComponent {

  protected _themeService = inject(ThemeService)
  private _componentElementRef = inject(ElementRef)

  _dynamicThemes = [
    ThemeOption.create({
      darkMode: 'light',
      label: 'SpecialTheme1',
      value: 'special-theme1',
      primaryColor: '#4682B4',
      secondaryColor: '#D2691E',
    }),
    ThemeOption.create({
      darkMode: 'light',
      label: 'SpecialTheme2',
      value: 'special-theme2',
      primaryColor: '#FB3640',
      secondaryColor: '#1976D2'
    }),
    //..Define your custom themes here
  ]

  protected _allSystemThemes = this._themeService.availableThemes()

  protected _currentTheme = this._dynamicThemes[0]

  
  constructor() {
    this.changeTheme (this._currentTheme)    
  }


  toggleDarkMode() {
    const newDarkMode :DarkModeType= this._currentTheme.darkMode === 'dark' ? 'light' : 'dark'
    const newTheme = { ...this._currentTheme, darkMode: newDarkMode }
    this.changeTheme(newTheme) // Apply the theme change
  }


  changeTheme = (theme: ThemeOption) => {
    this._currentTheme = theme // Update the current theme
    return this._themeService.applyTheme(theme, this._componentElementRef.nativeElement) //<--- Set Dynamic theme to the specific element
  }

}`

const CUSTOM_THEMES_EXAMPLE = `import { Component, inject } from '@angular/core'
import { ThemeService } from '@spider-baby/material-theming/service'
import { ThemeOption } from '@spider-baby/material-theming/config'

@Component({
  selector: 'app-custom-theme-demo',
  template: \`
    <button (click)="createCustomTheme()">Create Custom Theme</button>
    <button (click)="applyCustomTheme()" [disabled]="!hasCustomTheme">Apply Custom Theme</button>
  \`
})
export class CustomThemeDemoComponent {
  private themeService = inject(ThemeService)
  
  get hasCustomTheme(): boolean {
    return this.themeService.customThemes().some(t => t.value === 'custom-sunset')
  }
  
  createCustomTheme() {
    const customTheme = ThemeOption.create({
      value: 'custom-sunset',
      label: 'Sunset Theme',
      primaryColor: '#FF5722',
      secondaryColor: '#FFC107',
      tertiaryColor: '#795548'
    })
    
    this.themeService.addCustomTheme(customTheme) //<--add to system
  }

  
  applyCustomTheme() {
    this.themeService.setThemeByValue('custom-sunset')
  }
}`


//##############################################//

@Component({
  standalone: true,
  selector: 'sb-api-theme-service-api',
  templateUrl: './theme-service-api.component.html',
  styleUrls: ['./theme-service-api.component.scss'],
  imports: [
    MatExpansionModule,
    MatTabsModule,
    HighlightModule,
    // ThemeDemoBasicTesterComponent,
    // ThemeDemoLocalTesterComponent
  ],
  providers: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThemeServiceApiComponent implements OnInit {

  private _seoService = inject(SeoService)
  private _router = inject(Router)

  //-----------------------------//

  ngOnInit() {
    // Set SEO metadata specific to the Theme Service API page
    this._seoService.updateMetadata({
      title: 'Theme Service API - SpiderBaby Material Theming',
      description: 'Comprehensive documentation for the SpiderBaby ThemeService API. Learn how to manipulate themes, toggle dark mode, and create custom themes for Angular Material.',
      url: this._router.url,
    })
  }

  //-----------------------------//


  protected _serviceProperties = signal(THEME_SERVICE_PROPERTIES)
  protected _serviceMethods = signal(THEME_SERVICE_METHODS)

  // --- Signal-based code examples ---
  protected basicUsageExample = computed(() => BASIC_USAGE_EXAMPLE)
  protected localThemingExample = computed(() => LOCAL_THEMING_EXAMPLE)
  protected customThemesExample = computed(() => CUSTOM_THEMES_EXAMPLE)
}