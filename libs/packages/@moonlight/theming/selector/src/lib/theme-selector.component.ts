import { isPlatformBrowser, TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input, OnDestroy, PLATFORM_ID, signal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { DarkModeType, DEFAULT_COLOR_PRIMARY, DEFAULT_COLOR_SECONDARY, defaultThemeOption, ThemeConfig, ThemeConfigService, ThemeOption } from '@moonlight/ng/theming/config';
import { ThemeGeneratorService, ThemeService } from '@moonlight/ng/theming/service';
import { MatEverythingModule } from '@moonlight/ng/theming/utils';
import { ColorInputComponent } from './ui/cva-color-input.component';
import { ScssDisplayComponent } from './ui/scss-display.component';

//#########################################//

interface IThemeForm
  extends FormGroup<{
    themeName: FormControl<string>; 
    primaryColor: FormControl<string>
    secondaryColor: FormControl<string>
    tertiaryColor: FormControl<string | null>
    errorColor: FormControl<string | null>
    darkMode: FormControl<DarkModeType>
  }> { }

//#########################################//

@Component({
  selector: 'ml-theme-selector',
  imports: [
    ReactiveFormsModule,
    MatEverythingModule,
    TitleCasePipe,
    ColorInputComponent,
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
export class ThemeSelectorComponent implements OnDestroy {

  private _platformId = inject(PLATFORM_ID)
  private _themeGenerator = inject(ThemeGeneratorService)
  private _themeService = inject(ThemeService)
  private _fb = inject(FormBuilder)
  private _dialog = inject(MatDialog)
  private _config: ThemeConfig = inject(ThemeConfigService)

  //- - - - - - - - - - - - - - -//

  private isBrowser = (): boolean =>
    isPlatformBrowser(this._platformId)


  _presetInput = input<ThemeOption[]>(this._config.presetSelectorThemes, { alias: 'presetThemes' });
  // Computed signal handles the fallback. We need this to test the default value. Otherwise, it will be undefined.
  protected _presetThemes = computed(() => {
    const provided = this._presetInput();
    return provided === undefined ? this._config.presetSelectorThemes : provided;
  });

  //- - - - - - - - - - - - - - -//

  protected _generatorPreviewTheme = signal<ThemeOption | null>(null)
  protected _exportedScss = signal<string | null>(null)

  protected _themeForm: IThemeForm = this._fb.group({
    themeName: this._fb.nonNullable.control('My Custom Theme', [Validators.required]), 
    primaryColor: this._fb.nonNullable.control(DEFAULT_COLOR_PRIMARY, [Validators.required]),
    secondaryColor: this._fb.nonNullable.control(DEFAULT_COLOR_SECONDARY, [Validators.required]),
    tertiaryColor: this._fb.control(null),
    errorColor: this._fb.control(null),
    darkMode: this._fb.nonNullable.control<DarkModeType>('system')
  }) as IThemeForm;

  //-----------------------------//
  // LIFECYCLE METHODS
  //-----------------------------//

  ngOnDestroy() {
    // Re-apply the application's actual theme when the component is destroyed
    const currentAppTheme = this._themeService.currentTheme()
    if (currentAppTheme)
      // Directly use the generator to revert styles to the application's theme
      this._themeGenerator.applyTheme(currentAppTheme, undefined)
  }

  //-----------------------------//
  // INTERNAL METHODS
  //-----------------------------//

  protected previewFormTheme(form: IThemeForm) {

    if (form.invalid) {
      console.warn('Theme form is invalid. Cannot apply theme.');
      return // Don't apply if form is invalid
    }

    const values = form.getRawValue(); // Use getRawValue for potentially disabled controls

    
    // Generate a unique value, perhaps combining name and timestamp or just timestamp
    const themeValue = `${values.themeName.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`;

    // Construct ThemeOption using spread operator and defaults
    const themeToApply: ThemeOption = {
      ...defaultThemeOption, // Start with defaults
      label: values.themeName, // <-- Use form value for label
      value: themeValue,       // <-- Use generated unique value
      primaryColor: values.primaryColor,
      secondaryColor: values.secondaryColor,
      tertiaryColor: values.tertiaryColor ?? defaultThemeOption.tertiaryColor,
      errorColor: values.errorColor ?? defaultThemeOption.errorColor,
      darkMode: values.darkMode // Use the form's dark mode value
    };

    this.previewTheme(themeToApply)
  }

  //-----------------------------//

  protected previewPresetTheme(theme: ThemeOption) {

    // Patch the form using ThemeOption property names
    this._themeForm.patchValue({
      primaryColor: theme.primaryColor,
      secondaryColor: theme.secondaryColor,
      tertiaryColor: theme.tertiaryColor,
      errorColor: theme.errorColor,
      darkMode: theme.darkMode,
    })

    this.previewTheme(theme)
  }

  //-----------------------------//

  protected storeTheme = (theme: ThemeOption) =>
    this._themeService.addCustomTheme(theme)


  //-----------------------------//

  protected previewTheme(theme: ThemeOption) {

    if (!theme || !this.isBrowser())
      return;

    // Pass the full ThemeOption to applyTheme
    this._themeGenerator.applyTheme(
      theme,
      undefined,
      document.documentElement
    )

    this._generatorPreviewTheme.set(theme)
  }

  //-----------------------------//
  // PUBLIC API METHODS
  //-----------------------------//

  openScssDialog(theme: ThemeOption): void {

    if (!this.isBrowser())
      return;

    const scssContent = this._themeGenerator.exportThemeAsScss(theme);
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
