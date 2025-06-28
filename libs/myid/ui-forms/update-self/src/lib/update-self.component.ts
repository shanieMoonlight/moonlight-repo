
import { ChangeDetectionStrategy, Component, inject, Input, input, output, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FirstErrorComponent, FirstErrorDirective } from '@spider-baby/utils-forms';
import { SbButtonComponent } from '@spider-baby/ui-kit/buttons';
import { SbCheckboxComponent } from '@spider-baby/ui-kit/checkboxes';
import { SbInputStyleDirective } from '@spider-baby/ui-kit/inputs';
import { SbSelectComponent, SelectOption } from '@spider-baby/ui-kit/select';
import { AppUserDto, TwoFactorProvider } from '@spider-baby/myid-io/models';
import { UpdateSelfFormDto, UpdateSelfForm } from './update-self.models';
import { JsonPipe } from '@angular/common';

export const twoFactorProviderOptions: SelectOption[] = [
  { value: 'authenticatorApp', label: 'Authenticator App' },
  { value: 'sms', label: 'SMS' },
  { value: 'email', label: 'Email' }
];

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
    SbCheckboxComponent,
    JsonPipe
  ],
  templateUrl: './update-self.component.html',
  styleUrl: './update-self.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SbUpdateSelfFormComponent {

  private fb = inject(FormBuilder);

  updateSelf = output<UpdateSelfFormDto>();

  showLables = input<boolean>(true);

  @Input({ required: true })
  public set appUser(user: AppUserDto) {
    console.log('UpdateSelfFormComponent: appUser input set', user);

    this.setFormValues(user);
    this._appUser.set(user);
  }
  protected _appUser = signal<AppUserDto | undefined>(undefined);
  protected _twoFactorProviderOptions = twoFactorProviderOptions;

  protected _form: FormGroup<UpdateSelfForm> = this.fb.nonNullable.group({
    id: ['', [Validators.required]],
    firstName: ['', [Validators.minLength(2)]],
    lastName: ['', [Validators.minLength(2)]],
    userName: ['', [Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    phoneNumber: ['', [Validators.required, Validators.pattern(/^\+?[\d\s\-()]+$/)]],
    twoFactorProvider: ['email' as TwoFactorProvider, [Validators.required]],
    twoFactorEnabled: [false],
  });

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
      twoFactorProvider: user.twoFactorProvider || 'email',
      twoFactorEnabled: user.twoFactorEnabled || false,
    });

  }

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

  update() {
    if (!this._form.valid)
      return;

    const dto: UpdateSelfFormDto = this.extractFormValues(this._form);
    this.updateSelf.emit(dto);
  }
}
