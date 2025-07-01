/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { ComponentRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { AppUserDto, UpdatePositionDto } from '@spider-baby/myid-io/models';
import { SbButtonComponent } from '@spider-baby/ui-kit/buttons';
import { SbSelectComponent } from '@spider-baby/ui-kit/select';
import { FirstErrorComponent, FirstErrorDirective } from '@spider-baby/utils-forms';
import { SbUpdateTeamPositionFormComponent } from './update-team-position.component';

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

describe('SbUpdateTeamPositionFormComponent', () => {
  let component: SbUpdateTeamPositionFormComponent;
  let fixture: ComponentFixture<SbUpdateTeamPositionFormComponent>;
  let componentRef: ComponentRef<SbUpdateTeamPositionFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        SbUpdateTeamPositionFormComponent,
        ReactiveFormsModule,
        FirstErrorComponent,
        FirstErrorDirective,
        SbButtonComponent,
        SbSelectComponent,
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(SbUpdateTeamPositionFormComponent);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;
    fixture.detectChanges();
  });


  it('should render labels when showLabels it true', () => {

    const cbs = fixture.debugElement.queryAll(By.css(`sb-checkbox`));
    const checkBoxCount = cbs.length

    componentRef.setInput('showLabels', true);
    fixture.detectChanges();
    let labels = fixture.debugElement.queryAll(By.css(`label`));
    expect(labels.length).toBeGreaterThan(checkBoxCount);


    componentRef.setInput('showLabels', false);
    fixture.detectChanges();
    labels = fixture.debugElement.queryAll(By.css(`label`));
    expect(labels.length).toBe(checkBoxCount);

  });


  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default provider value', () => {
    expect(component['_form'].controls.newPosition.value).toBe(0);
  });
  it('should initialize with default provider value', () => {
    expect(component['_form'].controls.userId.value).toBe('');
  });

  it('should set form values with input data', () => {
    const inputData: UserInputDateDto = {
      id: '123',
      email: 'test@t.com',
      userName: 'testUser',
      teamPosition: 2
    }
    fixture.componentRef.setInput('member', inputData);
    fixture.detectChanges();
    expect(component['_form'].controls.userId.value).toBe(inputData.id);
    expect(component['_form'].controls.newPosition.value).toBe(inputData.teamPosition);
  });

  it('should render User Info', () => {
    const inputData: UserInputDateDto = {
      id: '123',
      email: 'test@t.com',
      userName: 'testUser',
      teamPosition: 2
    }
    fixture.componentRef.setInput('member', inputData);
    fixture.detectChanges();

    
    const userElement = fixture.debugElement.query(By.css('#user'));
    expect(userElement).toBeTruthy();
    console.log('userElement.nativeElement.textContent', userElement.nativeElement.textContent);
    
    expect(userElement.nativeElement.textContent).toContain(inputData.userName);

    
    const inputDataNoUsername: UserInputDateDto = {
      id: '123',
      email: 'test@t.com',
      userName: undefined,
      teamPosition: 2
    }
    fixture.componentRef.setInput('member', inputDataNoUsername);
    fixture.detectChanges();

    
    const userElementNoUsername = fixture.debugElement.query(By.css('#user'));
    expect(userElementNoUsername).toBeTruthy();
    expect(userElementNoUsername.nativeElement.textContent).toContain(inputDataNoUsername.email);
        
    
  });

  it('should emit updatePosition with correct dto on submit when valid', () => {
    const emitSpy = jest.spyOn(component.updatePosition, 'emit');
    const formData = {
      userId: '123',
      newPosition: 2,
    }
    component['_form'].setValue(formData);
    component.submit();
    expect(emitSpy).toHaveBeenCalledWith(formData);
  });

  it('should not emit updatePosition on submit when form is invalid (userId)', () => {
      const emitSpy = jest.spyOn(component.updatePosition, 'emit');
    const formData = {
      userId: '',
      newPosition: 2,
    }
    component['_form'].setValue(formData);
    component.submit();
    expect(emitSpy).not.toHaveBeenCalled();
  });
  it('should not emit updatePosition on submit when form is invalid (newPosition)', () => {
      const emitSpy = jest.spyOn(component.updatePosition, 'emit');
    const formData = {
      userId: 'adsfasdfasdf',
      newPosition: null!,
    }
    component['_form'].setValue(formData);
    component.submit();
    expect(emitSpy).not.toHaveBeenCalled();
  });

});
