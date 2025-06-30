import { ChangeDetectionStrategy, Component, inject, Input, input, output, signal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { RegisterCustomerDto } from '@spider-baby/myid-io/models';
import { MyIdTwoFactorOptionsProvider } from '@spider-baby/myid-ui-forms/utils';
import { SbButtonComponent, SbToggleIconButtonComponent } from '@spider-baby/ui-kit/buttons';
import { SbInputStyleDirective, SbInputWithBtnDirective } from '@spider-baby/ui-kit/inputs';
import { SbSelectComponent } from '@spider-baby/ui-kit/select';
import { FirstErrorComponent, FirstErrorDirective, RemoveNullsService } from '@spider-baby/utils-forms';
import { teamPositionOptions } from '../../../utils/team-position-options';
import { PasswordValidation } from '@spider-baby/utils-forms/validators';
import { UiKitTheme } from '@spider-baby/ui-kit/types';

//###########################//

export type RegisterCustomerFormDto = Pick<
    RegisterCustomerDto,
    | 'firstName'
    | 'lastName'
    | 'username'
    | 'email'
    | 'phoneNumber'
    | 'password'
    | 'confirmPassword'
>;

// Strongly typed form interface
interface RegisterCustomerForm {
    firstName: FormControl<string | null>;
    lastName: FormControl<string | null>;
    username: FormControl<string | null>;
    email: FormControl<string>;
    phoneNumber: FormControl<string | null>;
    teamPosition: FormControl<number | null>;
    password: FormControl<string>;
    confirmPassword: FormControl<string>;
}

//###########################//

@Component({
    selector: 'sb-reg-customer-form',
    standalone: true,
    imports: [
        ReactiveFormsModule,
        FirstErrorDirective,
        FirstErrorComponent,
        SbButtonComponent,
        SbInputStyleDirective,
        SbSelectComponent,
        SbToggleIconButtonComponent,
        SbInputWithBtnDirective
    ],
    templateUrl: './reg-customer-form.component.html',
    styleUrl: './reg-customer-form.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SbRegisterCustomerFormComponent {

    private _fb = inject(FormBuilder);
    private _twoFactorOptionsProvider = inject(MyIdTwoFactorOptionsProvider);
    private _removeNulls = inject(RemoveNullsService);

    //--------------------------//

    register = output<RegisterCustomerFormDto>();

    showLabels = input<boolean>(true);
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




    protected _twoFactorProviderOptions = this._twoFactorOptionsProvider.getOptions();
    protected _teamPositionOptions = teamPositionOptions

    protected showPassword = signal(false);
    protected showConfirmPassword = signal(false);

    protected _form: FormGroup<RegisterCustomerForm> = this._fb.nonNullable.group<RegisterCustomerForm>({
        firstName: this._fb.control<string | null>(''),
        lastName: this._fb.control<string | null>(''),
        username: this._fb.control<string | null>(''),
        email: this._fb.nonNullable.control<string>('', [Validators.required, Validators.email]),
        phoneNumber: this._fb.control<string | null>(''),
        teamPosition: this._fb.control<number | null>(null),
        password: this._fb.nonNullable.control<string>('Abc123!', [Validators.required, ...PasswordValidation.validationArray(6)]),
        confirmPassword: this._fb.nonNullable.control<string>('Abc123!', [Validators.required])
    }, { validators: PasswordValidation.matchValidator() });

    //--------------------------//

    submit() {
        if (!this._form.valid)
            return;

        const cleanedForm = this._removeNulls.remove(this._form.getRawValue())
        this.register.emit(cleanedForm as RegisterCustomerFormDto);
    }


    protected onPasswordToggle = (hide: boolean) =>
        this.showPassword.set(!hide);


    protected onConfirmPasswordToggle = (hide: boolean) =>
        this.showConfirmPassword.set(!hide);

}
