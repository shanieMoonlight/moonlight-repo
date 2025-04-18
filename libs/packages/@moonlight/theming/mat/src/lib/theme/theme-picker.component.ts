import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, effect, inject, input, output } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ThemeConfig, ThemeConfigService, ThemeOption } from '@moonlight/ng/theming/config';
import { ThemeService } from '@moonlight/ng/theming/service';
import { Subject, merge, tap } from 'rxjs';

/**
 * A component that renders a Material Design icon button which opens a menu
 * allowing the user to select an application theme from the available options.
 *
 * It relies on `ThemeService` to apply the theme and `ThemeConfigService`
 * to get the list of available themes.
 *
 * @usageNotes
 * Ensure necessary theme providers are set up, typically via:
 * `providers: [ThemeAndModeSetup.getThemeProviders()]`
 */
@Component({
    selector: 'ml-theme-picker-mat',
    standalone: true,
    imports: [NgTemplateOutlet, MatMenuModule, MatIconModule, MatTooltipModule],
    templateUrl: './theme-picker.component.html',
    styleUrls: ['./theme-picker.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThemePicker_Mat_Component {

    private _config: ThemeConfig = inject(ThemeConfigService, { optional: true }) ?? ThemeConfig.Create()
    private _themeService = inject(ThemeService)

    //- - - - - - - - - - - - - - -//

    /**
     * The tooltip text displayed when hovering over the theme picker icon.
     * Defaults to 'Change app theme'.
     * Can be set via input binding `pickerTooltip`.
     */
    _toolTip = input('Change app theme', { alias: 'pickerTooltip' })

    /**
     * Emits the currently selected `ThemeOption` whenever the theme changes.
     * Can be bound via output binding `theme`.
     * Emits `undefined` if no theme is currently selected or found.
     */
    _onThemeChange = output<ThemeOption | undefined>({ alias: 'theme' })

    //- - - - - - - - - - - - - - -//

    protected _options: Array<ThemeOption> = this._config.themeOptions
    protected _changeThemeClick$ = new Subject<ThemeOption>()

    private _themeOptionChange$ = this._changeThemeClick$.pipe(
        tap(newTheme => this._themeService.setTheme(newTheme)),
        tap(newTheme =>console.log('themeOptionChange$', newTheme))
    )
    private _selectedOption$ = merge(this._themeService.currentTheme$, this._themeOptionChange$)
    protected _selectedOption = toSignal(this._selectedOption$)

    //- - - - - - - - - - - - - - -//

    constructor() {
        // Effect to emit the theme change output whenever the selected option signal changes.
        effect(() => {
            this._onThemeChange.emit(this._selectedOption())
        })
    }

} //Cls

