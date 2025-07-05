import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SbAddMntcMemberFormComponent } from './add-mntc-member-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { AddMntcMemberFormDto } from './add-mntc-member-form.component';
import { RemoveNullsService } from '@spider-baby/utils-forms';

//############################//

const mockRemoveNullsService = {
  remove: (obj: any) => obj,
};

//############################//

describe('SbAddMntcMemberFormComponent', () => {
  let component: SbAddMntcMemberFormComponent;
  let fixture: ComponentFixture<SbAddMntcMemberFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SbAddMntcMemberFormComponent, ReactiveFormsModule],
      providers: [
        { provide: RemoveNullsService, useValue: mockRemoveNullsService },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(SbAddMntcMemberFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render an element with id for each AddMntcMemberFormDto property', () => {
    const dtoKeys = Object.keys({} as AddMntcMemberFormDto);
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
