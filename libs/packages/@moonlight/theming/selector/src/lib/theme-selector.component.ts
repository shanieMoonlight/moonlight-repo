import { TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
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
    primary: FormControl<string>
    secondary: FormControl<string>
    tertiary: FormControl<string | null>
    error: FormControl<string | null>
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


  private _themeGenerator = inject(ThemeGeneratorService)
  private _fb = inject(FormBuilder)
  private _dialog = inject(MatDialog)
  private _config: ThemeConfig = inject(ThemeConfigService)

  //- - - - - - - - - - - - - - -//

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
    primary: this._fb.nonNullable.control(DEFAULT_COLOR_PRIMARY, [Validators.required]),
    secondary: this._fb.nonNullable.control(DEFAULT_COLOR_SECONDARY, [Validators.required]),
    tertiary: this._fb.control(null),
    error: this._fb.control(null),
    darkMode: this._fb.nonNullable.control(false)
  }) as IThemeForm;

  //-----------------------------//

  protected applyTheme() {

    if (this._themeForm.invalid) {
      console.warn('Theme form is invalid. Cannot apply theme.');
      return; // Don't apply if form is invalid
    }

    const values = this._themeForm.getRawValue(); // Use getRawValue for potentially disabled controls

    // Construct ThemeOption using spread operator and defaults
    const themeToApply: ThemeOption = {
      ...defaultThemeOption, // Start with defaults
      primaryColor: values.primary,
      secondaryColor: values.secondary,
      tertiaryColor: values.tertiary ?? defaultThemeOption.tertiaryColor,
      errorColor: values.error ?? defaultThemeOption.errorColor,
      // Generate a dynamic label/value or use a specific one if needed
      label: 'Custom', // Or generate based on colors
      value: `custom-${Date.now()}`, // Example dynamic value
      fallbackIsDarkMode: values.darkMode // Use the form's dark mode value
    };

    this._themeGenerator.applyTheme(
      themeToApply,
      values.darkMode, // Pass dark mode state separately as applyTheme expects it
      undefined,
      document.documentElement,
    );
  }

  //-----------------------------//

  protected applyPreset(presetValue: ThemeValue) {

    // Find the preset using the input signal
    const presetTheme = this._presetThemes()
      .find(p => p.value === presetValue);

    console.log('applyPreset', presetValue, presetTheme);


    if (!presetTheme) return;

    // Patch the form using ThemeOption property names
    this._themeForm.patchValue({
      primary: presetTheme.primaryColor,
      secondary: presetTheme.secondaryColor,
      tertiary: presetTheme.tertiaryColor,
      error: presetTheme.errorColor,
      // Don't patch darkMode here, let applyTheme handle it based on the preset's fallbackIsDarkMode
    });

    // Pass the full ThemeOption to applyTheme
    this._themeGenerator.applyTheme(
      presetTheme,
      presetTheme.fallbackIsDarkMode, // Use the preset's dark mode preference
      undefined,
      document.documentElement,
      // themeClass is handled internally by applyTheme now based on ThemeOption.value
    );
  }

  //-----------------------------//


  openScssDialog(): void {
    const scssContent = this._themeGenerator.exportThemeAsScss();
    
    if (!scssContent) 
      return
    

    this._exportedScss.set(scssContent);

    this._dialog.open(ScssDisplayComponent, {
      width: '600px',
      data: { scssContent: scssContent},
      autoFocus: false
    });
  }

}//Cls
