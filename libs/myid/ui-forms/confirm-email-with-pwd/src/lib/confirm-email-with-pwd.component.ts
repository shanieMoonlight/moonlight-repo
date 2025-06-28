import { ChangeDetectionStrategy, Component, inject, input, Input, output, signal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { FirstErrorComponent, FirstErrorDirective } from '@spider-baby/utils-forms';
import { SbButtonComponent } from '@spider-baby/ui-kit/buttons';
import { SbToggleIconButtonComponent } from '@spider-baby/ui-kit/buttons';
import { SbInputWithBtnDirective } from '@spider-baby/ui-kit/inputs';
import { PasswordValidation } from '@spider-baby/utils-forms/validators';
import { UiKitTheme } from '@spider-baby/ui-kit/types';

//##########################//

export interface ConfirmEmailWithPwdFormDto {
    password: string;
    confirmPassword: string;
}

interface ConfirmEmailWithPwdForm {
    password: FormControl<string>;
    confirmPassword: FormControl<string>;
}

//##########################//

@Component({
    selector: 'sb-confirm-email-with-pwd-form',
    standalone: true,
    imports: [
        ReactiveFormsModule,
        FirstErrorDirective,
        FirstErrorComponent,
        SbButtonComponent,
        SbInputWithBtnDirective,
        SbToggleIconButtonComponent
    ],
    templateUrl: './confirm-email-with-pwd.component.html',
    styleUrl: './confirm-email-with-pwd.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmEmailWithPwdFormComponent {

    private fb = inject(FormBuilder);

    //- - - - - - - - - - - -//

    confirmEmail = output<ConfirmEmailWithPwdFormDto>();


    showLables = input<boolean>(true);
    color = input<UiKitTheme>('primary');

    /**
     * Allows consumers to customize the password field's validation.
     *
     * - Pass an array of Angular ValidatorFn to apply custom validation rules.
     * - Pass null or undefined to disable extra authentication (only required validation will be applied).
     * - If not set, defaults to strong password validation using PasswordValidation.validationArray(6).
     *
     * Example usage:
     *   [passwordValidators]="[Validators.required, Validators.minLength(10)]"
     *   [passwordValidators]="null"
     */
    @Input()
    set passwordValidators(validators: ValidatorFn[] | undefined | null) {
        setTimeout(() => {
            if (!validators?.length)
                this._form.controls.password.setValidators([Validators.required])
            else
                this._form.controls.password.setValidators([Validators.required, ...validators])
        }, 500)
    }

    //- - - - - - - - - - - -//

    protected showPassword = signal(false);
    protected showConfirmPassword = signal(false);

    protected _form: FormGroup<ConfirmEmailWithPwdForm> = this.fb.nonNullable
        .group({
            password: ['', [Validators.required, ...PasswordValidation.validationArray(6)]],
            confirmPassword: ['', [Validators.required]]
        }, { validators: PasswordValidation.matchValidator() });


    //- - - - - - - - - - - -//

    protected submit() {
        if (!this._form.valid)
            return;

        const dto: ConfirmEmailWithPwdFormDto = {
            password: this._form.controls.password.value,
            confirmPassword: this._form.controls.confirmPassword.value,
        };

        this.confirmEmail.emit(dto);
    }

    protected onPasswordToggle = (hide: boolean) =>
        this.showPassword.set(!hide);


    protected onConfirmPasswordToggle = (hide: boolean) =>
        this.showConfirmPassword.set(!hide);

}
