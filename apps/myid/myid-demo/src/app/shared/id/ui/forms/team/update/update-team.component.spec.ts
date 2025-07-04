import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { TeamType, TwoFactorProvider } from '@spider-baby/myid-io/models';
import { SbUpdateTeamFormComponent } from './update-team.component';

describe('SbUpdateTeamFormComponent', () => {
  let component: SbUpdateTeamFormComponent;
  let fixture: ComponentFixture<SbUpdateTeamFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        SbUpdateTeamFormComponent,
        ReactiveFormsModule,
        NoopAnimationsModule
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SbUpdateTeamFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should initialize form with default values', () => {
    expect(component['_form'].value).toEqual({
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
    expect(component['_form'].controls.name.valid).toBeFalsy();
    expect(component['_form'].controls.teamType.valid).toBeTruthy(); // has default value
    expect(component['_form'].controls.minPosition.valid).toBeTruthy(); // has default value
    expect(component['_form'].controls.maxPosition.valid).toBeTruthy(); // has default value
  });


  it('should emit updateTeam when form is valid and in update mode', () => {
    jest.spyOn(component.updateTeam, 'emit');
    
    component['_form'].patchValue({
      id: 'team-1',
      name: 'Customer Team',
      teamType: 'customer'
    });

    component.update();
    
    expect(component.updateTeam.emit).toHaveBeenCalled();
  });

  it('should not emit when form is invalid', () => {
    jest.spyOn(component.updateTeam, 'emit');
    
    // Form is invalid because name is required and empty
    component.update();
    
    expect(component.updateTeam.emit).not.toHaveBeenCalled();
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

    expect(component['_form'].value).toEqual({
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
    component['_form'].patchValue({
      name: 'Test Team',
      description: 'Test Description'
    });

    // Then set team to undefined
    component.team = undefined;

    expect(component['_form'].value).toEqual({
      id: '',
      name: '',
      description: '',
      minPosition: 1,
      maxPosition: 1,
      leaderId: '',
      teamType: 'customer'
    });
  });

  it('should generate member options from team members', () => {
    const mockMembers = [
      { 
        id: 'user1', 
        firstName: 'John', 
        lastName: 'Doe', 
        userName: 'jdoe',
        email: 'john@example.com',
        phoneNumber: '555-1234',
        teamId: 'team1',
        teamPosition: 1,
        twoFactorEnabled: false,
        twoFactorProvider: 'email' as TwoFactorProvider
      },
      { 
        id: 'user2', 
        firstName: 'Jane', 
        lastName: 'Smith', 
        userName: 'jsmith',
        email: 'jane@example.com',
        phoneNumber: '555-5678',
        teamId: 'team1',
        teamPosition: 2,
        twoFactorEnabled: false,
        twoFactorProvider: 'email' as TwoFactorProvider
      }
    ];
    
    // Call the method directly
    component.updateMemberOptions(mockMembers);
    
    // Check if options are generated correctly
    expect(component['_memberOptions']().length).toBe(3); // 2 members + empty option
    expect(component['_memberOptions']()[0].value).toBe('');
    expect(component['_memberOptions']()[1].value).toBe('user1');
    expect(component['_memberOptions']()[1].label).toBe('John Doe (jdoe)');
    expect(component['_memberOptions']()[2].value).toBe('user2');
    expect(component['_memberOptions']()[2].label).toBe('Jane Smith (jsmith)');
  });

  it('should set member options when team with members is provided', () => {
    const mockTeam = {
      id: 'team-1',
      name: 'Test Team',
      description: 'Test Description',
      minPosition: 2,
      maxPosition: 8,
      leaderId: 'user1',
      teamType: 'maintenance' as TeamType,
      members: [
        { 
          id: 'user1', 
          firstName: 'John', 
          lastName: 'Doe', 
          userName: 'jdoe',
          email: 'john@example.com',
          phoneNumber: '555-1234',
          teamId: 'team1',
          teamPosition: 1,
          twoFactorEnabled: false,
          twoFactorProvider: 'email' as TwoFactorProvider
        }
      ]
    };

    // Set the team
    component.team = mockTeam;
    
    // Check if member options are generated
    expect(component['_memberOptions']().length).toBe(2); // 1 member + empty option
    expect(component['_memberOptions']()[1].value).toBe('user1');
  });
});
