import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { SbTeamFormComponent } from './team.component';
import { TeamType } from '../../../../io/models/team-type';

describe('SbTeamFormComponent', () => {
  let component: SbTeamFormComponent;
  let fixture: ComponentFixture<SbTeamFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        SbTeamFormComponent,
        ReactiveFormsModule,
        NoopAnimationsModule
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SbTeamFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should initialize form with default values', () => {
    expect(component.form.value).toEqual({
      id: '',
      name: '',
      description: '',
      minPosition: 1,
      maxPosition: 1,
      leaderId: '',
      teamType: 'customer'
    });
  });
  it('should validate required fields', () => {
    expect(component.form.controls.name.valid).toBeFalsy();
    expect(component.form.controls.teamType.valid).toBeTruthy(); // has default value
    expect(component.form.controls.minPosition.valid).toBeTruthy(); // has default value
    expect(component.form.controls.maxPosition.valid).toBeTruthy(); // has default value
  });

  it('should emit addTeam when form is valid and not in update mode', () => {
    jest.spyOn(component.addTeam, 'emit');
    
    component.form.patchValue({
      id: 'team-1',
      name: 'Customer Team',
      teamType: 'customer'
    });

    component.add();
    
    expect(component.addTeam.emit).toHaveBeenCalled();
  });

  it('should emit updateTeam when form is valid and in update mode', () => {
    jest.spyOn(component.updateTeam, 'emit');
    component['_isUpdateForm'].set(true);
    
    component.form.patchValue({
      id: 'team-1',
      name: 'Customer Team',
      teamType: 'customer'
    });

    component.update();
    
    expect(component.updateTeam.emit).toHaveBeenCalled();
  });

  it('should not emit when form is invalid', () => {
    jest.spyOn(component.addTeam, 'emit');
    
    // Form is invalid because name is required and empty
    component.add();
    
    expect(component.addTeam.emit).not.toHaveBeenCalled();
  });
  it('should set form values when team input is provided', () => {
    const mockTeam = {
      id: 'team-1',
      name: 'Test Team',
      description: 'Test Description',
      minPosition: 2,
      maxPosition: 8,
      leaderId: 'leader-1',
      teamType: 'maintenance' as TeamType
    };

    component.team = mockTeam;

    expect(component.form.value).toEqual({
      id: 'team-1',
      name: 'Test Team',
      description: 'Test Description',
      minPosition: 2,
      maxPosition: 8,
      leaderId: 'leader-1',
      teamType: 'maintenance'
    });
  });

  it('should reset form when team input is undefined', () => {
    // First set some values
    component.form.patchValue({
      name: 'Test Team',
      description: 'Test Description'
    });

    // Then set team to undefined
    component.team = undefined;

    expect(component.form.value).toEqual({
      id: '',
      name: '',
      description: '',
      minPosition: 1,
      maxPosition: 10,
      leaderId: '',
      teamType: 'customer'
    });
  });
});
