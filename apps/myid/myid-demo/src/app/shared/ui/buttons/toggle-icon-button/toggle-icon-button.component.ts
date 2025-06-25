import { NgClass, NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, effect, input, output, signal, TemplateRef } from '@angular/core';
import { IdTheme } from '../../theme.type';

@Component({
    selector: 'sb-toggle-icon-button',
    standalone: true,
    imports: [NgClass, NgTemplateOutlet],
    templateUrl: './toggle-icon-button.component.html',
    styleUrls: ['./toggle-icon-button.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SbToggleIconButtonComponent {

    color = input<IdTheme>('primary');
    colorOnFocus = input<boolean>(true);
    // size = input<number>(20);
    toggledLabel = input<string>('Hide');
    untoggledLabel = input<string>('Show');
    disabled = input<boolean>(false);

    toggledTemplate = input<TemplateRef<unknown> | undefined>();
    unToggledTemplate = input<TemplateRef<unknown> | undefined>();

    toggled = output<boolean>();

    protected _toggled = signal<boolean>(false);
    protected _ariaLabel = computed(() => this._toggled() ? this.toggledLabel() : this.untoggledLabel())


    constructor() {
        effect(() =>
            this.toggled.emit(!this._toggled())
        )
    }


    toggle() {
        this._toggled.update(current => !current);
    }

}//Cls
