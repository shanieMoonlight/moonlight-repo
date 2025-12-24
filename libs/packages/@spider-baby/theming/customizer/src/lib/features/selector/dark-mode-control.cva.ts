import { Component, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatRadioModule } from '@angular/material/radio';
import { DarkModeType } from '@spider-baby/material-theming/config';

@Component({
    selector: 'sb-dark-mode-radio-group',
    standalone: true,
    imports: [MatRadioModule],
    templateUrl: './dark-mode-control.cva.html',
    styleUrls: ['./dark-mode-control.cva.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => SbDarkModeRadioGroup),
            multi: true,
        }
    ]
})
export class SbDarkModeRadioGroup implements ControlValueAccessor {

    value: DarkModeType = 'system';
    disabled = false;

    //-----------------------//


   protected onSelectionChange(value: DarkModeType) {
        this.value = value;
        this._onChange(value);
        this._onTouched();
    }

    
    //=======================//
    // ControlValueAccessor methods
    //=======================//

    private _onChange: (v: DarkModeType) => void = () => { };
    private _onTouched: () => void = () => { };

    writeValue(obj: DarkModeType): void {
        this.value = obj ?? 'system';
    }

    registerOnChange(fn: (v: DarkModeType) => void): void {
        this._onChange = fn;
    }

    registerOnTouched(fn: () => void): void {
        this._onTouched = fn;
    }

    setDisabledState(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }

}//Cls
