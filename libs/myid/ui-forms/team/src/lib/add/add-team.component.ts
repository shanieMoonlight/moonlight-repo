import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AppUserDto, TeamType } from '@spider-baby/myid-io/models';
import { SbButtonComponent } from '@spider-baby/ui-kit/buttons';
import { SbInputStyleDirective } from '@spider-baby/ui-kit/inputs';
import { UiKitTheme } from '@spider-baby/ui-kit/types';
import { FirstErrorComponent, FirstErrorDirective } from '@spider-baby/utils-forms';
import { NumericValidation } from '@spider-baby/utils-forms/validators';

//##########################//

export interface AddTeamFormDto {
  name: string;
  description?: string;
  minPosition: number;
  maxPosition: number;
  leaderId?: string;
  leader?: AppUserDto;
  members?: AppUserDto[];
  teamType: TeamType;
}

interface AddTeamForm {
  name: FormControl<string>;
  description: FormControl<string>;
  minPosition: FormControl<number>;
  maxPosition: FormControl<number>;
  leaderId: FormControl<string>;
  teamType: FormControl<TeamType>;
}

//##########################//

@Component({
  selector: 'sb-add-team-form',
  standalone: true,  
  imports: [
    ReactiveFormsModule,
    FirstErrorDirective,
    FirstErrorComponent,
    SbButtonComponent,
    SbInputStyleDirective
  ],
  templateUrl: './add-team.component.html',
  styleUrl: './add-team.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SbAddTeamFormComponent {

  private fb = inject(FormBuilder);

  showLabels = input<boolean>(true);
  color = input<UiKitTheme>('primary');
  canChangeTeamPositionRange = input(true);

  addTeam = output<AddTeamFormDto>();
  
  protected _form: FormGroup<AddTeamForm> = this.fb.nonNullable.group({
    // Basic Team Information
    name: ['', [Validators.required, Validators.minLength(2)]],
    description: [''],
    
    // Position Settings
    minPosition: [1, [Validators.required, Validators.min(1)]],
    maxPosition: [1, [Validators.required, Validators.min(1)]],    
    // Leadership
    leaderId: ['',[]],
    
    // Team Type (read-only, determined by server)
    teamType: ['customer' as TeamType]
  }, { validators: NumericValidation.lessThanValidator('minPosition', 'maxPosition', false) });

  //---------------------//

 protected extractFormValues(): AddTeamFormDto {

    const dto: AddTeamFormDto = {
      name: this._form.controls.name.value,
      description: this._form.controls.description.value || undefined,
      minPosition: this._form.controls.minPosition.value,
      maxPosition: this._form.controls.maxPosition.value,
      leaderId: this._form.controls.leaderId.value || undefined,
      teamType: this._form.controls.teamType.value
    };

    return dto;
  }
  
  //- - - - - - - - - - -//

 protected add() {
    if (!this._form.valid)
      return;

    const dto: AddTeamFormDto = this.extractFormValues();
    this.addTeam.emit(dto);
  }

}//Cls
