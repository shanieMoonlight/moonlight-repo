import { AbstractControl, FormControl, FormGroup } from "@angular/forms";

export class FromErrors {

    static setFirstErrors(form: FormGroup) {

        const controls = form.controls || {}
        Object.keys(controls).forEach(key => {
            const control = form.get(key) as FormControl
            if (control) {
                const currentErrors = control.errors
                const firstError = this.getFirstErrorMessage(key, control)

                if (firstError)
                    control.setErrors({ ...currentErrors, firstError: this.getFirstErrorMessage(key, control) })
            }
        })
    }

    //----------------------------//    

    static getFirstErrorMessage(key: string, control: AbstractControl): string {

        const errorKey = this.firstErrorKey(control)

        if (!errorKey)
            return ''

        const errorValue = control.errors?.[errorKey]
        const fieldName = this.toTitleCase(key) ?? 'This field'

        const errorMessagesMap: Map<string, string> = new Map([
            ['required', `${fieldName} is required.`],
            ['email', 'Please enter a valid email address.'],
            ['minlength', !errorValue ? 'Value is too short' : `${fieldName} must be at least ${errorValue?.requiredLength} characters.`],
            ['maxlength', !errorValue ? 'Value is too long' : `${fieldName} must be no more than ${errorValue?.requiredLength} characters.`],
            ['pattern', `${fieldName} format is invalid.`],
            ['min', !errorValue ? 'Value is too small' : `${fieldName} must be at least ${errorValue?.min}.`],
            ['max', !errorValue ? 'Value is too large' : `${fieldName} must be no more than ${errorValue?.max}.`],
            ['passwordMismatch', 'Passwords do not match.'],
            ['mustMatch', 'Fields do not match.'],
            ['whitespace', `${fieldName} cannot contain only whitespace.`],
            ['forbiddenValue', !errorValue ? 'This value is not allowed' : `${fieldName} cannot be "${errorValue?.value}".`],
            ['asyncValidation', `${fieldName} validation is pending...`],
            ['invalidDate', 'Please enter a valid date.'],
            ['futureDate', 'Date must be in the future.'],
            ['pastDate', 'Date must be in the past.'],
            ['strongPassword', 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.'],
            ['phoneNumber', 'Please enter a valid phone number.'],
            ['url', 'Please enter a valid URL.'],
            ['unique', `This ${fieldName.toLowerCase()} is already taken.`],
            ['fileSize', !errorValue ? 'File is too large' : `File size must be less than ${errorValue?.maxSize}.`],
            ['fileType', !errorValue ? 'Invalid file type' : `Only ${errorValue?.allowedTypes?.join(', ')} files are allowed.`]
        ])

        // Handle string error values (custom error messages)
        if (typeof errorValue === 'string')
            return errorValue

        // Return mapped message or fallback
        return errorMessagesMap.get(errorKey) || `Invalid value for ${fieldName}.`
    }

    //----------------------------//


    private static firstErrorKey = (control: AbstractControl): string | null =>
        Object.keys(control.errors || {}).length > 0 ? Object.keys(control.errors || {})[0] : null;


    //----------------------------//

    
    private static toTitleCase = (s: string) => {

        const result = s.replace(/([A-Z])/g, ' $1');
        return result.charAt(0).toUpperCase() + result.slice(1);
    }

}//Cls