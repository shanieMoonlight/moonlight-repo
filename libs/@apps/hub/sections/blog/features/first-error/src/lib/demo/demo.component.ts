import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { SbButtonComponent, SbToggleIconButtonComponent } from '@spider-baby/ui-kit/buttons';
import { SbInputWithBtnDirective } from '@spider-baby/ui-kit/inputs';
import { FirstErrorComponent, FirstErrorDirective, FirstErrorMatComponent } from '@spider-baby/utils-forms';

//###################################//

function patternValidator(regex: RegExp, error: ValidationErrors): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
        // if control is empty return no error
        if (!control.value) return null;

        // test the value of the control against the regexp supplied
        const valid = regex.test(control.value);

        // if true, return no error (no error), else return error passed in the second parameter
        return valid ? null : error;
    };
}


function hasUppercaseValidator(): ValidatorFn {
    return patternValidator(/[A-Z]/, {
        hasUpper: 'Password must contain at least 1 uppercase letter',
    });
}

//----------------------------//

function hasLowercaseValidator(): ValidatorFn {
    return patternValidator(/[a-z]/, {
        hasLower: 'Password must contain at least 1 lowercase letter',
    });
}

//----------------------------//

function hasNumberValidator(): ValidatorFn {
    return patternValidator(/\d/, {
        hasNumber: 'Password must contain at least 1 number',
    });
}

//----------------------------//

function hasNonAlphaNumericValidator(): ValidatorFn {
    return patternValidator(/\W/, {
        hasNonAlpahaNumeric:
            'Password must contain at least 1 non-alphanumeric character',
    });
}


//###################################//

@Component({
    selector: 'sb-hub-blog-first-error-demo',
    standalone: true,
    imports: [
        ReactiveFormsModule,
        FirstErrorDirective,
        FirstErrorComponent,
        FirstErrorMatComponent,
        SbButtonComponent,
        SbToggleIconButtonComponent,
        SbInputWithBtnDirective,
        MatFormFieldModule,
        MatInputModule
    ],
    templateUrl: 'demo.component.html',
    styleUrl: 'demo.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FirstErrorDemoComponent {


    private _fb = inject(FormBuilder);

    protected _form: FormGroup = this._fb.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', [
            Validators.required,
            Validators.minLength(6),
            hasUppercaseValidator(),
            hasLowercaseValidator(),
            hasNumberValidator(),
            hasNonAlphaNumericValidator()
        ]],
    });

    protected _submitted = signal(false);
    protected showPassword = signal(false);

    protected _login = () => {
        this._submitted.set(true);
        if (this._form.valid) {
            alert('Login successful!');
        }
    };


    protected onPasswordToggle = (hide: boolean) => 
        this.showPassword.set(!hide);


}
