import { FocusMonitor } from '@angular/cdk/a11y';
import { ChangeDetectionStrategy, Component, DestroyRef, ElementRef, HostBinding, inject, input, Input, isDevMode, OnDestroy, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatFormFieldControl } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { BehaviorSubject, take } from 'rxjs';
import { consoleDev } from '@moonlight/material-theming/utils';

//#########################################//

// Helper function to convert component name to kebab case for controlType
const toFileName = (name: string) => name
  .replace(/([a-z])([A-Z])/g, '$1-$2')
  .toLowerCase();

//#########################################//

/**
 * A form control component that allows users to select colors.
 * 
 * This component implements both MatFormFieldControl and ControlValueAccessor,
 * making it compatible with both Angular Forms and Material Form Field. It provides
 * a clickable color swatch that opens a native color picker on interaction.
 * 
 * @example
 * ```html
 * <mat-form-field>
 *   <ml-color-input formControlName="primaryColor" placeholder="Choose primary color"></ml-color-input>
 * </mat-form-field>
 * ```
 */
@Component({
  selector: 'ml-color-input',
  standalone: true,
  imports: [MatIconModule],
  template: `
    <div class="color-input-wrapper">
    <div class="color-display" 
      [style.background-color]="_colorValue() || 'transparent'" 
      [class.no-color]="!_colorValue()"
      (click)="openColorPicker()"
      (keydown.enter)="openColorPicker()"
      (keydown.space)="openColorPicker(); $event.preventDefault()"
      tabindex="0"
      role="button"
      [attr.aria-label]="'Select color' + (_colorValue() ? ': ' + _colorValue() : '')">
    <span class="color-value">{{ _colorValue() || 'No color' }}</span>
  </div>
      <input 
        #colorPicker
        type="color" 
        [value]="_colorValue() || '#000000'"
        (input)="onColorChange($event)" 
        class="color-picker"
        [attr.disabled]="_disabled() ? true : null"
        [attr.aria-labelledby]="_describedByIds()">
        <!-- {{_colorValue()}} -->
    </div>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
    }

    :host.disabled {
      opacity: 0.6;
      pointer-events: none;
    }

    :host.focused .color-display {
      border-color: var(--customColor, var(--mat-primary-color));
      outline: none;
    }

    .color-input-wrapper {
      position: relative;
      width: 100%;
    }

    .color-display {
      display: flex;
      align-items: center;
      padding: 8px 12px;
      border: 1px solid #ccc;
      border-radius: 4px;
      cursor: pointer;
      background-color: #fff;
      transition: border-color 0.2s;
    }

    .color-value {
      margin-left: 8px;
      font-family: monospace;
    }

    .color-picker {
      position: absolute;
      top: 0;
      left: 0;
      width: 0;
      height: 0;
      opacity: 0;
    }

     .color-display.no-color {
      background-image: linear-gradient(45deg, #ccc 25%, transparent 25%),
                        linear-gradient(-45deg, #ccc 25%, transparent 25%),
                        linear-gradient(45deg, transparent 75%, #ccc 75%),
                        linear-gradient(-45deg, transparent 75%, #ccc 75%);
      background-size: 16px 16px;
      background-position: 0 0, 0 8px, 8px -8px, -8px 0px;
    }
  `],
  providers: [
    {
      provide: MatFormFieldControl,
      useExisting: ColorInputComponent
    }
  ],
  host: {
    '[class.disabled]': '_disabled()',
    '[class.focused]': '_focused()',
    '[class.required]': '_required()',
    '[style.--customColor]': '_color()',
    '[class.customColor]': '_color()',
    '[class.floated]': 'shouldLabelFloat',
    '[attr.aria-describedby]': '_describedByIds()'
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ColorInputComponent implements MatFormFieldControl<string | undefined>, ControlValueAccessor, OnDestroy {

  //#+#+#+#+#+#+#+#+#+#+#+#+#+#+#+#+#+#+#+#+#+#+#+#+#+#//
  //#+#               BASIC PROPERTIES              #+#//
  //#+#+#+#+#+#+#+#+#+#+#+#+#+#+#+#+#+#+#+#+#+#+#+#+#+#//

  // Input for custom color (used for styling)
  _color = input<string | undefined>(undefined, { alias: 'color' });

  // State signals
  protected _colorValue = signal<string | undefined>(undefined);
  protected _focused = signal(false);
  protected _disabled = signal(false);
  protected _required = signal(false);
  protected _placeholder = signal('');
  protected _describedByIds = signal('');

  // Color picker reference
  colorPickerRef: HTMLInputElement | null = null;

  //#+#+#+#+#+#+#+#+#+#+#+#+#+#+#+#+#+#+#+#+#+#+#+#+#+#//
  //#+#              MATERIAL PROPERTIES            #+#//
  //#+#+#+#+#+#+#+#+#+#+#+#+#+#+#+#+#+#+#+#+#+#+#+#+#+#//

  // Required by MatFormFieldControl
  private static nextId = 0;
  @HostBinding()
  id = `color-input-${ColorInputComponent.nextId++}`;

  stateChanges = new BehaviorSubject<void>(undefined);
  controlType = toFileName(ColorInputComponent.name);

  // Injections
  private _elRef = inject(ElementRef);
  private _focMon = inject(FocusMonitor);
  private destroyRef = inject(DestroyRef);
  public ngControl = inject(NgControl, { optional: true, self: true });
  public _errorStateMatcher = inject(ErrorStateMatcher);

  //#+#+#+#+#+#+#+#+#+#+#+#+#+#+#+#+#+#+#+#+#+#+#+#+#+#//
  //#+#                USER INTERACTION              ##+#//
  //#+#+#+#+#+#+#+#+#+#+#+#+#+#+#+#+#+#+#+#+#+#+#+#+#+#//

  // Open the color picker when clicked
  openColorPicker() {
    if (this._disabled()) return;
    const picker = this._elRef.nativeElement.querySelector('input[type="color"]');
    if (picker) {
      picker.click();
    }
  }

  // Handle color change
  onColorChange(event: Event) {
    if (this._disabled()) return;

    const color = (event.target as HTMLInputElement).value;
    this._colorValue.set(color);
    this.onChange(color);
    this.onTouched();
    this.stateChanges.next();
  }

  //#+#+#+#+#+#+#+#+#+#+#+#+#+#+#+#+#+#+#+#+#+#+#+#+#+#//
  //#+#              LIFECYCLE & SETUP               ##+#//
  //#+#+#+#+#+#+#+#+#+#+#+#+#+#+#+#+#+#+#+#+#+#+#+#+#+#//

  constructor() {
    this.setupFocusMonitor();

    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }
  }

  ngOnDestroy() {
    this.stateChanges.complete();
    this._focMon.stopMonitoring(this._elRef.nativeElement);
  }

  // Setup focus monitoring
  private setupFocusMonitor = (focMon: FocusMonitor = this._focMon) => {
    focMon
      .monitor(this._elRef.nativeElement, true)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(focused => {
        this.focused = !!focused;
        this.stateChanges.next();
        consoleDev.log(`${this.id}_focused:`, this.focused);
        
      });

    focMon
      .monitor(this._elRef.nativeElement, true)
      .pipe(take(1))
      .subscribe(() => this.onTouched());
  }

  //#+#+#+#+#+#+#+#+#+#+#+#+#+#+#+#+#+#+#+#+#+#+#+#+#+#//
  //#+#         MAT FORM FIELD CONTROL INTERFACE    #+#//
  //#+#+#+#+#+#+#+#+#+#+#+#+#+#+#+#+#+#+#+#+#+#+#+#+#+#//

  // Getters and setters for MatFormFieldControl
  get value(): string | undefined {
    return this._colorValue();
  }

  @Input()
  set value(color: string | undefined) {
    this._colorValue.set(color);
    this.stateChanges.next();
  }

  get placeholder(): string {
    return this._placeholder();
  }

  @Input()
  set placeholder(text: string) {
    if (this._placeholder() === text) return;
    this._placeholder.set(text);
    this.stateChanges.next();
  }

  get focused(): boolean {
    return this._focused();
  }

  set focused(value: boolean) {
    if (this._focused() === value) return;
    this._focused.set(value);
    this.stateChanges.next();
  }

  get empty(): boolean {
    return !this._colorValue() || this._colorValue() === '#000000';
  }

  get shouldLabelFloat(): boolean {
    return this.focused || !this.empty;
  }

  get disabled(): boolean {
    return this._disabled();
  }

  @Input()
  set disabled(value: boolean) {
    if (this._disabled() === value) return;
    this._disabled.set(value);
    this.stateChanges.next();
  }

  get required(): boolean {
    return this._required();
  }

  @Input()
  set required(req: boolean) {
    if (this._required() === req) return;
    this._required.set(req);
    this.stateChanges.next();
  }

  get errorState(): boolean {
    return this._errorStateMatcher.isErrorState(this.ngControl?.control ?? null, null);
  }

  setDescribedByIds(ids: string[]): void {
    this._describedByIds.set(ids.join(' '));
  }

  onContainerClick(event: MouseEvent): void {
    if (!this.focused) {
      this.focused = true;
      this.openColorPicker();
    }
  }

  //#+#+#+#+#+#+#+#+#+#+#+#+#+#+#+#+#+#+#+#+#+#+#+#+#+#//
  //#+#        CONTROL VALUE ACCESSOR INTERFACE      ##+#//
  //#+#+#+#+#+#+#+#+#+#+#+#+#+#+#+#+#+#+#+#+#+#+#+#+#+#//

  // ControlValueAccessor implementation
  onChange = (_: string | undefined) => { consoleDev.log('onChange NOT implemented yet', _) };
  onTouched = () => {consoleDev.log('onTouched NOT implemented yet')  };

  writeValue(color: string | undefined): void {
    this.value = color;
  }

  registerOnChange(fn: (value: string | undefined) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this._disabled.set(isDisabled);
  }
}