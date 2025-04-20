import { FocusMonitor } from '@angular/cdk/a11y'
import { ChangeDetectionStrategy, Component, DestroyRef, ElementRef, forwardRef, HostBinding, inject, input, Input, isDevMode, OnDestroy, signal } from '@angular/core'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { AbstractControl, ControlValueAccessor, FormBuilder, FormGroup, FormGroupDirective, NgControl, NgForm, ReactiveFormsModule, Validators } from '@angular/forms'
import { MatCheckboxModule } from '@angular/material/checkbox'
import { ErrorStateMatcher } from '@angular/material/core'
import { MatFormFieldControl, MatFormFieldModule } from '@angular/material/form-field'
import { MtxNativeDatetimeModule } from '@ng-matero/extensions/core'
import { MtxDatetimepickerModule } from '@ng-matero/extensions/datetimepicker'
import { BehaviorSubject, filter, take } from 'rxjs'
import { DateUtils } from '../utils/date-utils'
import { TimeInMillis } from '../utils/time-in'
import { Day, IDayForm } from './timetable'

//#############################################################//

function createCompareValidator(openCtrl: AbstractControl, closeCtrl: AbstractControl) {
  return () => {

    var opentime = new Date(openCtrl.value)
    var closetime = new Date(closeCtrl.value)
    // Set both dates to the same day to compare only time
    opentime.setFullYear(2000, 0, 1);
    closetime.setFullYear(2000, 0, 1);
    return opentime >= closetime
      ? { open_close_error: 'Open time must be before Close time' }
      : null;
  }
}

//#############################################################//

export class CustomErrorMatcher implements ErrorStateMatcher {
  isErrorState(control: AbstractControl | null, form: FormGroupDirective | NgForm | null): boolean {
    return !!(control && control.invalid && (control.touched || (form && form.submitted)))
  }
}

//#############################################################//

const toFileName = (name: string) => name
  .replace(/([a-z])([A-Z])/g, '$1-$2')
  .toLowerCase()

//#############################################################//

function getFirstFormError(form: FormGroup): Record<string, any> | null {

  if (form.valid)
    return null

  // Check form-level errors first
  if (form.errors) {
    const firstKey = Object.keys(form.errors)[0]
    return { [firstKey]: form.errors[firstKey] }
  }

  // Check control-specific errors
  for (const key of Object.keys(form.controls)) {
    const control = form.get(key)
    if (control?.errors) {
      const errorKey = Object.keys(control.errors)[0]
      const controlName = key // Use the key from the loop as the control name
      return { [controlName]: { [errorKey]: control.errors[errorKey] } } //Error is connected to the inner control by name
    }
  }

  if (form.invalid)
    return { invalidForm: true }

  return null
}

//#############################################################//

@Component({
  selector: 'day-opening-hours-control',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MtxNativeDatetimeModule,
    MtxDatetimepickerModule,
    MatCheckboxModule
  ],
  templateUrl: './day-opening-hours.component.html',
  styleUrl: './day-opening-hours.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.disabled]': '_disabled()',
    '[class.focused]': '_focused()',
    '[class.required]': '_required()',
    '[style.--customColor]': '_color()',
    '[class.customColor]': '_color()',
    '[class.floated]': 'shouldLabelFloat',
    '[attr.aria-describedby]': '_describedByIds()'
  },
  providers: [
    {
      provide: MatFormFieldControl,
      useExisting: forwardRef(() => DayOpeningHoursControlComponent)
    },
    {
      provide: ErrorStateMatcher,
      useClass: CustomErrorMatcher
    },
  ]
})
export class DayOpeningHoursControlComponent implements MatFormFieldControl<Day>, ControlValueAccessor, OnDestroy {

  private _fb = inject(FormBuilder)

  //---------------------------------------//

  _color = input<string | undefined>(undefined, { alias: 'color' })

  //---------------------------------------//


