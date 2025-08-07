import { isPlatformBrowser } from '@angular/common';
import { Directive, ElementRef, inject, Input, OnDestroy, PLATFORM_ID, Renderer2 } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { filter, Subscription } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { CustomErrorMessageMap, FormErrors } from '../form-errors';
import { FormUtility } from '../form-utility';


/**
 * Directive: sbFormControlFirstError
 *
 * Automatically manages and displays the first validation error for each control in a FormGroup.
 * - Shows errors only after controls are touched (unless showUntouched is true)
 * - Dynamically adds blur/focusout listeners for untouched invalid controls
 * - Supports custom error messages via CustomErrorMessageMap
 * - Cleans up all listeners and subscriptions on destroy
 * - SSR-safe: all DOM access is guarded by isPlatformBrowser
 *
 * Limitations:
 * - Dynamic form changes (adding/removing controls at runtime) are NOT automatically handled in this version.
 *   If you add or remove controls after initialization, you must manually re-run error setup logic.
 *   (This feature is planned for a future release.)
 */
@Directive({
  selector: '[sbFormControlFirstError]',
  standalone: true
})
export class FirstErrorDirective implements OnDestroy {

  private _platformId = inject(PLATFORM_ID);
  private _renderer = inject(Renderer2);
  private _host: ElementRef<HTMLElement> = inject(ElementRef);


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
  private blurListeners = new Map<string, () => void>()

  //----------------------------//

  ngOnDestroy(): void {
    this._vcSub?.unsubscribe()
    this.removeAllBlurListeners();
  }

  //----------------------------//

  private addBlurListener(controlName: string, control: AbstractControl): void {

    // Find the input element by formControlName
    const input: HTMLElement | null = this._host.nativeElement.querySelector(`[formControlName="${controlName}"]`);

    if (!input)
      return;

    // Use Renderer2 to listen for 'focusout'
    const unlisten = this._renderer.listen(input, 'focusout', () => {
      if (!control.errors?.['firstError']) {
        FormErrors.setFirstErrorMessage(
          controlName,
          control,
          this.customErrorMessages
        );
      }
      // Remove the event listener after setting the error
      unlisten();
      this.blurListeners.delete(controlName);
    });

    this.blurListeners.set(controlName, unlisten);
  }

  //- - - - - - - - - - - - - - //

  private removeAllBlurListeners() {

    for (const unlisten of this.blurListeners.values()) 
      unlisten()
    
    this.blurListeners.clear();
  }

  //----------------------------//


  private observeValueChanges(form: FormGroup) {

    if (!isPlatformBrowser(this._platformId))
      return;

    this._vcSub?.unsubscribe()
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
          } else if (!control.touched) {
            // Add blur listener if not already present
            if (!this.blurListeners.has(name)) 
              this.addBlurListener(name, control);            
          }
        }
      })
  }

}//Cls
