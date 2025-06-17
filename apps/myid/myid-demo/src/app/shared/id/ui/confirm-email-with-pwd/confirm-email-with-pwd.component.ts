import { ChangeDetectionStrategy, Component, inject, input, Input, output, signal } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SbButtonComponent } from '../../../ui/button/button.component';
import { SbInputWithBtnDirective } from '../../../ui/input/input-with-btn.directive';
import { SbToggleIconButtonComponent } from '../../../ui/toggle-icon-button/toggle-icon-button.component';
import { FirstErrorDirective } from '../../../utils/forms/first-error.directive';
import { StrongPassword6WithSpecialRegx } from '../../utils/pwd-regexes';

//##########################//

export interface ConfirmEmailWithPwdDto {
    password: string;
    confirmPassword: string;
}

interface ConfirmEmailWithPwdForm {
    password: FormControl<string>;
    confirmPassword: FormControl<string>;
}

//##########################//

// Custom validator for password confirmation
function passwordMatchValidator(control: AbstractControl) {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (!password || !confirmPassword) {
        return null;
    }

    return password.value === confirmPassword.value ? null : { passwordMismatch: true };
}

@Component({
    selector: 'sb-confirm-email-with-pwd-form',
    standalone: true,
    imports: [
        ReactiveFormsModule,
        FirstErrorDirective,
        SbButtonComponent,
        SbInputWithBtnDirective,
        SbToggleIconButtonComponent,
    ],
    templateUrl: './confirm-email-with-pwd.component.html',
    styleUrl: './confirm-email-with-pwd.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmEmailWithPwdFormComponent {

    private fb = inject(FormBuilder);

    confirmEmail = output<ConfirmEmailWithPwdDto>();

    showLables = input<boolean>(true);

    @Input('strongPassword') set strongPassword(strongPwd: boolean | RegExp | undefined | null) {
        setTimeout(() => {
            if (!strongPwd)
                this._form.controls.password.setValidators([Validators.required])
            else if (strongPwd instanceof RegExp)
                this._form.controls.password.setValidators([Validators.required, Validators.pattern(strongPwd)])
            else
                this._form.controls.password.setValidators([Validators.required, Validators.pattern(StrongPassword6WithSpecialRegx)])
        }, 500)
    }


    protected showPassword = signal(false);
    protected showConfirmPassword = signal(false);

    protected _form: FormGroup<ConfirmEmailWithPwdForm> = this.fb.nonNullable.group({
        password: ['', [Validators.required, Validators.pattern(StrongPassword6WithSpecialRegx)]],
        confirmPassword: ['', [Validators.required]]
    }, { validators: passwordMatchValidator });



    private static _count = 10;
    protected _idSuffix = `-${ConfirmEmailWithPwdFormComponent._count++}`;

    //- - - - - - - - - - - -//

    protected submit() {
        if (!this._form.valid)
            return;

        const dto: ConfirmEmailWithPwdDto = {
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
