import { TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, input, signal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { DEFAULT_COLOR_PRIMARY, DEFAULT_COLOR_SECONDARY, DEFAULT_COLOR_TERTIARY } from '@moonlight/ng/theming/config';
import { ThemeGeneratorService } from '@moonlight/ng/theming/service';
import { MatEverythingModule } from '@moonlight/ng/theming/utils';
import { ColorInputComponent } from './ui/cva-color-input.component';
import { ThemeColors } from './models/theme-colors';
import { ScssDisplayComponent } from './ui/scss-display.component';


//#########################################//

interface Theme {
  primary: string,
  secondary: string,
  tertiary: string
}

//-----------------------------------------//

interface ThemeDefinition {
  name: string
  theme: Theme
}

//-----------------------------------------//

// Available themes
const presetThemes: ThemeDefinition[] = [
  {
    name: 'default',
    theme: {
      primary: DEFAULT_COLOR_PRIMARY,
      secondary: DEFAULT_COLOR_SECONDARY,
      tertiary: DEFAULT_COLOR_TERTIARY
    }
  },
  {
    name: 'halloween',
    theme: {
      primary: '#FF7518',
      secondary: '#31004a',
      tertiary: '#556B2F'
    }
  },
  {
    name: 'ocean',
    theme: {
      primary: '#006C7F',
      secondary: '#526773',
      tertiary: '#6C939B'
    }
  },
  {
    name: 'xmas',
    theme: {
      primary: '#C8102E',
      secondary: '#006747',
      tertiary: '#FFD700'
    }
  }
];

//-----------------------------------------//

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

  //- - - - - - - - - - - - - - -//

  _presetThemes = input<ThemeDefinition[]>(presetThemes, { alias: 'presetThemes' });

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

    const values = this._themeForm.value;
    console.log('applyTheme()', values);

    const colors: ThemeColors = {
      primary: values.primary!, //! validators
      secondary: values.secondary!,//! validators
      tertiary: values.tertiary,
      error: values.error
    };

    this._themeGenerator.applyTheme(
      colors,
      document.documentElement,
      values.darkMode)
  }

  //-----------------------------//

  protected applyPreset(presetName: string) {

    const preset = presetThemes
      .find(p => p.name === presetName)?.theme;

    if (!preset) return;

    this._themeForm.patchValue({
      primary: preset.primary,
      secondary: preset.secondary,
      tertiary: preset.tertiary
    });

    this._themeGenerator.applyTheme(
      preset,
      document.documentElement,
      this._themeForm.value.darkMode,
      presetName !== 'default' ? presetName : undefined
    );
  }

  //-----------------------------//


  openScssDialog(): void {
    const scssContent = this._themeGenerator.exportThemeAsScss();
    if (!scssContent) return;
   
    this._exportedScss.set(scssContent);

    this._dialog.open(ScssDisplayComponent, {
      width: '600px',
      data: { scssContent: this._exportedScss() },
      autoFocus: false
    });
  }

}//Cls
