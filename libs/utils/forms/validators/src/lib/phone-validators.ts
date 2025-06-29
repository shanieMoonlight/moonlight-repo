import { AbstractControl, ValidatorFn } from '@angular/forms';
import { devConsole } from '@spider-baby/dev-console';
import { CountryCode, ParseError, validatePhoneNumberLength } from 'libphonenumber-js';

//##########################//


interface PhoneValidationResult {
    phoneNumber?: {
        message: string;
    }
}


//##########################//

export class PhoneValidation {

    // Custom validator for password confirmation
    static validator(defaultCountry: CountryCode = 'IE'): ValidatorFn {
        return (control: AbstractControl): PhoneValidationResult | null => {
            const value = control.value;
            if (!value) 
                return null;
            try {
                const result = validatePhoneNumberLength(value, defaultCountry);
                
                if (!result)
                    return null; // valid length
                let reason = '';
                reason = ` : ${result}`;
                return {
                    phoneNumber: {
                        message: `Invalid phone number. Reason: ${reason}`,
                    }
                };

                // return null; // valid
            } catch (error: unknown) {
                let reason = '';
                if (error instanceof ParseError)
                    reason = ` : ${error.message}`;
                return {
                    phoneNumber: {
                        message: `Invalid phone number. Reason: ${reason}`,
                    }
                };
            }
        };
    }

} //Cls
