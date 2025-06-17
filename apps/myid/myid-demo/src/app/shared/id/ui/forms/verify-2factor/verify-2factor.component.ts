import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SbButtonComponent } from '../../../ui/button/button.component';
import { SbInputStyleDirective } from '../../../ui/input/input.directive';
import { FirstErrorDirective } from '../../../utils/forms/first-error.directive';

//##########################//

export interface Verify2FactorTknDto {
  token: string;
}

interface Verify2FactorForm {
  token: FormControl<string>;
}

//##########################//

@Component({
  selector: 'sb-verify-2factor-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FirstErrorDirective,
    SbButtonComponent,
    SbInputStyleDirective,
  ],
  templateUrl: './verify-2factor.component.html',
  styleUrl: './verify-2factor.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SbVerify2FactorFormComponent {

  private fb = inject(FormBuilder);

  showLables = input<boolean>(true);
  verify2Factor = output<Verify2FactorTknDto>();

  protected form: FormGroup<Verify2FactorForm> = this.fb.nonNullable.group({
    token: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]]
  });

  private static _count = 0;
  protected _idSuffix = `-${SbVerify2FactorFormComponent._count++}`;

  submit() {
    if (!this.form.valid)
      return;

    const dto: Verify2FactorTknDto = {
      token: this.form.controls.token.value,
    };

    this.verify2Factor.emit(dto);
  }
}
