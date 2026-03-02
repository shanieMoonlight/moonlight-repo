import { isPlatformBrowser } from '@angular/common';
import { AfterContentInit, ContentChildren, DestroyRef, Directive, ElementRef, inject, Input, OnDestroy, PLATFORM_ID, QueryList, Renderer2 } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormGroup, NgControl } from '@angular/forms';
import { EMPTY, filter, merge, Subscription } from 'rxjs';
import { auditTime, map, startWith } from 'rxjs/operators';
import { CustomErrorMessageMap, FirstErrorMessageService } from './first-error-message.service';
import { FormUtility } from '../../form-utility';
import { FirstErrorControlResolutionService, HOST_MARKER_ATTR } from './first-error-control-resolution';


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
  standalone: true,
  providers: [
    FirstErrorControlResolutionService,
    FirstErrorMessageService
  ],
  host: {
    [HOST_MARKER_ATTR]: ''
  },
})
export class FirstErrorDirective implements OnDestroy, AfterContentInit {

  private _platformId = inject(PLATFORM_ID);
  private _destroyRef: DestroyRef = inject(DestroyRef);
  private _renderer = inject(Renderer2);
  private _host: ElementRef<HTMLElement> = inject(ElementRef);
  private _controlResolution = inject(FirstErrorControlResolutionService);
  private _firstErrorMsgService = inject(FirstErrorMessageService);

  //- - - - - - - - - - - - - - //

  //Both are selectors are NgControl so both lists are in a sense the same. but with different read tokens to get both the control and the host element
  //There shoulld be a 1-to-1 mapping between the two lists based on the order of the controls in the template. We will use these lists to build a map of host element -> control for delegated event handling.
  @ContentChildren(NgControl, { descendants: true }) private _ngControls?: QueryList<NgControl>
  @ContentChildren(NgControl, { descendants: true, read: ElementRef }) private _ngControlElements?: QueryList<ElementRef<unknown>>

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

  private _form!: FormGroup
  private _vcSub?: Subscription
  private _focusOutUnlisten?: () => void
  private _controlHostMap = new Map<HTMLElement, NgControl>()

  //----------------------------//

  //Wait for content children to be available so we can build the control host map for delegated focusout handling.
  ngAfterContentInit(): void {
    this.initControlHostMapSync();
  }

  //- - - - - - - - - - - - - - //

  ngOnDestroy(): void {
    this._vcSub?.unsubscribe()
    this._focusOutUnlisten?.();
    this._controlHostMap.clear();
  }

  //----------------------------//

  // Extracted wiring so tests can assert the initialization behavior and
  // to keep lifecycle wiring in a single, named method.
  private initControlHostMapSync(): void {
    this.refreshControlHostMap();

    merge(
      this._ngControls?.changes ?? EMPTY,
      this._ngControlElements?.changes ?? EMPTY,
    ).pipe(
      takeUntilDestroyed(this._destroyRef),
    ).subscribe(() => {
      this.refreshControlHostMap();
    });
  }

  //- - - - - - - - - - - - - - //

  private refreshControlHostMap() {
    this._controlHostMap = this._controlResolution.buildControlHostMap(
      this._ngControls?.toArray() ?? [],
      this._ngControlElements?.toArray() ?? [],
    )
  }

  //----------------------------//

  private ensureDelegatedFocusoutListener() {
    // We keep ONE focusout listener on the form host instead of one per control.
    // Why: controls rendered later by @if/*ngIf were previously missed because
    // they did not exist when per-control listeners were attached.
    if (this._focusOutUnlisten) //Already listening
      return;

    this._focusOutUnlisten = this._renderer.listen(this._host.nativeElement, 'focusout', (event: FocusEvent) => {
      const targetElement = event.target instanceof HTMLElement ? event.target : null;

      const resolvedControl = this._controlResolution.resolveControlForElement(targetElement, this._host.nativeElement, this._controlHostMap)

      //  We only skip when control is missing or firstError is already set.
      if (!resolvedControl)
        return;
      if (resolvedControl.errors?.['firstError'])
        return;

      this._firstErrorMsgService.setFirstErrorMessage(resolvedControl, this.customErrorMessages)
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
        auditTime(0),
        map(() => FormUtility.findInvalidControlsData(form)),
      )
      .subscribe((invalidControlData) => {

        for (const control of invalidControlData) {

          // Skip if firstError is already set
          if (control.errors?.['firstError'])
            continue;


          if (this.showUntouched || control.touched) {
            this._firstErrorMsgService.setFirstErrorMessage(control, this.customErrorMessages);
          }
        }
      })
  }

}//Cls