  protected _openInitial = new Date(new Date().setTime(TimeInMillis.Hour * 9.5))
  protected _closeInitial = new Date(new Date().setTime(TimeInMillis.Hour * 22.5))

  protected _form: IDayForm = this._fb.group({
    openTime:  this._fb.control<Date | null>(null, [Validators.required]),
    closeTime: this._fb.control<Date | null>(null, [Validators.required]),
    closed:    this._fb.control<boolean | null>(false, [Validators.required])
  })

  //---------------------------------------//

  protected setValue(value?: Day | null) {

    console.log('setValue', value)


    this._form.controls.closed.setValue(value?.closed ?? false)

    const openTimeDate = value?.openTime ? DateUtils.fromTimeOnly(value?.openTime) : this._openInitial
    this._form.controls.openTime.setValue(openTimeDate)

    const closeTimeDate = value?.closeTime ? DateUtils.fromTimeOnly(value?.closeTime) : this._closeInitial
    this._form.controls.closeTime.setValue(closeTimeDate)

    this._form.updateValueAndValidity()
    // setTimeout(() => this.defaultHandleValueChanges(this._form.value), 0)
  }

  //- - - - - - - - - - - - - - - - - - - -//

  protected getValue(): Day | null {
    return new Day(
      DateUtils.formatTimeOnly(this._form.controls.openTime.value),
      DateUtils.formatTimeOnly(this._form.controls.closeTime.value),
      this._form.controls.closed.value ?? false
    )
  }

  //- - - - - - - - - - - - - - - - - - - -//

  protected getShoudFloatLabel(): boolean {
    return this.focused || !this.empty
  }

  //- - - - - - - - - - - - - - - - - - - -//

  /**
   * Listen for changes to value and inform parent of changes
   */
  protected observeValueChanges() {

    //Pass on valid values to the parent form
    this._form.valueChanges
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        filter(() => this._form.valid))
      .subscribe((val) => {
        setTimeout(() => this.defaultHandleValueChanges(), 0)
      })

