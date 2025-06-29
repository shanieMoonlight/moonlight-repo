import { ChangeDetectionStrategy, Component, inject, Input, input, output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SbButtonComponent } from '@spider-baby/ui-kit/buttons';
import { SbInputStyleDirective } from '@spider-baby/ui-kit/inputs';
import { SbSelectComponent } from '@spider-baby/ui-kit/select';
import { FirstErrorComponent, FirstErrorDirective } from '@spider-baby/utils-forms';
import { AddMntcMemberDto } from '@spider-baby/myid-io/models';
import { FormControl } from '@angular/forms';
import { MyIdTwoFactorOptionsProvider } from '@spider-baby/myid-ui-forms/utils';
import { teamPositionOptions } from '../../../utils/team-position-options';

//###########################//

export type AddMntcMemberFormDto = Pick<
    AddMntcMemberDto,
    | 'firstName'
    | 'lastName'
    | 'username'
    | 'email'
    | 'phoneNumber'
>;
// Strongly typed form interface
interface AddMntcMemberForm {
    firstName: FormControl<string | null>;
    lastName: FormControl<string | null>;
    username: FormControl<string | null>;
    email: FormControl<string>;
    phoneNumber: FormControl<string | null>;
    teamPosition: FormControl<number | null>;
}

//###########################//

@Component({
    selector: 'sb-add-mntc-member-form',
    standalone: true,
    imports: [
        ReactiveFormsModule,
        FirstErrorDirective,
        FirstErrorComponent,
        SbButtonComponent,
        SbInputStyleDirective,
        SbSelectComponent
    ],
    templateUrl: './add-mntc-member-form.component.html',
    styleUrl: './add-mntc-member-form.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SbAddMntcMemberFormComponent {

    private _fb = inject(FormBuilder);
    private _twoFactorOptionsProvider = inject(MyIdTwoFactorOptionsProvider);


    addMember = output<AddMntcMemberFormDto>();

    showLabels = input<boolean>(true);


    protected _twoFactorProviderOptions = this._twoFactorOptionsProvider.getOptions();
    protected _teamPositionOptions = teamPositionOptions

    protected _form: FormGroup<AddMntcMemberForm> = this._fb.nonNullable.group<AddMntcMemberForm>({
        firstName: this._fb.control<string | null>(''),
        lastName: this._fb.control<string | null>(''),
        username: this._fb.control<string | null>(''),
        email: this._fb.nonNullable.control<string>('', [Validators.required, Validators.email]),
        phoneNumber: this._fb.control<string | null>(''),
        teamPosition: this._fb.control<number | null>(null),
    });

    submit() {
        if (!this._form.valid)
            return;
        this.addMember.emit(this._form.getRawValue() as AddMntcMemberFormDto);
    }
}
