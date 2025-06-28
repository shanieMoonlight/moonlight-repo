import { ChangeDetectionStrategy, Component, inject, Input, input, output, signal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { FirstErrorComponent, FirstErrorDirective } from '@spider-baby/utils-forms';
import { SbButtonComponent } from '@spider-baby/ui-kit/buttons';
import { SbToggleIconButtonComponent } from '@spider-baby/ui-kit/buttons';
import { SbInputWithBtnDirective } from '@spider-baby/ui-kit/inputs';
import { SbInputStyleDirective } from '@spider-baby/ui-kit/inputs';
import { PasswordValidation } from '../utils/validators/password-validators';
import { UiKitTheme } from '@spider-baby/ui-kit/types';

export interface ChangePwdFormDto {
    email: string;
    password: string;
    newPassword: string;
    confirmPassword: string;
}

interface ChangePwdForm {
    email: FormControl<string>;
    password: FormControl<string>;
    newPassword: FormControl<string>;
    confirmPassword: FormControl<string>;
}

//##########################//

@Component({
    selector: 'sb-change-pwd-form',
    standalone: true,
    imports: [
        ReactiveFormsModule,
        FirstErrorDirective,
        FirstErrorComponent,
        SbButtonComponent,
        SbInputStyleDirective,
        SbInputWithBtnDirective,
        SbToggleIconButtonComponent,
    ],
    templateUrl: './change-pwd.component.html',
    styleUrl: './change-pwd.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChangePwdFormComponent {

    private fb = inject(FormBuilder);

    //- - - - - - - - - - - -//

    changePassword = output<ChangePwdFormDto>();

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

    protected showCurrentPassword = signal(false);
    protected showNewPassword = signal(false);
    protected showConfirmPassword = signal(false);

    protected _form: FormGroup<ChangePwdForm> = this.fb.nonNullable.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required]],
        newPassword: ['', [Validators.required, ...PasswordValidation.validationArray(6)]],
        confirmPassword: ['', [Validators.required]]
    }, { validators: PasswordValidation.matchValidator('newPassword', 'confirmPassword') });


    //- - - - - - - - - - - -//

    protected submit() {
        if (!this._form.valid)
            return;

        const dto: ChangePwdFormDto = {
            email: this._form.controls.email.value,
            password: this._form.controls.password.value,
            newPassword: this._form.controls.newPassword.value,
            confirmPassword: this._form.controls.confirmPassword.value,
        };

        this.changePassword.emit(dto);
    }

    protected onCurrentPasswordToggle = (hide: boolean) =>
        this.showCurrentPassword.set(!hide);

    protected onNewPasswordToggle = (hide: boolean) =>
        this.showNewPassword.set(!hide);

    protected onConfirmPasswordToggle = (hide: boolean) =>
        this.showConfirmPassword.set(!hide);

}//Cls
