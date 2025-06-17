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

        const errorValue = control.errors?.[`${errorKey}`]
       
        
        const errorMessagesMap: Map<string, string> = new Map([
            ['required', `${this.toTitleCase(key) ?? 'This field'} is required.`],
            ['email', 'Please enter a valid email address.'],
            ['minlength', !errorValue ? 'Value is too short' : `${this.toTitleCase(key)} must be at least ${errorValue?.requiredLength} characters`],
            ['maxlength', !errorValue ? 'Value is too long' : `${this.toTitleCase(key)} must be at no more than ${errorValue?.requiredLength} characters`],
        ])


        if (typeof errorValue === 'string')
            return errorValue


        return errorMessagesMap.get(errorKey) || `Invalid value for ${this.toTitleCase(key)}`
    }

    //----------------------------//

    private static firstErrorKey = (control: AbstractControl): string | null =>
        Object.keys(control.errors || {}).length > 0 ? Object.keys(control.errors || {})[0] : null;

    //----------------------------//

    private static toTitleCase = (s: string) => {

        const result = s.replace(/([A-Z])/g, ' $1');
        return result.charAt(0).toUpperCase() + result.slice(1);
    }

    //----------------------------//
    
}//Cls