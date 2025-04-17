import { TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ColorInputComponent } from '../../ui/cva-color-input/cva-color-input.component';
import { MatEverythingModule } from '../../utils/mat-everything-modules';
import { ThemeColors } from '../theme-colors';
import { ThemeShowcaseMatComponent } from '../theme-showcase-mat/theme-showcase-mat.component';
import { ThemeGeneratorService } from './services/theme-generator.service';


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
      primary: '#6750A4',
      secondary: '#958DA5',
      tertiary: '#B58392'
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
    ColorInputComponent,
    ThemeShowcaseMatComponent
  ],
  templateUrl: './theme-selector.component.html',
  styleUrl: './theme-selector.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThemeSelectorComponent {


  private themeGenerator = inject(ThemeGeneratorService)
  private fb = inject(FormBuilder)

  //--------------------------------------//

  _presetThemes = input<ThemeDefinition[]>(presetThemes, {alias: 'presetThemes'});

  //--------------------------------------//

  exportedScss: string | null = null;

  themeForm: IThemeForm = this.fb.group({
    primary: this.fb.nonNullable.control('#6750A4', [Validators.required]),
    secondary: this.fb.nonNullable.control('#958DA5', [Validators.required]),
    tertiary: this.fb.control('#B58392'),
    error: this.fb.control('#B3261E'),
    darkMode: this.fb.nonNullable.control(false)
  }) as IThemeForm;

  //--------------------------------------//

  applyTheme() {
    const values = this.themeForm.value;
    const colors: ThemeColors = {
      primary: values.primary!, //! validators
      secondary: values.secondary!,//! validators
      tertiary: values.tertiary,
      error: values.error
    };

    this.themeGenerator.applyTheme(
      colors,
      document.documentElement,
      values.darkMode

    );
  }

  //--------------------------------------//

  applyPreset(presetName: string) {
    const preset = presetThemes.find(p => p.name === presetName)?.theme;
    if (!preset) return;

    this.themeForm.patchValue({
      primary: preset.primary,
      secondary: preset.secondary,
      tertiary: preset.tertiary
    });

    this.themeGenerator.applyTheme(
      preset,
      document.documentElement,
      this.themeForm.value.darkMode,
      presetName !== 'default' ? presetName : undefined
    );
  }

  //--------------------------------------//

  exportTheme = () =>
    this.exportedScss = this.themeGenerator.exportThemeAsScss();


  //--------------------------------------//

}//Cls
