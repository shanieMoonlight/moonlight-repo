import { AbstractControl, FormGroup } from "@angular/forms";


//##########################//

export type ErrorMessageFunction = (fieldName: string, errorValue: any) => string;
export type CustomErrorMessageMap = Map<string, ErrorMessageFunction>;


const errorMessageMap = new Map<string, ErrorMessageFunction>([
    ['required', (fieldName) => `${fieldName} is required.`],
    ['email', () => 'Please enter a valid email address.'],
    ['minlength', (fieldName, errorValue) => !errorValue ? 'Value is too short' : `${fieldName} must be at least ${errorValue?.requiredLength} characters.`],
    ['maxlength', (fieldName, errorValue) => !errorValue ? 'Value is too long' : `${fieldName} must be no more than ${errorValue?.requiredLength} characters.`],
    ['pattern', (fieldName) => `${fieldName} format is invalid.`],
    ['min', (fieldName, errorValue) => !errorValue ? 'Value is too small' : `${fieldName} must be at least ${errorValue?.min}.`],
    ['max', (fieldName, errorValue) => !errorValue ? 'Value is too large' : `${fieldName} must be no more than ${errorValue?.max}.`],
    ['passwordMismatch', () => 'Passwords do not match.'],
    ['mustMatch', () => 'Fields do not match.'],
    ['whitespace', (fieldName) => `${fieldName} cannot contain only whitespace.`],
    ['forbiddenValue', (fieldName, errorValue) => !errorValue ? 'This value is not allowed' : `${fieldName} cannot be "${errorValue?.value}".`],
    ['asyncValidation', (fieldName) => `${fieldName} validation is pending...`],
    ['invalidDate', () => 'Please enter a valid date.'],
    ['futureDate', () => 'Date must be in the future.'],
    ['pastDate', () => 'Date must be in the past.'],
    ['strongPassword', () => 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.'],
    ['phoneNumber', () => 'Please enter a valid phone number.'],
    ['url', () => 'Please enter a valid URL.'],
    ['unique', (fieldName) => `This ${fieldName.toLowerCase()} is already taken.`],
    ['fileSize', (fieldName, errorValue) => !errorValue ? 'File is too large' : `File size must be less than ${errorValue?.maxSize}.`],
    ['fileType', (fieldName, errorValue) => !errorValue ? 'Invalid file type' : `Only ${errorValue?.allowedTypes?.join(', ')} files are allowed.`]
]);


//##########################//


export class FormErrors {


    static setFirstErrors(
        form: FormGroup,
        customErrorMessages?: CustomErrorMessageMap
    ): void {

        const controls = form.controls
        for (const name in controls) {
            const control = controls[name]
            if (control.invalid) {
                const currentErrors = control.errors
                const firstError = this.getFirstErrorMessage(name, control, customErrorMessages)

                if (firstError)
                    control.setErrors({ ...currentErrors, firstError: firstError })

            }
        }
    }


    //----------------------------//    

    
    static setFirstErrorMessage(
        name: string,
        control: AbstractControl,
        customErrorMessages?: CustomErrorMessageMap): void {
          const currentErrors = control.errors
          const firstError = FormErrors.getFirstErrorMessage(name, control, customErrorMessages)
          if (firstError)
            control.setErrors({ ...currentErrors, firstError: firstError })     

    }



    //----------------------------//    


    static getFirstErrorMessage(
        name: string,
        control: AbstractControl,
        customErrorMessages?: CustomErrorMessageMap): string | null {

        const errorKey = this.firstErrorKey(control)
        if (!errorKey)
            return null


        const errorValue = control.errors?.[errorKey]
        const fieldName = this.toTitleCase(name) ?? 'This field'

        // Handle string error values (custom error messages)
        if (typeof errorValue === 'string')
            return errorValue


        const errorMessageFn = customErrorMessages?.get(errorKey) ?? errorMessageMap.get(errorKey);


        // Get error message function and call it
        if (errorMessageFn)
            return errorMessageFn(fieldName, errorValue)

        // Fallback for unknown error types
        return `Invalid value for ${fieldName}.`
    }

    //----------------------------//


    private static firstErrorKey = (control: AbstractControl): string | null =>
        Object.keys(control.errors || {}).length > 0 ? Object.keys(control.errors || {})[0] : null;


    //----------------------------//

    private static toTitleCase(s: string) {
        const result = s.replace(/([A-Z])/g, ' $1');
        return result.charAt(0).toUpperCase() + result.slice(1);
    }

}//Cls