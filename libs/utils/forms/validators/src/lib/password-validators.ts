import {
    ValidatorFn,
    AbstractControl,
    ValidationErrors,
    Validators,
} from '@angular/forms';


//##########################//


interface PwdMatchValidationResult {
    passwordMismatch?: string;
}


//##########################//

export class PasswordValidation {

    static validationArray = (minLength = 6) => [
        Validators.required,
        Validators.minLength(minLength),
        PasswordValidation.hasLowercaseValidator(),
        PasswordValidation.hasUppercaseValidator(),
        PasswordValidation.hasNumberValidator(),
        PasswordValidation.hasNonAlphaNumericValidator(),
    ]


    //----------------------------//


    // Custom validator for password confirmation
    static matchValidator(
        passwordControlName: string = 'password',
        confirmPasswordControlName: string = 'confirmPassword',
        errorMessage: string = "Passwords don't match"): ValidatorFn {

        return (control: AbstractControl): PwdMatchValidationResult | null => {
            const password = control.get(passwordControlName);
            const confirmPassword = control.get(confirmPasswordControlName);

            if (!password || !confirmPassword)
                return null;

            return password.value === confirmPassword.value
                ? null
                : { passwordMismatch: errorMessage ?? "Passwords don't match" };
        }

    }

    //----------------------------//

    static patternValidator(regex: RegExp, error: ValidationErrors): ValidatorFn {
        return (control: AbstractControl): { [key: string]: any } | null => {
            // if control is empty return no error
            if (!control.value) return null;

            // test the value of the control against the regexp supplied
            const valid = regex.test(control.value);

            // if true, return no error (no error), else return error passed in the second parameter
            return valid ? null : error;
        }; 
    }

    //----------------------------//

    static hasUppercaseValidator(): ValidatorFn {
        return PasswordValidation.patternValidator(/[A-Z]/, {
            hasUpper: 'Password must contain at least 1 uppercase letter',
        });
    }

    //----------------------------//

    static hasLowercaseValidator(): ValidatorFn {
        return PasswordValidation.patternValidator(/[a-z]/, {
            hasLower: 'Password must contain at least 1 lowercase letter',
        });
    }

    //----------------------------//

    static hasNumberValidator(): ValidatorFn {
        return PasswordValidation.patternValidator(/\d/, {
            hasNumber: 'Password must contain at least 1 number',
        });
    }

    //----------------------------//

    static hasNonAlphaNumericValidator(): ValidatorFn {
        return PasswordValidation.patternValidator(/\W/, {
            hasNonAlpahaNumeric:
                'Password must contain at least 1 non-alphanumeric character',
        });
    }


} //Cls
