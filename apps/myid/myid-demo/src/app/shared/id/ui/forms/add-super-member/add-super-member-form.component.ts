import { ChangeDetectionStrategy, Component, inject, Input, input, output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SbButtonComponent } from '@spider-baby/ui-kit/buttons';
import { SbInputStyleDirective } from '@spider-baby/ui-kit/inputs';
import { SbSelectComponent } from '@spider-baby/ui-kit/select';
import { FirstErrorComponent, FirstErrorDirective, RemoveNullsService } from '@spider-baby/utils-forms';
import { AddSuperMemberDto } from '@spider-baby/myid-io/models';
import { FormControl } from '@angular/forms';
import { MyIdTwoFactorOptionsProvider } from '@spider-baby/myid-ui-forms/utils';
import { teamPositionOptions } from '../../../../auth/user-mgr-admin/utils/posiition/team-position-options';

//###########################//

export type AddSuperMemberFormDto = Pick<
  AddSuperMemberDto,
  | 'firstName'
  | 'lastName'
  | 'username'
  | 'email'
  | 'phoneNumber'
>;
// Strongly typed form interface
export interface AddSuperMemberForm {
  firstName: FormControl<string | null>;
  lastName: FormControl<string | null>;
  username: FormControl<string | null>;
  email: FormControl<string>;
  phoneNumber: FormControl<string | null>;
  teamPosition: FormControl<number | null>;
}

//###########################//

@Component({
  selector: 'sb-add-super-member-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FirstErrorDirective,
    FirstErrorComponent,
    SbButtonComponent,
    SbInputStyleDirective,
    SbSelectComponent
  ],
  templateUrl: './add-super-member-form.component.html',
  styleUrl: './add-super-member-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SbAddSuperMemberFormComponent {
  private _fb = inject(FormBuilder);
  private _twoFactorOptionsProvider = inject(MyIdTwoFactorOptionsProvider);
  private _removeNulls = inject(RemoveNullsService);

  //--------------------------//

  addMember = output<AddSuperMemberFormDto>();

  showLabels = input<boolean>(true);


  protected _teamPositionOptions = teamPositionOptions

  protected _form: FormGroup<AddSuperMemberForm> = this._fb.nonNullable.group<AddSuperMemberForm>({
    firstName: this._fb.control<string | null>(''),
    lastName: this._fb.control<string | null>(''),
    username: this._fb.control<string | null>(''),
    email: this._fb.nonNullable.control<string>('', [Validators.required, Validators.email]),
    phoneNumber: this._fb.control<string | null>(''),
    teamPosition: this._fb.control<number | null>(null),
  });

  //--------------------------//

  submit() {
    if (!this._form.valid)
      return;

    const cleanedForm = this._removeNulls.remove(this._form.getRawValue())
    this.addMember.emit(cleanedForm as AddSuperMemberFormDto);
  }
}
