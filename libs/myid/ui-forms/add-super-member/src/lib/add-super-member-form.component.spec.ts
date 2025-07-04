import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SbAddSuperMemberFormComponent } from './add-super-member-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { AddSuperMemberFormDto } from './add-super-member-form.component';
import { RemoveNullsService } from '@spider-baby/utils-forms';
import { ComponentRef } from '@angular/core';

//############################//

const mockRemoveNullsService = {
  remove: (obj: any) => obj
}

//############################//
describe('SbAddSuperMemberFormComponent', () => {
  let component: SbAddSuperMemberFormComponent;
  let fixture: ComponentFixture<SbAddSuperMemberFormComponent>;
  let componentRef: ComponentRef<SbAddSuperMemberFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SbAddSuperMemberFormComponent, ReactiveFormsModule],
      providers: [
        { provide: RemoveNullsService, useValue: mockRemoveNullsService }
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(SbAddSuperMemberFormComponent);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
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

it('should render an element with id for each AddSuperMemberFormDto property', () => {
  const dtoKeys =  Object.keys({} as AddSuperMemberFormDto)
  for (const key of dtoKeys) {
    const el = fixture.debugElement.query(By.css(`#${key}`));
    expect(el).toBeTruthy();
  }
});

  it('should require email and validate format', () => {
    const emailControl = component['_form'].controls.email;
    emailControl.setValue('');
    expect(emailControl.valid).toBe(false);
    emailControl.setValue('not-an-email');
    expect(emailControl.valid).toBe(false);
    emailControl.setValue('test@example.com');
    expect(emailControl.valid).toBe(true);
  });

  it('should emit addMember with correct value on submit', () => {
    const spy = jest.spyOn(component.addMember, 'emit');
    component['_form'].setValue({
      firstName: 'John',
      lastName: 'Doe',
      username: 'johndoe',
      email: 'john@example.com',
      phoneNumber: '1234567890',
      teamPosition: 1,
    });
    component.submit();
    expect(spy).toHaveBeenCalledWith({
      firstName: 'John',
      lastName: 'Doe',
      username: 'johndoe',
      email: 'john@example.com',
      phoneNumber: '1234567890',
      teamPosition: 1,
    });
  });

  it('should not emit if form is invalid', () => {
    const spy = jest.spyOn(component.addMember, 'emit');
    component['_form'].setValue({
      firstName: '',
      lastName: '',
      username: '',
      email: '',
      phoneNumber: '',
      teamPosition: null,
    });
    component.submit();
    expect(spy).not.toHaveBeenCalled();
  });
});
