import { ChangeDetectionStrategy, Component, computed, forwardRef, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'my-cva-example',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './cva.component.html',
  styleUrl: './cva.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MyCvaComponent),
      multi: true
    }
  ],
  host: {
    '[class.disabled]': 'disabled()',
    '[class.isLocked]': 'isLocked()',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyCvaComponent implements ControlValueAccessor {

  protected _isLocked = signal(false);
  protected _disabled = signal(false);

  //- - - - - - - - - - - - - - - - - - -//

  protected _icon = computed(() => this._isLocked() ? 'lock' : 'lock_open')
  protected _color = computed(() => this._isLocked() ? 'red' : 'green')

  //-------------------------------------//


  setValue() {
    if (this._disabled())
      return

    this._isLocked.update(lkd => !lkd);
    this.onChange(this._isLocked())
    this.onTouched()
  }

  //=============================================//

  /** 
   * My on change function. Will be assigned to in registerOnChange.
   * Will be used to inform the form that the value has changed */
  onChange = (_: any) => { }

  /** My on touched function. Will be assigned to in registerOnTouched.
   * Will be used to inform the form that the value has been touched */
  onTouched = () => { }

  /**
   * @param val This is the value passed in from the form control
   * This is where we update our own signal with the value from the form control, so we can display it in the UI
   */
  writeValue(val: boolean): void {
    this._isLocked.set(val);
  }

  /**
   * @param fn Assigns the supplied function (from the form) to out own onChange property
   * So that when we call this.onChange() it will call the supplied function
   */
  registerOnChange = (fn: any): void => this.onChange = fn

  /**
   * @param fn Assigns the supplied function (from the form) to out own onChange property
   * So that when we call this.onTouched() it will call the supplied function
   */
  registerOnTouched = (fn: any): void => this.onTouched = fn

  /**
   * @param isDisabled Use this to react to the the form control being disabled
   * i.e. set styles, disable buttons etc
   */
  setDisabledState? = (isDisabled: boolean): void => this._disabled.set(isDisabled)

  //=============================================//

}
