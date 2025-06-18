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
          //There should be only one non-firstError in invalidControlData.
          // If there is no firstError, it's because that control has changed, is invalid and it's errors 
          // were updated by Reactive Forms
          //Other controls will remain unchanged
          if (!controlData.control.errors?.['firstError']) {
            const name = controlData.name;
            const control = controlData.control;
            FormErrors.setFirstErrorMessage(name, control, this.customErrorMessages)
          }
        }
      })
  }

}//Cls
