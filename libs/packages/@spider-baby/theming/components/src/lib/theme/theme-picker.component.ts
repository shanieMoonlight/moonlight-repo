import { ChangeDetectionStrategy, Component, computed, effect, inject, input, output } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { SbThemePalette, ThemeOption } from '@spider-baby/material-theming/config';
import { SbThemeService } from '@spider-baby/material-theming/service';
import { SbThemeAvatarComponent } from '@spider-baby/material-theming/ui';
import { MatEverythingModule } from '@spider-baby/material-theming/utils';
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
    selector: 'sb-theme-picker-mat',
    standalone: true,
    imports: [
        MatEverythingModule,
        SbThemeAvatarComponent
    ],
    templateUrl: './theme-picker.component.html',
    styleUrls: ['./theme-picker.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        '[style.color]': '"var(--mat-sys-" + color() + ")"',
    },
})
export class SbThemePickerMatComponent {

    private _themeService = inject(SbThemeService)

    //- - - - - - - - - - - - - - -//

    /**
     * The tooltip text displayed when hovering over the theme picker icon.
     * Defaults to 'Change app theme'.
     * Can be set via input binding `pickerTooltip`.
     */

    pickerTooltip = input('Change app theme');
    includeCustomThemes = input(true);
    color = input<SbThemePalette | undefined>(undefined);
    theme = output<ThemeOption | undefined>();

    //- - - - - - - - - - - - - - -//


    protected _systemOptions = this._themeService.systemThemes;
    protected _customOptions = this._themeService.customThemes;
    protected _allOptions = computed(() => [...this._systemOptions(), ...this._customOptions()]);

    protected _changeThemeClick$ = new Subject<ThemeOption>();

    private _themeOptionChange$ = this._changeThemeClick$.pipe(
        tap(newTheme => this._themeService.setTheme(newTheme))
    );
    private _selectedOption$ = merge(this._themeService.currentTheme$, this._themeOptionChange$);
    protected _selectedOption = toSignal(this._selectedOption$);

    //- - - - - - - - - - - - - - -//

    constructor() {
        // Effect to emit the theme change output whenever the selected option signal changes.
        effect(() => {
            this.theme.emit(this._selectedOption());
        });
    }

} //Cls