    //If individual parts of the form are invalid, we need to inform the parent form
    //If we combine the ngControl?.control?.errors with the inner form errors, we can inform the parent form of the first error
    this._form.statusChanges
      .pipe(
        takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        // console.log(`defaultHandleValueChanges = statusChanges`, this._form.value)
        const control = this.ngControl?.control
        if (!control)
          return

        const firstFormError = getFirstFormError(this._form)
        if (!firstFormError)
          return

        const currentCtrlErrors = control.errors
        control?.setErrors({ ...currentCtrlErrors, ...firstFormError })

      })
  }

  //- - - - - - - - - - - - - - - - - - - -//

  /**
   * Should the parent form consider the value as empty?
   */
  protected isEmpty(value?: Day | null): boolean {
    return !this._form.value.openTime || !this._form.value.closeTime
  }

  //- - - - - - - - - - - - - - - - - - - -//

  /**
   * Check if the inner form/control is in an error state.
   * If we are using a form/control under the hood it's validity will not necessarily be the same as the parent form
   * because different validation rules may apply.
   * Example: Maybe the payload of this control is an object with with various fields, and we don't consider it valid unless all fields are filled out.
   * In this case we would need to implement our own error state matcher
   * Because from the parent form's perspective, this control is valid if it has a value, but from this class's perspective it is only valid if all fields are filled out.
   */
  protected internalIsErrorState(): boolean {
    return (this.ngControl?.control?.touched || !!this.ngControl?.control?.dirty) && !this._form.valid
  }

  //#+#+#+#+#+#+#+#+#+#+#+#+#+#+#+#+#+#+#+#+#+#+#+#+#+#+#+#+#+#+#//
  //#+#+#+#+#+#+#+#+#+#+#+#+#+   NG   #+#+#+#+#+#+#+#+#+#+#+#+#+#//
  //#+#+#+#+#+#+#+#+#+#+#+#+#+#+#+#+#+#+#+#+#+#+#+#+#+#+#+#+#+#+#//


  constructor() {

    this.observeValueChanges()
    this.matInit()

    if (this.ngControl)
      this.ngControl.valueAccessor = this

    // Extra setup goes here...   
    // this._form.addValidators(
    //   createCompareValidator(this._form.controls.openTime, this._form.controls.closeTime)
    // )
  }

  //---------------------------------------//

  ngOnDestroy() {
    // Clean up any additional resources if needed
    this.matOnDestroy();
  }

  //#+#+#+#+#+#+#+#+#+#+#+#+#+#+#+#+#+#+#+#+#+#+#+#+#+#+#+#+#+#+#//
  //#+#+#+#+#+#+#+#+#+#+#+#+# MAT STUFF #+#+#+#+#+#+#+#+#+#+#+#+#//
  //#+#+#+#+#+#+#+#+#+#+#+#+#+#+#+#+#+#+#+#+#+#+#+#+#+#+#+#+#+#+#//


  private _elRef = inject(ElementRef)
  private _focMon = inject(FocusMonitor)
  private destroyRef = inject(DestroyRef)
  public ngControl = inject(NgControl, { optional: true, self: true })
  //This is used to validate the control based off the parent Form's control validators (NOT this classes form or control validators)
  public _errorStateMatcher = inject(ErrorStateMatcher)

  //---------------------------------------//

  private static nextId = 0
  @HostBinding()
  id = `mat-form-field-ctrl-${DayOpeningHoursControlComponent.nextId++}`

  stateChanges = new BehaviorSubject<void>(undefined)
  controlType = toFileName(DayOpeningHoursControlComponent.name)
  // autofilled? = false

  //---------------------------------------//

  protected _focused = signal(false)
  protected _disabled = signal(false)
  protected _required = signal(false)
  protected _placeholder = signal('')
  protected _describedByIds = signal('')

  //---------------------------------------//

  get value(): Day | null {
    return this.getValue()
  }

  @Input()
  set value(value: Day | null) {
    this.setValue(value)
    this.stateChanges.next()
  }

  //- - - - - - - - - - - - - - - - - - - -//

  get placeholder(): string {
    return this._placeholder()
  }

  @Input()
  set placeholder(value: string) {
    if (this._placeholder() === value)//Already set
      return
    this._placeholder.set(value)
  }

  //- - - - - - - - - - - - - - - - - - - -//

  get focused(): boolean {
    return this._focused()
  }

  set focused(value: boolean) {
    if (this._focused() === value)//Already set
      return
    this._focused.set(value)
    this.stateChanges.next()
  }

  //- - - - - - - - - - - - - - - - - - - -//

  get empty(): boolean {
    return this.isEmpty(this.value)
  }

  //- - - - - - - - - - - - - - - - - - - -//

  get shouldLabelFloat(): boolean {
    return this.getShoudFloatLabel()
  }

  //- - - - - - - - - - - - - - - - - - - -//

  get disabled(): boolean {
    return this._disabled()
  }

  @Input()
  set disabled(value: boolean) {
    if (this._disabled() === value)//Already set
      return
    this._disabled.set(value)
    this.stateChanges.next()
  }

  //- - - - - - - - - - - - - - - - - - - -//

  get required(): boolean {
    return this._required()
  }

  @Input()
  set required(rq: boolean) {
    if (this._required() === rq)//Already set
      return
    this._required.set(rq)
  }

  //- - - - - - - - - - - - - - - - - - - -//

  get outsideErrorState(): boolean {
    return this._errorStateMatcher.isErrorState(this.ngControl?.control ?? null, null)
  }


  get errorState(): boolean {
    return this.internalIsErrorState()
      || this._errorStateMatcher.isErrorState(this.ngControl?.control ?? null, null)
  }

  //---------------------------------------//

  private matInit() {
    this.setupFocusMonitor()
  }

  //- - - - - - - - - - - - - - - - - - - -//

  private matOnDestroy() {
    // Clean up any additional resources if needed
    this.stateChanges.complete();
    this._focMon.stopMonitoring(this._elRef.nativeElement);
  }

  //---------------------------------------//

  /**
   * Setup focus monitor. Monitor the focus of this element
   */
  private setupFocusMonitor = (focMon: FocusMonitor = this._focMon) => {
    focMon
      .monitor(this._elRef.nativeElement, true)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(focused => {
        this.focused = !!focused
        this.stateChanges.next()
        if (isDevMode())
          console.log(`${this.id}_focused:`, this.focused)
      })

    focMon
      .monitor(this._elRef.nativeElement, true)
      .pipe(take(1))
      .subscribe(focused => this.onTouched())
  }

  //---------------------------------------//

  setDescribedByIds(ids: string[]): void {
    // Implementation for accessibility
    this._describedByIds.set(ids.join(' '))
  }

  //---------------------------------------//

  /**Will be called by the Form/MatFormField */
  onContainerClick(event: MouseEvent): void {
    // Focus the control when the container is clicked
    if (!this.focused)
      this.focused = true
  }


  //#+#+#+#+#+#+#+#+#+#+#+#+#+#+#+#+#+#+#+#+#+#+#+#+#+#+#+#+#+#+#//
  //#+#+#+#+#+#+#+#+#+#+#+#+# CVA STUFF #+#+#+#+#+#+#+#+#+#+#+#+#//
  //#+#+#+#+#+#+#+#+#+#+#+#+#+#+#+#+#+#+#+#+#+#+#+#+#+#+#+#+#+#+#//


  /** 
   * My on change function. Will be assigned to in registerOnChange.
   * Will be used to inform the form that the value has changed */
  onChange = (_: any) => { }

  /** My on touched function. Will be assigned to in registerOnTouched.
   * Will be used to inform the form that the value has been touched */
  onTouched = () => { }

  //=============================================//

  /**
   * @param val This is the value passed in from the form control
   * This is where we update our own signal with the value from the form control, so we can display it in the UI
   */
  writeValue = (val: Day | null) =>
    this.value = val

  /**
   * @param fn Assigns the supplied function (from the form) to out own onChange property
   * So that when we call this.onChange() it will call the supplied function
   */
  registerOnChange = (fn: any): void =>
    this.onChange = fn

  /**
   * @param fn Assigns the supplied function (from the form) to out own onChange property
   * So that when we call this.onTouched() it will call the supplied function
   */
  registerOnTouched = (fn: any): void =>
    this.onTouched = fn

  /**
   * @param isDisabled Use this to react to the the form control being disabled
   * i.e. set styles, disable buttons etc
   */
  setDisabledState? = (isDisabled: boolean): void =>
    this._disabled.set(isDisabled)


  //#+#+#+#+#+#+#+#+#+#+#+#+#+#+#+#+#+#+#+#+#+#+#+#+#+#+#+#+#+#+#//
  //#+#+#+#+#+#+#+#+#+#+#+#+#  UTILS  #+#+#+#+#+#+#+#+#+#+#+#+#+#//
  //#+#+#+#+#+#+#+#+#+#+#+#+#+#+#+#+#+#+#+#+#+#+#+#+#+#+#+#+#+#+#//


  /** 
    * Default function to handle value changes
    * @param val The control payload
    * This function will call stateChanges and onChange to inform the parent form of the change
  */
  protected defaultHandleValueChanges() {

    const payload = this.getValue()
    this.stateChanges.next()
    this.onChange(payload)
    if (isDevMode())
      console.log(`${this.id}_observeValueChanges:`, payload)
  }

  //#+#+#+#+#+#+#+#+#+#+#+#+#+#+#+#+#+#+#+#+#+#+#+#+#+#+#+#+#+#+#//

}//Cls


