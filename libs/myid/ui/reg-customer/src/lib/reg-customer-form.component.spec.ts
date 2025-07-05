import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SbRegisterCustomerFormComponent } from './reg-customer-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { RegisterCustomerFormDto } from './reg-customer-form.component';
import { RemoveNullsService } from '@spider-baby/utils-forms';
import { MyIdPhoneFormatProvider } from '@spider-baby/myid-ui/utils';
import { ComponentRef } from '@angular/core';

//############################//

const mockRemoveNullsService = {
  remove: (obj: any) => obj,
};
const mockPhoneFormatProvider = {
  formatPhoneInternational: (obj: string) => obj,
};

//############################//

describe('SbRegisterCustomerFormComponent', () => {
  let component: SbRegisterCustomerFormComponent;
  let fixture: ComponentFixture<SbRegisterCustomerFormComponent>;
  let componentRef: ComponentRef<SbRegisterCustomerFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SbRegisterCustomerFormComponent, ReactiveFormsModule],
      providers: [
        { provide: RemoveNullsService, useValue: mockRemoveNullsService },
        { provide: MyIdPhoneFormatProvider, useValue: mockPhoneFormatProvider },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(SbRegisterCustomerFormComponent);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render labels when showLabels it true', () => {
    const cbs = fixture.debugElement.queryAll(By.css(`sb-checkbox`));
    const checkBoxCount = cbs.length;

    componentRef.setInput('showLabels', true);
    fixture.detectChanges();
    let labels = fixture.debugElement.queryAll(By.css(`label`));
    expect(labels.length).toBeGreaterThan(checkBoxCount);

    componentRef.setInput('showLabels', false);
    fixture.detectChanges();
    labels = fixture.debugElement.queryAll(By.css(`label`));
    expect(labels.length).toBe(checkBoxCount);
  });

  it('should render an element with id for each RegisterCustomerFormDto property', () => {
    const dtoKeys = Object.keys({} as RegisterCustomerFormDto);
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

  it('should require password', () => {
    const pwdControl = component['_form'].controls.password;
    pwdControl.setValue('');
    expect(pwdControl.valid).toBe(false);
    pwdControl.setValue('pa$$worD1');
    expect(pwdControl.valid).toBe(true);
  });

  it('should require confirmPassword', () => {
    const pwdControl = component['_form'].controls.confirmPassword;
    pwdControl.setValue('');
    expect(pwdControl.valid).toBe(false);
    pwdControl.setValue('pa$$worD1');
    expect(pwdControl.valid).toBe(true);
  });

  it('should emit addMember with correct value on submit', () => {
    const spy = jest.spyOn(component.register, 'emit');
    component['_form'].setValue({
      firstName: 'John',
      lastName: 'Doe',
      username: 'johndoe',
      email: 'john@example.com',
      phoneNumber: '1234567890',
      password: 'pA$$Word1',
      confirmPassword: 'pA$$Word1',
    });
    component.submit();

    expect(spy).toHaveBeenCalledWith({
      firstName: 'John',
      lastName: 'Doe',
      username: 'johndoe',
      email: 'john@example.com',
      phoneNumber: '1234567890',
      password: 'pA$$Word1',
      confirmPassword: 'pA$$Word1',
    });
  });

  it('should not emit if form is invalid', () => {
    const spy = jest.spyOn(component.register, 'emit');
    component['_form'].setValue({
      firstName: '',
      lastName: '',
      username: '',
      email: '',
      phoneNumber: '',
      password: 'pA$$Word1',
      confirmPassword: '',
    });
    component.submit();
    expect(spy).not.toHaveBeenCalled();
  });
});
