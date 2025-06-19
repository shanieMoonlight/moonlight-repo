import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FirstErrorComponent, FirstErrorDirective } from '@spider-baby/utils-forms';
import { SbButtonComponent } from '../../../../ui/buttons/button/button.component';
import { SbInputStyleDirective } from '../../../../ui/input/input.directive';

//##########################//

export interface Verify2FactorTknFormDto {
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
    FirstErrorComponent,
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
  verify2Factor = output<Verify2FactorTknFormDto>();

  protected form: FormGroup<Verify2FactorForm> = this.fb.nonNullable.group({
    token: ['', [Validators.required]]
  });


  submit() {
    if (!this.form.valid)
      return;

    const dto: Verify2FactorTknFormDto = {
      token: this.form.controls.token.value,
    };

    this.verify2Factor.emit(dto);
  }
}
