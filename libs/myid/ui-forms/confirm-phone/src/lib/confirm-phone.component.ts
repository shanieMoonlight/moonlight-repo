import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FirstErrorComponent, FirstErrorDirective } from '@spider-baby/utils-forms';
import { SbButtonComponent } from '@spider-baby/ui-kit/buttons';
import { SbInputStyleDirective } from '@spider-baby/ui-kit/inputs';
import { UiKitTheme } from '@spider-baby/ui-kit/types';

//##########################//

export interface ConfirmPhoneFormDto {
  confirmationToken: string;
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
  color = input<UiKitTheme>('primary');

  protected _form: FormGroup<ConfirmPhoneForm> = this.fb.nonNullable.group({
    confirmationToken: ['', [Validators.required]]
  });

  

  submit() {
    if (!this._form.valid)
      return;

    const dto: ConfirmPhoneFormDto = {
      confirmationToken: this._form.controls.confirmationToken.value,
    };

    this.confirmPhone.emit(dto);
  }

}
