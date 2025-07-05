import {
    AbstractControl,
    ValidatorFn
} from '@angular/forms';


//##########################//


interface MinMaxValidationResult {
  minMaxError?: {
    message: string;
    code?: string;
    minControlName?: string;
    maxControlName?: string;
  };
}


//##########################//

export class NumericValidation {

    // Custom validator for password confirmation
    static lessThanValidator(
        minControlName: string,
        maxControlName: string,
        strictlyLessThan: boolean = true,
        errorMessage?: string ): ValidatorFn {

        return (control: AbstractControl): MinMaxValidationResult | null => {
            const minControl = control.get(minControlName);
            const maxControl = control.get(maxControlName);

            if (!minControl || !maxControl)
                return null;

            const minValue = Number(minControl.value);
            const maxValue = Number(maxControl.value);
            

            if (isNaN(minValue) || isNaN(maxValue))
                return null;

            if (minValue < maxValue)
                return null;

            if (!strictlyLessThan && minValue == maxValue)
                return null;
            return {
                minMaxError: {
                    message: errorMessage ?? `${minControlName} must be less ${!strictlyLessThan ? 'or equal to': ''}  than ${maxControlName}`,
                    code: 'minMaxError',
                    minControlName,
                    maxControlName
                }
            }
        }

    }

} //Cls
