import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterModule } from '@angular/router';
import { MatEverythingModule } from '@spider-baby/material-theming/utils';
import { HighlightModule } from 'ngx-highlightjs';
import { Subject, switchMap } from 'rxjs';
import { DownloadSetupFilesService, SetupFile } from '../../../../../../shared/utils/setup/download-setup/download-setup.service';
import { HomeSectionHdrComponent } from '../section-hdr/section-hdr.component';

@Component({
  selector: 'sb-home-getting-started',
  imports: [
    MatEverythingModule,
    HomeSectionHdrComponent,
    RouterModule,
    HighlightModule
  ],
  templateUrl: './getting-started.component.html',
  styleUrl: './getting-started.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class HomeGettingStartedComponent {

  private _setupFilesService = inject(DownloadSetupFilesService);

  //- - - - - - - - - - - - - - -//

  _sectionNumber = input.required({ alias: 'sectionNumber' });

  //- - - - - - - - - - - - - - -//

  protected _setupFiles = this._setupFilesService.setupFiles
  // protected _downloadingFile = this._setupFilesService.downloadingFile
  protected _downloadingFile = this._setupFilesService.activeDownload

  protected _downloadFileClick$ = new Subject<SetupFile>();
  protected _activeFile$ = this._downloadFileClick$.pipe(
    switchMap((file) => this._setupFilesService.downloadPredefinedFile(file))
  )
  protected _activeFile = toSignal(this._activeFile$, { initialValue: null })
  protected _isDownloading = computed(() => this._activeFile() !== null)


  //-----------------------------//

  // Installation and setup code snippets as signals
  protected _npmInstallCmd = signal('npm install @spider-baby/material-theming');

  protected _basicSetupCode = signal(`// app.config.ts
import { ThemeAndModeSetup } from '@spider-baby/material-theming/config';

export const appConfig: ApplicationConfig = {
  providers: [
    // ... other providers
    //If using SbThemePickerMatComponent or SbDarkModeToggleMatComponent
    ThemeAndModeSetup.provideThemingModule(THEME_CONFIG)
    //If using your own custom components to change theme/mode or just want to use the CSS variables, use this instead
    provideThemeInitializer(THEME_CONFIG)
  ]
};`);


  protected _customConfigCode = signal(`// app-theme.config.ts

import { ThemeConfig } from '@spider-baby/material-theming/config';

export const THEME_CONFIG = ThemeConfig.create([
  { 
    value: 'ocean-blue', 
    label: 'Ocean Blue', 
    primaryColor: '#0277BD', 
    secondaryColor: '#26A69A' 
    tertiaryColor: '#8B0000', //(optional)
    errorColor: '#FF0000',//(optional)
  },
  { 
    value: 'sunset-orange', 
    label: 'Sunset Orange', 
    primaryColor: '#FF5722', 
    secondaryColor: '#FFC107' 
  }
]);
`);

  protected _customConfigAcvancedCode = signal(`// app-theme.config.ts (Dynamic)

import { ThemeConfig, ThemeOption } from '@spider-baby/material-theming/config';

const today = new Date();
const thisYear = today.getFullYear();
const xmasTime = new Date(thisYear, 11, 1);
const halloweenTimeStart = new Date(thisYear, 10, 1);
const halloweenTimeEnd = new Date(thisYear, 11, 1);
export const IS_XMAS = today >= xmasTime;
export const IS_HALLOWEEN = today >= halloweenTimeStart && today < halloweenTimeEnd;


const _themeOptions: ThemeOption[] = [
  ThemeOption.create({
    value: 'ocean-blue', 
    label: 'Ocean Blue', 
    primaryColor: '#0277BD', 
    secondaryColor: '#26A69A' 
    tertiaryColor: '#8B0000', //(optional)
    errorColor: '#FF0000',//(optional)
  }),
  ThemeOption.create({
    value: 'sunset-orange', 
    label: 'Sunset Orange', 
    primaryColor: '#FF5722', 
    secondaryColor: '#FFC107' 
  })
];

export const XMAS_THEME: ThemeOption = ThemeOption.create({
   darkMode: 'light',
  label: 'Xmas',
  value: 'xmas',
  primaryColor: '#C8102E',
  secondaryColor: '#006747',
});

export const HALLOWEEN_THEME: ThemeOption = ThemeOption.create({
   darkMode: 'dark',
  label: 'Halloween',
  value: 'halloween-theme',
  primaryColor: '#FF7518',
  secondaryColor: '#31004a',
});

if (IS_XMAS) _themeOptions.push(XMAS_THEME);
if (IS_HALLOWEEN) _themeOptions.push(HALLOWEEN_THEME);

export const THEME_CONFIG = ThemeConfig.create(_themeOptions);
`);


  protected _componentUsageCode = signal(`<!-- Add to your template -->

  <!--To allow users to change Themes and Dark Mode as they wish-->
  <sb-dark-mode-toggle-mat></sb-dark-mode-toggle-mat>
  <sb-theme-picker-mat></sb-theme-picker-mat>
  

  <!--To set a local theme for a specific component and its children -->
  <my-locally-themed-component  [sbApplyTheme]="theme" />
  `  );

  protected _scssCode = signal(`
// Custom Theming for Angular Material (If using angular Material components)

// Add this to your global styles.scss or a separate theming file that you import in your main styles.scss


// Import @angular/material
@use "@angular/material" as mat;

// Import color overrides (Optional)
@use '@spider-baby/material-theming/styles/mat-color-overrides.scss' as *;


// @angular/material - Include core styles 
// (only needed once per application)
@include mat.core();


html {

// @angular/material v19 theme setup. This is still required for shapes, border-radius etc.
// Leave the color palette empty as we're handling colors via CSS variables using our Theming System.
@include mat.theme((
    typography: Roboto,
    density: 0));
}


html,
body {
height: 100%;
}


body {
margin: 0;
font-family: Roboto, "Helvetica Neue", sans-serif;
}

    `);

  //-----------------------------//

}//Cls
