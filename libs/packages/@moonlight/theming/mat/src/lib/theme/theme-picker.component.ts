// import { NgFor, NgTemplateOutlet } from '@angular/common';
// import { ChangeDetectionStrategy, Component, effect, inject, input, output } from '@angular/core';
// import { toSignal } from '@angular/core/rxjs-interop';
// import { MatIconModule } from '@angular/material/icon';
// import { MatMenuModule } from '@angular/material/menu';
// import { MatTooltipModule } from '@angular/material/tooltip';
// import { ThemeConfig, ThemeConfigService, ThemeOption } from '@inigo/theme-and-mode/config';
// import { ThemeService } from '@inigo/theme-and-mode/service';
// import { Subject, map, merge, tap } from 'rxjs';

// /**
//  * Use:   providers:[ThemeAndModeSetup.getThemeProviders()]
//  */
// @Component({
//   selector: 'inigo-theme-picker-mat',
//   standalone: true,
//   imports: [NgFor, NgTemplateOutlet, MatMenuModule, MatIconModule, MatTooltipModule],
//   templateUrl: './theme-picker.component.html',
//   styleUrls: ['./theme-picker.component.scss'],
//   changeDetection: ChangeDetectionStrategy.OnPush,
// })
// export class MatThemePickerComponent {

//   private _config: ThemeConfig = inject(ThemeConfigService, { optional: true }) ?? ThemeConfig.Create()
//   private _themeService = inject(ThemeService)

//   //------------------------------------------//

//   _toolTip = input('Change app theme', { alias: 'pickerTooltip' })
//   _onThemeChange = output<ThemeOption | undefined>({ alias: 'theme' })

//   //------------------------------------------//

//   protected _options: Array<ThemeOption> = this._config.themeOptions


//   protected _changeThemeClick$ = new Subject<ThemeOption>()

//   private _themeIdxChange$ = this._changeThemeClick$.pipe(
//     tap(newTheme => this._themeService.setThemeIndex(newTheme?.classIdx)),
//     map(newTheme => newTheme.classIdx)
//   )

//   protected _selectedOption = toSignal(
//     merge(this._themeService.themeIdx$, this._themeIdxChange$).pipe(
//       map(idx => this._options.find((o) => o.classIdx == idx))
//     ))

//   //------------------------------------------//

//   constructor() {

//     effect(() => {
//       this._onThemeChange.emit(this._selectedOption())
//     })

//   }

//   //------------------------------------------//

// } //Cls

