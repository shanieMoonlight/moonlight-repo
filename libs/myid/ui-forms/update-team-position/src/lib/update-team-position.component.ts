import { ChangeDetectionStrategy, Component, inject, Input, input, output, signal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AppUserDto, UpdatePositionDto } from '@spider-baby/myid-io/models';
import { FirstErrorComponent, FirstErrorDirective } from '@spider-baby/utils-forms';
// import { SbButtonComponent } from '../../../../ui/button/button.component';
import { SbButtonComponent } from '@spider-baby/ui-kit/buttons';
import { SbSelectComponent, SelectOption } from "@spider-baby/ui-kit/select";
import { UiKitTheme } from '@spider-baby/ui-kit/types';
import { SbInputStyleDirective } from '@spider-baby/ui-kit/inputs';

//##########################//

export type UpdateTeamPositionFormDto = Pick<
  UpdatePositionDto,
  | 'userId'
  | 'newPosition'
>;

export type UserInputDateDto = Pick<
  AppUserDto,
  | 'id'
  | 'email'
  | 'userName'
  | 'teamPosition'
>;

interface UpdateTeamPositionForm {
  userId: FormControl<string>;
  newPosition: FormControl<number>;
}

//##########################//

@Component({
  selector: 'sb-update-team-position-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FirstErrorDirective,
    FirstErrorComponent,
    SbButtonComponent,
    SbSelectComponent,
    SbInputStyleDirective,
  ],
  templateUrl: './update-team-position.component.html',
  styleUrl: './update-team-position.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SbUpdateTeamPositionFormComponent {

  private _fb = inject(FormBuilder);

  //- - - - - - - - - - - - -//


  showLables = input<boolean>(true);
  color = input<UiKitTheme>('primary');

  teamPositionOptions = input<SelectOption[]>()

  protected _member = signal<UserInputDateDto | undefined>(undefined);
  @Input({required: true})
  set member(value: UserInputDateDto) {
    this._member.set(value);
    console.log('UpdateTeamPositionFormComponent: member input set', this._member());
    
    this.setFormValues(value);
  }

  updatePosition = output<UpdateTeamPositionFormDto>();

  //- - - - - - - - - - - - -//

  protected _form: FormGroup<UpdateTeamPositionForm> = this._fb.nonNullable.group({
    userId: ['', [Validators.required]],
    newPosition: [0, [Validators.required]]
  });


  //-------------------------//


  setFormValues(dto: UserInputDateDto ) {
    if (!dto) {
      this._form.reset();
      return
    }


    this._form.patchValue({
      userId: dto.id,
      newPosition: dto.teamPosition
    });

  }

  //-------------------------//

  submit() {
    if (!this._form.valid)
      return;

    const dto: UpdateTeamPositionFormDto = {
      userId: this._form.controls.userId.value,
      newPosition: this._form.controls.newPosition.value,
    };

    this.updatePosition.emit(dto);
  }
}
