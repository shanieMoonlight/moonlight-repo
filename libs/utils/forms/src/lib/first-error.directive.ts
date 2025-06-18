import { Directive, Input, OnDestroy } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { filter, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { CustomErrorMessageMap, FormErrors } from './form-errors';
import { FormUtility } from './form-utility';


@Directive({
  selector: '[sbFormControlFirstError]',
  standalone: true
})
export class FirstErrorDirective implements OnDestroy {

  @Input({ required: true }) set sbFormControlFirstError(form: FormGroup) {
    this._form = form
    this.observeValueChanges(this._form)
  }

  @Input() customErrorMessages?: CustomErrorMessageMap;
  @Input() showUntouched: boolean = false; // Opt-out flag for immediate errors

  //- - - - - - - - - - - - - - //

  private _form?: FormGroup
  private _vcSub?: Subscription

  //----------------------------//

  ngOnDestroy(): void {
    this._vcSub?.unsubscribe()
  }

  //----------------------------//

  observeValueChanges(form: FormGroup) {

    this._vcSub?.unsubscribe()
    this._vcSub = form.statusChanges
      .pipe(
        filter(() => form.status === 'INVALID'),
        map(() => FormUtility.findInvalidControlsData(form))
      )
      .subscribe((invalidControlData) => {
        for (const controlData of invalidControlData) {
          // There should be only one non-firstError in invalidControlData.
          // If there is a firstError, it's because that control has changed, is invalid and it's errors 
          // were updated by Reactive Forms. So if they had a firstError, it will still be there.
          // Other controls will remain unchanged

          const shouldShowError = !controlData.control.errors?.['firstError']
            && (this.showUntouched || controlData.control.touched)

          if (shouldShowError) {
            FormErrors.setFirstErrorMessage(
              controlData.name,
              controlData.control,
              this.customErrorMessages
            )
          }

        }
      })
  }

}//Cls
