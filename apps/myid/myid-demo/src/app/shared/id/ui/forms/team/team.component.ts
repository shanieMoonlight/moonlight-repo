import { TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, Input, input, output, signal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FirstErrorComponent, FirstErrorDirective } from '@spider-baby/utils-forms';
import { AppUserDto } from '../../../../io/models/app-user-dto';
import { TeamType } from '../../../../io/models/team-type';
import { SbButtonComponent } from '../../../../ui/buttons';
import { SbInputStyleDirective } from '../../../../ui/input/input.directive';
import { SbSelectComponent, SelectOption } from '../../../../ui/select/select.component';

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
  standalone: true,  imports: [
    ReactiveFormsModule,
    FirstErrorDirective,
    FirstErrorComponent,
    SbButtonComponent,
    SbInputStyleDirective,
    TitleCasePipe,
    SbSelectComponent
  ],
  templateUrl: './team.component.html',
  styleUrl: './team.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SbTeamFormComponent {

  private fb = inject(FormBuilder);

  showLables = input<boolean>(true);
  addTeam = output<TeamFormDto>();
  updateTeam = output<TeamFormDto>();

  @Input()
  public set team(team: TeamFormDto | undefined) {
    this.setFormValues(team);
    this._isUpdateForm.set(!!team);
  }  
  
  protected _isUpdateForm = signal(false);
  protected _memberOptions = signal<SelectOption[]>([]);

  public form: FormGroup<TeamForm> = this.fb.nonNullable.group({
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
  });

  //---------------------//

  
  setFormValues(team: TeamFormDto | undefined) {
    if (team) {
      // Update form values
      this.form.patchValue({
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
      this.form.reset({
        id: '',
        name: '',
        description: '',
        minPosition: 1,
        maxPosition: 10,
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
      id: this.form.controls.id.value,
      name: this.form.controls.name.value,
      description: this.form.controls.description.value || undefined,
      minPosition: this.form.controls.minPosition.value,
      maxPosition: this.form.controls.maxPosition.value,
      leaderId: this.form.controls.leaderId.value || undefined,
      teamType: this.form.controls.teamType.value
    };

    return dto;
  }
  
  //- - - - - - - - - - -//


  add() {
    if (!this.form.valid)
      return;

    const dto: TeamFormDto = this.extractFormValues();
    this.addTeam.emit(dto);
  }

  //- - - - - - - - - - -//

  update() {
    if (!this.form.valid)
      return;

    const dto: TeamFormDto = this.extractFormValues();
    this.updateTeam.emit(dto);
  }

}//Cls
