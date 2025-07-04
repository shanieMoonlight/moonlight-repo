import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { SbAddTeamFormComponent } from './add-team.component';
import { ComponentRef } from '@angular/core';
import { By } from '@angular/platform-browser';
import { TeamType } from '@spider-baby/myid-io/models';

describe('SbAddTeamFormComponent', () => {
  let component: SbAddTeamFormComponent;
  let fixture: ComponentFixture<SbAddTeamFormComponent>;
  let componentRef: ComponentRef<SbAddTeamFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        SbAddTeamFormComponent,
        ReactiveFormsModule,
        NoopAnimationsModule
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SbAddTeamFormComponent);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;
    fixture.detectChanges();
  });

  //---------------------//

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  //---------------------//

  it('should initialize form with default values', () => {
    expect(component['_form'].value).toEqual({
      name: '',
      description: '',
      minPosition: 1,
      maxPosition: 1,
      leaderId: '',
      teamType: 'customer'
    });
  });

  //---------------------//

  it('should validate required fields', () => {
    expect(component['_form'].controls.name.valid).toBeFalsy();
    expect(component['_form'].controls.teamType.valid).toBeTruthy(); // has default value
    expect(component['_form'].controls.minPosition.valid).toBeTruthy(); // has default value
    expect(component['_form'].controls.maxPosition.valid).toBeTruthy(); // has default value
  });

  //---------------------//

  it('should emit addTeam when form is valid and not in add mode', () => {
    jest.spyOn(component.addTeam, 'emit');

    component['_form'].patchValue({
      name: 'Customer Team',
      teamType: 'customer'
    });

    (component as any).add();

    expect(component.addTeam.emit).toHaveBeenCalled();
  });

  //---------------------//

  it('should not emit when form is invalid', () => {
    jest.spyOn(component.addTeam, 'emit');

    // Form is invalid because name is required and empty
    (component as any).add();

    expect(component.addTeam.emit).not.toHaveBeenCalled();
  });

  //---------------------//

  it('should disable button when form is invalid', () => {
    component['_form'].patchValue({
      name: '',
      teamType: '' as TeamType
    });
    fixture.detectChanges();
    // Form is invalid because name is required and empty
    const btnSubmit = fixture.debugElement.query(By.css('.btn-submit'));

    const nativeButton = btnSubmit.nativeElement.querySelector('button');
    expect(nativeButton.disabled).toBeTruthy();
  });

  //---------------------//

  it('should NOT render team-position when canChangeTeamPositionRange is false ', () => {
    // Form is invalid because name is required and empty
    componentRef.setInput('canChangeTeamPositionRange', false);
    console.log(component['_form'].valid);
    fixture.detectChanges();
    const teamPositionSection = fixture.debugElement.query(By.css('.team-position'));


    expect(teamPositionSection).toBeFalsy();
  });

  //---------------------//

  it('should render team-position when canChangeTeamPositionRange is true ', () => {
    // Form is invalid because name is required and empty
    componentRef.setInput('canChangeTeamPositionRange', false);
    console.log(component['_form'].valid);
    const teamPositionSection = fixture.debugElement.query(By.css('.team-position'));
    fixture.detectChanges();


    expect(teamPositionSection).toBeTruthy();
  });

  //---------------------//



});
