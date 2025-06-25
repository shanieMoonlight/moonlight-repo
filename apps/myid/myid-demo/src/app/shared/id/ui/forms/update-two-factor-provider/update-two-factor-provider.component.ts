import { ChangeDetectionStrategy, Component, inject, Input, input, output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FirstErrorComponent, FirstErrorDirective } from '@spider-baby/utils-forms';
import { TwoFactorProvider } from '@spider-baby/myid-io/models';
// import { SbButtonComponent } from '../../../../ui/button/button.component';
import { SbButtonComponent } from '../../../../ui/buttons';
import { SbSelectComponent, SelectOption } from '../../../../ui/select/select.component';

//##########################//

export interface UpdateTwoFactorProviderFormDto {
  provider: TwoFactorProvider;
}

interface UpdateTwoFactorProviderForm {
  provider: FormControl<TwoFactorProvider>;
}

//##########################//

@Component({
  selector: 'sb-update-two-factor-provider-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FirstErrorDirective,
    FirstErrorComponent,
    SbButtonComponent,
    SbSelectComponent,
  ],
  templateUrl: './update-two-factor-provider.component.html',
  styleUrl: './update-two-factor-provider.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SbUpdateTwoFactorProviderFormComponent {

  private fb = inject(FormBuilder);


  showLables = input<boolean>(true);
  updateProvider = output<UpdateTwoFactorProviderFormDto>();

  @Input()
  set currentProvider(value: TwoFactorProvider) {
    this._form.controls.provider.setValue(value);
  }


  protected _providerOptions: SelectOption[] = [
    { value: 'authenticatorApp', label: 'Authenticator App' },
    { value: 'sms', label: 'SMS' },
    { value: 'email', label: 'Email' }
  ];

  protected _form: FormGroup<UpdateTwoFactorProviderForm> = this.fb.nonNullable.group({
    provider: ['email' as TwoFactorProvider, [Validators.required]]
  });

  submit() {
    if (!this._form.valid)
      return;

    const dto: UpdateTwoFactorProviderFormDto = {
      provider: this._form.controls.provider.value,
    };

    this.updateProvider.emit(dto);
  }
}
