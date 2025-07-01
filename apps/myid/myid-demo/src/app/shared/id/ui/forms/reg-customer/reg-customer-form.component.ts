import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, Input, input, output, signal, TemplateRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { RegisterCustomerDto } from '@spider-baby/myid-io/models';
import { MyIdPhoneFormatProvider, MyIdTwoFactorOptionsProvider } from '@spider-baby/myid-ui-forms/utils';
import { SbButtonComponent, SbToggleIconButtonComponent } from '@spider-baby/ui-kit/buttons';
import { SbInputStyleDirective, SbInputWithBtnDirective } from '@spider-baby/ui-kit/inputs';
import { UiKitTheme } from '@spider-baby/ui-kit/types';
import { FirstErrorComponent, FirstErrorDirective, RemoveNullsService } from '@spider-baby/utils-forms';
import { PasswordValidation, PhoneValidation } from '@spider-baby/utils-forms/validators';
import { teamPositionOptions } from '../../../utils/team-position-options';

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
        NgTemplateOutlet,
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
  private _phoneFormatter = inject(MyIdPhoneFormatProvider)

    //--------------------------//

    register = output<RegisterCustomerFormDto>();

    showLabels = input<boolean>(true);
    color = input<UiKitTheme>('primary');
    socialTemplate = input<TemplateRef<unknown> | undefined>(undefined)

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
        phoneNumber: this._fb.control<string | null>('', [PhoneValidation.validator()]),
        password: this._fb.nonNullable.control<string>('', [Validators.required, ...PasswordValidation.validationArray(6)]),
        confirmPassword: this._fb.nonNullable.control<string>('', [Validators.required])
    }, { validators: PasswordValidation.matchValidator() });

    //--------------------------//

    constructor() {
        this._form.controls.phoneNumber.valueChanges.subscribe(phone => {
            if (!phone)
                return
            const formattedPhone = this._phoneFormatter.formatPhoneInternational(phone);
            if (phone != formattedPhone)
                this._form.controls.phoneNumber.setValue(formattedPhone);
        })

    }

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
