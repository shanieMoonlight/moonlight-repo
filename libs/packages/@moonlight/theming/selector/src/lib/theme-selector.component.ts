import { isPlatformBrowser, TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input, PLATFORM_ID, signal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { DEFAULT_COLOR_PRIMARY, DEFAULT_COLOR_SECONDARY, ThemeConfig, ThemeConfigService, ThemeOption, ThemeValue, defaultThemeOption } from '@moonlight/ng/theming/config';
import { ThemeGeneratorService } from '@moonlight/ng/theming/service';
import { MatEverythingModule } from '@moonlight/ng/theming/utils';
import { ColorInputComponent } from './ui/cva-color-input.component';
import { ScssDisplayComponent } from './ui/scss-display.component';

//#########################################//

interface IThemeForm
  extends FormGroup<{
    primaryColor: FormControl<string>
    secondaryColor: FormControl<string>
    tertiaryColor: FormControl<string | null>
    errorColor: FormControl<string | null>
    darkMode: FormControl<boolean>
  }> { }

//#########################################//

@Component({
  selector: 'ml-theme-selector',
  imports: [
    ReactiveFormsModule,
    MatEverythingModule,
    TitleCasePipe,
    ColorInputComponent
  ],
  providers: [
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: {
        appearance: 'outline',
        floatLabel: 'always',
      }
    }
  ],
  templateUrl: './theme-selector.component.html',
  styleUrl: './theme-selector.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThemeSelectorComponent {

  private _platformId = inject(PLATFORM_ID)
  private _themeGenerator = inject(ThemeGeneratorService)
  private _fb = inject(FormBuilder)
  private _dialog = inject(MatDialog)
  private _config: ThemeConfig = inject(ThemeConfigService)

  //- - - - - - - - - - - - - - -//

  private isBrowser(): boolean {
    return isPlatformBrowser(this._platformId)
  }

  _presetInput = input<ThemeOption[]>(this._config.presetSelectorThemes, { alias: 'presetThemes' });
  // Computed signal handles the fallback. We need this to test the default value. Otherwise, it will be undefined.
  protected _presetThemes = computed(() => {
    const provided = this._presetInput();
    return provided === undefined ? this._config.presetSelectorThemes : provided;
  });

  //- - - - - - - - - - - - - - -//

  protected _currentTheme = this._themeGenerator.currentTheme;
  protected _exportedScss = signal<string | null>(null);

  protected _themeForm: IThemeForm = this._fb.group({
    primaryColor: this._fb.nonNullable.control(DEFAULT_COLOR_PRIMARY, [Validators.required]),
    secondaryColor: this._fb.nonNullable.control(DEFAULT_COLOR_SECONDARY, [Validators.required]),
    tertiaryColor: this._fb.control(null),
    errorColor: this._fb.control(null),
    darkMode: this._fb.nonNullable.control(false)
  }) as IThemeForm;

  //-----------------------------//
  // INTERNAL METHODS
  //-----------------------------//

  protected applyFormTheme(form: IThemeForm) {

    if (form.invalid) {
      console.warn('Theme form is invalid. Cannot apply theme.');
      return; // Don't apply if form is invalid
    }

    const values = form.getRawValue(); // Use getRawValue for potentially disabled controls

    // Construct ThemeOption using spread operator and defaults
    const themeToApply: ThemeOption = {
      ...defaultThemeOption, // Start with defaults
      primaryColor: values.primaryColor,
      secondaryColor: values.secondaryColor,
      tertiaryColor: values.tertiaryColor ?? defaultThemeOption.tertiaryColor,
      errorColor: values.errorColor ?? defaultThemeOption.errorColor,
      // Generate a dynamic label/value or use a specific one if needed
      label: 'Custom', // Or generate based on colors
      value: `custom-${Date.now()}`, // Example dynamic value
      fallbackIsDarkMode: values.darkMode // Use the form's dark mode value
    };

    this.applyTheme(themeToApply)
  }

  //-----------------------------//

  protected applyPresetTheme(theme: ThemeOption) {
    if (!theme) return;

    // Patch the form using ThemeOption property names
    this._themeForm.patchValue({
      primaryColor: theme.primaryColor,
      secondaryColor: theme.secondaryColor,
      tertiaryColor: theme.tertiaryColor,
      errorColor: theme.errorColor,
      darkMode: theme.fallbackIsDarkMode,
    })
    
    this.applyTheme(theme)
  }

  //-----------------------------//

  protected applyTheme(theme: ThemeOption) {

    if (!theme || !this.isBrowser())
      return;

    // Pass the full ThemeOption to applyTheme
    this._themeGenerator.applyTheme(
      theme,
      undefined,
      document.documentElement
    )
  }

  //-----------------------------//
  // PUBLIC API METHODS
  //-----------------------------//

  openScssDialog(): void {
    const scssContent = this._themeGenerator.exportThemeAsScss();

    if (!scssContent)
      return

    this._exportedScss.set(scssContent);

    this._dialog.open(ScssDisplayComponent, {
      width: '600px',
      data: { scssContent: scssContent },
      autoFocus: false
    });
  }

}//Cls
