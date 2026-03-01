/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { AbstractControl, FormArray, FormGroup } from "@angular/forms";


//##########################//

export type ErrorMessageFunction = (fieldName: string, errorValue: any) => string;
export type CustomErrorMessageMap = Map<string, ErrorMessageFunction>;


const errorMessageMap: CustomErrorMessageMap = new Map<string, ErrorMessageFunction>([
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
    ['phoneNumber', (fieldName, errorValue) => !errorValue.message ? 'Please enter a valid phone number.' : errorValue.message],
    ['url', () => 'Please enter a valid URL.'],
    ['unique', (fieldName) => `This ${fieldName.toLowerCase()} is already taken.`],
    ['fileSize', (fieldName, errorValue) => !errorValue ? 'File is too large' : `File size must be less than ${errorValue?.maxSize}.`],
    ['fileType', (fieldName, errorValue) => !errorValue ? 'Invalid file type' : `Only ${errorValue?.allowedTypes?.join(', ')} files are allowed.`]
]);


//##########################//


/**
 * Helper: FormErrors
 *
 * Convenience helpers to compute and attach the "first" validation message
 * for form controls. The methods in this class (for example
 * `setFirstErrors` and `setFirstErrorMessage`) will attach an error under the
 * `firstError` key on the control via `control.setErrors(...)`.
 *
 * Important: these helpers do NOT call `updateValueAndValidity()` on the form
 * or on the control. In addition, `setFirstErrorMessage` intentionally calls
 * `setErrors(..., { emitEvent: false })` to avoid emitting `statusChanges`.
 * As a result, callers that perform programmatic changes to the form (e.g.
 * `patchValue`, `setErrors`, enable/disable) should call
 * `form.updateValueAndValidity()` when they want validation to run and errors
 * to be reflected immediately in the UI. The directive `FirstErrorDirective`
 * intentionally leaves that decision up to the caller.
 */
@Injectable()
export class FirstErrorMessageService {

    private _titleCaseCache = new Map<string, string>();
    private _controlNameCache = new WeakMap<AbstractControl, string | null>();


    setFirstErrors(
        form: FormGroup,
        customErrorMessages?: CustomErrorMessageMap): void {

        const controls = form.controls
        for (const name in controls) {
            const control = controls[name]
            if (control.invalid)
                this.setFirstErrorMessage(control, customErrorMessages)
        }
    }


    //----------------------------//    


    setFirstErrorMessage(
        control: AbstractControl,
        customErrorMessages?: CustomErrorMessageMap,
    ): void {
        const name = this.resolveFromControl(control) ?? 'Field'

        const currentErrors = control.errors
        const firstErrorMessage = this.getFirstErrorMessage(name, control, customErrorMessages)
        if (firstErrorMessage)
            control.setErrors(
                { ...currentErrors, firstError: firstErrorMessage },
                { emitEvent: false }  // This prevents statusChanges emission
            )
    }


    //----------------------------//    


    getFirstErrorMessage(
        name: string,
        control: AbstractControl,
        customErrorMessages?: CustomErrorMessageMap,
    ): string | null {
        const errorKey = this.firstErrorKey(control)
        if (!errorKey)
            return null


        const errorValue = control.errors?.[errorKey]
        const fieldName = this.toTitleCase(name)

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

    /**
     * Resolves a control name from its parent relationship in the form tree.
     */
    private resolveFromControl(control: AbstractControl | null): string | null {
        if (!control)
            return null;

        if (this._controlNameCache.has(control))
            return this._controlNameCache.get(control) ?? null;

        let resolvedName: string | null = null;

        const parent = control.parent;
        if (!parent) {
            this._controlNameCache.set(control, null);
            return null;
        }

        if (parent instanceof FormGroup) {
            const controls = parent.controls;
            for (const key of Object.keys(controls)) {
                if (controls[key] === control) {
                    resolvedName = key;
                    break;
                }
            }
        }

        if (!resolvedName && parent instanceof FormArray) {
            const index = parent.controls.indexOf(control);
            if (index >= 0)
                resolvedName = String(index);
        }

        this._controlNameCache.set(control, resolvedName);
        return resolvedName;
    }

    //----------------------------//


    private firstErrorKey(control: AbstractControl): string | null {
        const errorKeys = Object.keys(control.errors || {});
        return errorKeys.length > 0 ? errorKeys[0] : null;
    }


    //----------------------------//

    private toTitleCase(s: string): string {
        const cachedValue = this._titleCaseCache.get(s);
        if (cachedValue)
            return cachedValue;

        const result = s.replace(/([A-Z])/g, ' $1');
        const titleCaseValue = result.charAt(0).toUpperCase() + result.slice(1);

        this._titleCaseCache.set(s, titleCaseValue);
        return titleCaseValue;
    }

}//Cls