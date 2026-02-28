import { isPlatformBrowser } from '@angular/common';
import { AfterContentInit, ContentChildren, Directive, ElementRef, inject, Input, OnDestroy, PLATFORM_ID, QueryList, Renderer2 } from '@angular/core';
import { FormGroup, NgControl } from '@angular/forms';
import { filter, Subscription } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { CustomErrorMessageMap, FormErrors } from '../form-errors';
import { FormUtility } from '../form-utility';
import { FirstErrorControlResolutionService } from './first-error-control-resolution';


/**
 * Directive: sbFormControlFirstError
 *
 * Automatically manages and displays the first validation error for each control in a FormGroup.
 * - Shows errors only after controls are touched (unless `showUntouched` is true)
 * - Uses delegated blur/focusout handling for untouched invalid controls
 * - Supports custom error messages via `CustomErrorMessageMap`
 * - Cleans up all listeners and subscriptions on destroy
 * - SSR-safe: all DOM access is guarded by `isPlatformBrowser`
 *
 * Important: This directive does NOT call `updateValueAndValidity()` on the form.
 * Callers are responsible for invoking `form.updateValueAndValidity()` after
 * programmatic changes (e.g. `patchValue`, `setErrors`, enabling/disabling controls)
 * when they want validation to run and errors to be surfaced immediately. The
 * directive listens for `statusChanges` and `focusout` events to surface errors,
 * but it will not force a validation run on behalf of the caller.
 *
 * Focusout resolution strategy:
 * - Uses `NgControl` instances from the projected form content to map host elements
 *   to actual `AbstractControl` instances.
 * - This supports nested `FormGroup`/`FormArray` structures and CVA hosts more
 *   reliably than resolving by DOM attributes alone.
 */
@Directive({
  selector: '[sbFormControlFirstError]',
  standalone: true
})
export class FirstErrorDirective implements OnDestroy, AfterContentInit {

  private _platformId = inject(PLATFORM_ID);
  private _renderer = inject(Renderer2);
  private _host: ElementRef<HTMLElement> = inject(ElementRef);
  private _controlResolution = inject(FirstErrorControlResolutionService);

  //- - - - - - - - - - - - - - //

  @ContentChildren(NgControl, { descendants: true }) private _ngControls?: QueryList<NgControl>

  //- - - - - - - - - - - - - - //

  @Input({ required: true }) set sbFormControlFirstError(form: FormGroup) {
    this._form = form
    this.observeValueChanges(this._form)
  }

  /** 
   * Custom error messages map to override default error messages.
   * If map returns undefined for a specific error, the default message map will be used.
   */
  @Input() customErrorMessages?: CustomErrorMessageMap;

  /**
   * If true, errors will be shown immediately for untouched controls.
   * If false, errors will only be shown after the control is touched.
   * Default is false.
   */
  @Input() showUntouched: boolean = false;

  //- - - - - - - - - - - - - - //

  private _form?: FormGroup
  private _vcSub?: Subscription
  private _ngControlsSub?: Subscription
  private _focusOutUnlisten?: () => void
  private _controlHostMap = new Map<HTMLElement, NgControl>()

  //----------------------------//

  //Wait for content children to be available so we can build the control host map for delegated focusout handling.
  ngAfterContentInit(): void {
     this._controlHostMap = this._controlResolution.buildControlHostMap(this._ngControls?.toArray())

    this._ngControlsSub = this._ngControls?.changes.subscribe(() => {
      this._controlHostMap = this._controlResolution.buildControlHostMap(this._ngControls?.toArray())
    });
  }

  //----------------------------//

  ngOnDestroy(): void {
    this._vcSub?.unsubscribe()
    this._ngControlsSub?.unsubscribe()
    this._focusOutUnlisten?.();
    this._controlHostMap.clear();
  }

  //----------------------------//

  private ensureDelegatedFocusoutListener() {
    // We keep ONE focusout listener on the form host instead of one per control.
    // Why: controls rendered later by @if/*ngIf were previously missed because
    // they did not exist when per-control listeners were attached.
    if (this._focusOutUnlisten) //Already listening
      return;

    this._focusOutUnlisten = this._renderer.listen(this._host.nativeElement, 'focusout', (event: FocusEvent) => {
      const resolved = this._controlResolution.resolveControlForEvent(event, this._host.nativeElement, this._controlHostMap, this._form)

      if (!resolved)
        return;

      const controlName = resolved.name
      const control = resolved.control

      // Preserve previous behavior: blur can set firstError for untouched invalid
      // controls. We only skip when control is missing or firstError is already set.
      if (control.errors?.['firstError'])
        return;

      FormErrors.setFirstErrorMessage(controlName, control, this.customErrorMessages)
    })
  }

  //----------------------------//

  private observeValueChanges(form: FormGroup) {

    if (!isPlatformBrowser(this._platformId))
      return;

    // Listener is attached once and continues to work as the template adds/removes
    // controls dynamically (e.g. @if toggles).
    this.ensureDelegatedFocusoutListener();

    this._vcSub?.unsubscribe()
    //This will catch things like form.patch or form.setValue that don't trigger `ensureDelegatedFocusoutListener`.
    this._vcSub = form.statusChanges
      .pipe(
        startWith('PENDING'), // Start with non-Invalid so the first error will be set on blur if the user clicks input without entering any data
        filter(() => form.status === 'INVALID'),
        map(() => FormUtility.findInvalidControlsData(form))
      )
      .subscribe((invalidControlData) => {

        for (const controlData of invalidControlData) {
          const control = controlData.control;
          const name = controlData.name;


          // Skip if firstError is already set
          if (control.errors?.['firstError'])
            continue;


          if (this.showUntouched || control.touched) {
            FormErrors.setFirstErrorMessage(name, control, this.customErrorMessages);
          }
        }
      })
  }

}//Cls
