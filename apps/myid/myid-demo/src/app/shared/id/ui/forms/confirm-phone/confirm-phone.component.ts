import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SbButtonComponent } from '../../../../ui/button/button.component';
import { SbInputStyleDirective } from '../../../../ui/input/input.directive';
import { FirstErrorDirective } from '../../../../utils/forms/first-error.directive';
import { FirstErrorComponent } from '../../../../utils/forms/first-error.component';

//##########################//

export interface ConfirmPhoneFormDto {
  confirmationToken?: string;
}

interface ConfirmPhoneForm {
  confirmationToken: FormControl<string>;
}

//##########################//

@Component({
  selector: 'sb-confirm-phone-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FirstErrorDirective,
    FirstErrorComponent,
    SbButtonComponent,
    SbInputStyleDirective,
  ],
  templateUrl: './confirm-phone.component.html',
  styleUrl: './confirm-phone.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SbConfirmPhoneFormComponent {

  private fb = inject(FormBuilder);

  showLables = input<boolean>(true);
  confirmPhone = output<ConfirmPhoneFormDto>();

  protected _form: FormGroup<ConfirmPhoneForm> = this.fb.nonNullable.group({
    confirmationToken: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]]
  });

  

  submit() {
    if (!this._form.valid)
      return;

    const dto: ConfirmPhoneFormDto = {
      confirmationToken: this._form.controls.confirmationToken.value || undefined,
    };

    this.confirmPhone.emit(dto);
  }
}
