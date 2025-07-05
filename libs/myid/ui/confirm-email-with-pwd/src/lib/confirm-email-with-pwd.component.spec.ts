import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import {
  FirstErrorComponent,
  FirstErrorDirective,
} from '@spider-baby/utils-forms';
import { SbButtonComponent } from '@spider-baby/ui-kit/buttons';
import { SbToggleIconButtonComponent } from '@spider-baby/ui-kit/buttons';
import { SbInputWithBtnDirective } from '@spider-baby/ui-kit/inputs';
import { ConfirmEmailWithPwdFormComponent } from './confirm-email-with-pwd.component';

describe('ConfirmEmailWithPwdFormComponent', () => {
  let component: ConfirmEmailWithPwdFormComponent;
  let fixture: ComponentFixture<ConfirmEmailWithPwdFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ConfirmEmailWithPwdFormComponent,
        ReactiveFormsModule,
        FirstErrorComponent,
        FirstErrorDirective,
        SbButtonComponent,
        SbInputWithBtnDirective,
        SbToggleIconButtonComponent,
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(ConfirmEmailWithPwdFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with default values', () => {
    expect(component['_form'].controls.password.value).toBe('');
    expect(component['_form'].controls.confirmPassword.value).toBe('');
  });

  it('should require both fields', () => {
    component['_form'].setValue({ password: '', confirmPassword: '' });
    expect(component['_form'].valid).toBeFalsy();
    component['_form'].controls.password.setValue('Strong1!');
    component['_form'].controls.confirmPassword.setValue('Strong1!');
    expect(component['_form'].valid).toBeTruthy();
  });

  it('should require newPassword and confirmPassword to match', () => {
    component['_form'].controls.password.setValue('Strong1!');
    component['_form'].controls.confirmPassword.setValue('Different1!');
    expect(component['_form'].errors?.['passwordMismatch']).toBeTruthy();
    component['_form'].controls.confirmPassword.setValue('Strong1!');
    expect(component['_form'].errors).toBeNull();
  });

  it('should use default password validators on password', () => {
    const validators = component['_form'].controls.password.validator;
    expect(validators).toBeTruthy();
    component['_form'].controls.password.setValue('weak');
    expect(component['_form'].controls.password.valid).toBeFalsy();
    component['_form'].controls.password.setValue('Strong1!');
    expect(component['_form'].controls.password.valid).toBeTruthy();
  });

  it('should update password validator when passwordValidators input is set', async () => {
    const customValidator = Validators.minLength(10);
    component.passwordValidators = [customValidator];
    await new Promise((r) => setTimeout(r, 600));
    component['_form'].controls.password.setValue('short');
    expect(component['_form'].controls.password.valid).toBeFalsy();
    component['_form'].controls.password.setValue('longenoughpassword');
    expect(component['_form'].controls.password.valid).toBeTruthy();
  });

  it('should emit confirmEmail with correct dto on submit when valid', () => {
    const emitSpy = jest.spyOn(component.confirmEmail, 'emit');
    component['_form'].setValue({
      password: 'Strong1!',
      confirmPassword: 'Strong1!',
    });
    (component as any).submit();
    expect(emitSpy).toHaveBeenCalledWith({
      password: 'Strong1!',
      confirmPassword: 'Strong1!',
    });
  });

  it('should not emit confirmEmail on submit when form is invalid', () => {
    const emitSpy = jest.spyOn(component.confirmEmail, 'emit');
    component['_form'].setValue({ password: '', confirmPassword: '' });
    (component as any).submit();
    expect(emitSpy).not.toHaveBeenCalled();
  });

  it('should toggle showPassword signal', () => {
    expect(component['showPassword']()).toBe(false);
    component['onPasswordToggle'](true);
    expect(component['showPassword']()).toBe(false);
    component['onPasswordToggle'](false);
    expect(component['showPassword']()).toBe(true);
  });

  it('should toggle showConfirmPassword signal', () => {
    expect(component['showConfirmPassword']()).toBe(false);
    component['onConfirmPasswordToggle'](true);
    expect(component['showConfirmPassword']()).toBe(false);
    component['onConfirmPasswordToggle'](false);
    expect(component['showConfirmPassword']()).toBe(true);
  });
});
