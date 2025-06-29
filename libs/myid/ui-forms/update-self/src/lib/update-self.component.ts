
import { ChangeDetectionStrategy, Component, inject, Input, input, output, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TwoFactorProvider } from '@spider-baby/myid-io/models';
import { MyIdPhoneFormatProvider, MyIdTwoFactorOptionsProvider, } from '@spider-baby/myid-ui-forms/utils';
import { SbButtonComponent } from '@spider-baby/ui-kit/buttons';
import { SbCheckboxComponent } from '@spider-baby/ui-kit/checkboxes';
import { SbInputStyleDirective } from '@spider-baby/ui-kit/inputs';
import { SbSelectComponent } from '@spider-baby/ui-kit/select';
import { FirstErrorComponent, FirstErrorDirective } from '@spider-baby/utils-forms';
import { PhoneValidation } from '@spider-baby/utils-forms/validators';
import { UpdateSelfForm, UpdateSelfFormDto } from './update-self.models';


@Component({
  selector: 'sb-update-self-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FirstErrorDirective,
    FirstErrorComponent,
    SbButtonComponent,
    SbInputStyleDirective,
    SbSelectComponent,
    SbCheckboxComponent
  ],
  templateUrl: './update-self.component.html',
  styleUrl: './update-self.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SbUpdateSelfFormComponent {

  private _fb = inject(FormBuilder);
  private _phoneFormatter = inject(MyIdPhoneFormatProvider)
  private _twoFactorOptionsProvider = inject(MyIdTwoFactorOptionsProvider);

  updateSelf = output<UpdateSelfFormDto>();

  showLables = input<boolean>(true);

  @Input({ required: true })
  public set appUser(user: UpdateSelfFormDto) {
    console.log('UpdateSelfFormComponent: appUser input set', user);

    this.setFormValues(user);
    this._appUser.set(user);
  }
  protected _appUser = signal<UpdateSelfFormDto | undefined>(undefined);
  protected _twoFactorProviderOptions = this._twoFactorOptionsProvider.getOptions();

  protected _form: FormGroup<UpdateSelfForm> = this._fb.nonNullable.group({
    id: ['', [Validators.required]],
    firstName: ['', [Validators.minLength(2)]],
    lastName: ['', [Validators.minLength(2)]],
    userName: ['', [Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    phoneNumber: ['', [Validators.required, PhoneValidation.validator()]],
    twoFactorProvider: ['Email' as TwoFactorProvider, [Validators.required]],
    twoFactorEnabled: [false],
  });



  /**
   *
   */
  constructor() {
    this._form.controls.phoneNumber.valueChanges.subscribe(phone => {
      if (!phone)
        return
      const formattedPhone = this._phoneFormatter.formatPhoneInternational(phone);
      if (phone != formattedPhone)
        this._form.controls.phoneNumber.setValue(formattedPhone);
    })

  }

  //-------------------------//

  setFormValues(user: UpdateSelfFormDto | undefined) {
    if (!user) {
      this._form.reset();
      return
    }


    this._form.patchValue({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      userName: user.userName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      twoFactorProvider: user.twoFactorProvider || 'Email',
      twoFactorEnabled: user.twoFactorEnabled || false,
    });

  }
  
  //-------------------------//

  extractFormValues(form: FormGroup<UpdateSelfForm>): UpdateSelfFormDto {
    const formValue = form.getRawValue();
    const dto: UpdateSelfFormDto = {
      id: formValue.id,
      firstName: formValue.firstName,
      lastName: formValue.lastName,
      userName: formValue.userName,
      email: formValue.email,
      phoneNumber: formValue.phoneNumber,
      twoFactorProvider: formValue.twoFactorProvider,
      twoFactorEnabled: formValue.twoFactorEnabled,
    };
    return dto;
  }

  //-------------------------//

  update() {
    if (!this._form.valid)
      return;

    const dto: UpdateSelfFormDto = this.extractFormValues(this._form);
    this.updateSelf.emit(dto);
  }

}//Cls
