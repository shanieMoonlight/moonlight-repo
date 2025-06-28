import { ChangeDetectionStrategy, Component, inject, Input, input, output, signal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AppUserDto, TeamType } from '@spider-baby/myid-io/models';
import { SbButtonComponent } from '@spider-baby/ui-kit/buttons';
import { SbInputStyleDirective } from '@spider-baby/ui-kit/inputs';
import { SbSelectComponent, SelectOption } from "@spider-baby/ui-kit/select";
import { UiKitTheme } from '@spider-baby/ui-kit/types';
import { FirstErrorComponent, FirstErrorDirective } from '@spider-baby/utils-forms';
import { NumericValidation } from '@spider-baby/utils-forms/validators';

//##########################//

export interface TeamFormDto {
  id: string;
  name: string;
  description?: string;
  minPosition: number;
  maxPosition: number;
  leaderId?: string;
  leader?: AppUserDto;
  members?: AppUserDto[];
  teamType: TeamType;
}

interface TeamForm {
  id: FormControl<string>;
  name: FormControl<string>;
  description: FormControl<string>;
  minPosition: FormControl<number>;
  maxPosition: FormControl<number>;
  leaderId: FormControl<string>;
  teamType: FormControl<TeamType>;
}

//##########################//

@Component({
  selector: 'sb-team-form',
  standalone: true,  
  imports: [
    ReactiveFormsModule,
    FirstErrorDirective,
    FirstErrorComponent,
    SbButtonComponent,
    SbInputStyleDirective,
    SbSelectComponent
  ],
  templateUrl: './team.component.html',
  styleUrl: './team.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SbTeamFormComponent {

  private fb = inject(FormBuilder);

  showLables = input<boolean>(true);
  color = input<UiKitTheme>('primary');
  canChangeTeamPositionRange = input(true);

  addTeam = output<TeamFormDto>();
  updateTeam = output<TeamFormDto>();

  @Input()
  public set team(team: TeamFormDto | undefined) {
    this.setFormValues(team);
    this._isUpdateForm.set(!!team);
  }  
  
  protected _isUpdateForm = signal(false);
  protected _memberOptions = signal<SelectOption[]>([]);

  protected _form: FormGroup<TeamForm> = this.fb.nonNullable.group({
    // Basic Team Information
    id: ['', [Validators.required]],
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

  
  setFormValues(team: TeamFormDto | undefined) {
    if (team) {
      // Update form values
      this._form.patchValue({
        id: team.id,
        name: team.name,
        description: team.description || '',
        minPosition: team.minPosition,
        maxPosition: team.maxPosition,
        leaderId: team.leaderId || '',
        teamType: team.teamType || 'customer'
      });
      
      // Generate member options for the dropdown
      this.updateMemberOptions(team.members || []);
    } else {
      this._form.reset({
        id: '',
        name: '',
        description: '',
        minPosition: 1,
        maxPosition: 1,
        leaderId: '',
        teamType: 'customer'
      });
      
      // Clear member options
      this._memberOptions.set([]);
    }
  }

  /**
   * Creates select options from a list of team members
   */
  updateMemberOptions(members: AppUserDto[]) {
    const options: SelectOption[] = members.map(member => ({
      value: member.id,
      label: `${member.firstName} ${member.lastName} (${member.userName})`
    }));
    
    // Add an empty option for clearing the selection
    options.unshift({
      value: '',
      label: '-- Select Team Leader --'
    });
    
    this._memberOptions.set(options);
  }

  //- - - - - - - - - - -//

  extractFormValues(): TeamFormDto {

    const dto: TeamFormDto = {
      id: this._form.controls.id.value,
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


  add() {    
    if (!this._form.valid)
      return;

    const dto: TeamFormDto = this.extractFormValues();
    this.addTeam.emit(dto);
  }

  //- - - - - - - - - - -//

  update() {
    if (!this._form.valid)
      return;

    const dto: TeamFormDto = this.extractFormValues();
    this.updateTeam.emit(dto);
  }

}//Cls
