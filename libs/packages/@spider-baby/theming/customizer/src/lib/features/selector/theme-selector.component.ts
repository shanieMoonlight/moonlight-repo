import { isPlatformBrowser, TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input, OnDestroy, PLATFORM_ID, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { DarkModeType, DEFAULT_COLOR_PRIMARY, DEFAULT_COLOR_SECONDARY, defaultThemeOption, ThemeConfigService, ThemeOption, ThemingConfig } from '@spider-baby/material-theming/config';
import { ScssPaletteGeneratorService, ThemeService } from '@spider-baby/material-theming/service';
import { consoleDev, MatEverythingModule } from '@spider-baby/material-theming/utils';
import { map } from 'rxjs';
import { ColorInputComponent } from '../../ui/cva-color-input.component';
import { ScssDisplayComponent } from '../../ui/scss-display.component';
import { MlCustomThemeManagerComponent } from "../custom-theme-mgr/custom-theme-mgr.component";
import { MlCustomThemeSavedComponent } from '../theme-saved/theme-saved.component';

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

/**
 * A comprehensive theme selector component for customizing and creating themes.
 * 
 * This component provides a UI for:
 * - Browsing preset themes
 * - Creating custom themes with color pickers
 * - Previewing themes before applying
 * - Generating SCSS variables for theme integration
 * - Managing saved custom themes
 * 
 * @example
 * ```html
 * <!-- Basic usage with default preset themes -->
 * <sb-theme-selector></sb-theme-selector>
 * 
 * <!-- With custom preset themes -->
 * <sb-theme-selector [presetThemes]="myPresetThemes"></sb-theme-selector>
 * ```
 */
@Component({
  selector: 'sb-theme-selector',
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
export class MlThemeSelectorComponent implements OnDestroy {

  private _platformId = inject(PLATFORM_ID)
  private _themeService = inject(ThemeService)
  private _scssPalettes = inject(ScssPaletteGeneratorService)
  private _fb = inject(FormBuilder)
  private _dialog = inject(MatDialog)
  private _config: ThemingConfig = inject(ThemeConfigService)

  //- - - - - - - - - - - - - - -//

  /**
   * Input to customize the preset themes available in the selector.
   * If not provided, the default preset themes from ThemeConfig will be used.
   */
  _presetInput = input<ThemeOption[]>(this._config.presetCustomizerThemes, { alias: 'presetThemes' });
  // Computed signal handles the fallback. We need this to test the default value. Otherwise, it will be undefined.
  protected _presetThemes = computed(() => {
    const provided = this._presetInput();
    return provided === undefined ? this._config.presetCustomizerThemes : provided;
  });

  //- - - - - - - - - - - - - - -//

  protected _generatorPreviewTheme = signal<ThemeOption | null>(null)
  protected _exportedScss = signal<string | null>(null)
  private _anyCustomThemes$ = this._themeService.customThemes$
    .pipe(map(customThemes => customThemes.length > 0))
  protected _anyCustomThemes = toSignal(this._anyCustomThemes$)

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
    this._themeService.reapplyCurrentTheme()
  }

  //-----------------------------//
  // INTERNAL METHODS
  //-----------------------------//

  /**
 * Previews a theme based on the current form values.
 * Applies the theme to the document but doesn't save it.
 * 
 * @param form The theme form containing color and name values
 */
  protected previewFormTheme(form: IThemeForm) {

    consoleDev.log('Previewing theme with form values:', form.value);


    if (form.invalid) {
      console.warn('Theme form is invalid. Cannot apply theme.');
      return // Don't apply if form is invalid
    }

    const values = form.getRawValue(); // Use getRawValue for potentially disabled controls

    // Generate a safe value. If it
    const themeValue = `${values.themeName.toLowerCase().replace(/\s+/g, '-')}}`;

    // Construct ThemeOption using spread operator and defaults
    const themeToApply: ThemeOption = {
      ...defaultThemeOption,
      label: values.themeName,
      value: themeValue,
      primaryColor: values.primaryColor,
      secondaryColor: values.secondaryColor,
      tertiaryColor: values.tertiaryColor ?? defaultThemeOption.tertiaryColor,
      errorColor: values.errorColor ?? defaultThemeOption.errorColor,
      darkMode: values.darkMode // Use the form's dark mode value
    }

    this.previewTheme(themeToApply)
  }

  //-----------------------------//

  /**
   * Previews a preset theme and updates the form values to match.
   * 
   * @param theme The preset theme to preview
   */
  protected previewPresetTheme(theme: ThemeOption) {

    // Patch the form using ThemeOption property names
    this._themeForm.patchValue({
      primaryColor: theme.primaryColor,
      secondaryColor: theme.secondaryColor,
      tertiaryColor: theme.tertiaryColor,
      errorColor: theme.errorColor,
      darkMode: theme.darkMode,
      themeName: `${theme.value}`,
    })

    this.previewTheme(theme)
  }

  //-----------------------------//

  /**
   * Saves a custom theme to local storage and shows a confirmation dialog.
   * 
   * @param theme The theme to save
   */
  protected storeTheme(theme: ThemeOption) {
    this._themeService.addCustomTheme(theme);

    this._dialog.open(MlCustomThemeSavedComponent, {
      width: '400px', // Adjust width as needed
      data: { theme: theme }, // Pass the theme data
      autoFocus: 'dialog' // Focus the dialog itself initially
    });
  }


  //-----------------------------//

  /**
   * Applies a theme to the document for preview purposes.
   * 
   * @param theme The theme to preview
   */
  protected previewTheme(theme: ThemeOption) {

    if (!theme || !this.isBrowser())
      return;

    // Pass the full ThemeOption to applyTheme
    this._themeService.applyTheme(theme)

    this._generatorPreviewTheme.set(theme)
  }

  //-----------------------------//

  /**
   * Opens a dialog displaying the SCSS variables for the selected theme.
   * 
   * @param theme The theme to export as SCSS
   */
  protected openScssDialog(theme: ThemeOption): void {

    if (!this.isBrowser())
      return;

    const scssContent = this._scssPalettes.exportThemeAsScss(theme);
    if (!scssContent)
      return

    this._exportedScss.set(scssContent);

    this._dialog.open(ScssDisplayComponent, {
      width: '600px',
      data: { scssContent: scssContent },
      autoFocus: false
    });
  }

  //-----------------------------//

  /**
   * Opens the custom theme manager dialog.
   */
  protected manageCustomThemes(): void {

    if (!this.isBrowser())
      return;

    this._dialog.open(MlCustomThemeManagerComponent, {
      width: '600px',
      autoFocus: false
    });
  }

  //-----------------------------//

  private isBrowser = (): boolean =>
    isPlatformBrowser(this._platformId)


}//Cls
