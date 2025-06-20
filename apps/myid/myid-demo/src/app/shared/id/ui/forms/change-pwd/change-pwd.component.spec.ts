/* eslint-disable @typescript-eslint/no-explicit-any */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { FirstErrorComponent, FirstErrorDirective } from '@spider-baby/utils-forms';
import { SbButtonComponent } from '../../../../ui/buttons';
import { SbToggleIconButtonComponent } from '../../../../ui/buttons';
import { SbInputWithBtnDirective } from '../../../../ui/input/input-with-btn.directive';
import { SbInputStyleDirective } from '../../../../ui/input/input.directive';
import { ChangePwdFormComponent } from './change-pwd.component';

describe('ChangePwdFormComponent', () => {
  let component: ChangePwdFormComponent;
  let fixture: ComponentFixture<ChangePwdFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ChangePwdFormComponent,
        ReactiveFormsModule,
        FirstErrorComponent,
        FirstErrorDirective,
        SbButtonComponent,
        SbInputStyleDirective,
        SbInputWithBtnDirective,
        SbToggleIconButtonComponent,
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(ChangePwdFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with default values', () => {
    expect(component['_form'].controls.email.value).toBe('');
    expect(component['_form'].controls.password.value).toBe('');
    expect(component['_form'].controls.newPassword.value).toBe('');
    expect(component['_form'].controls.confirmPassword.value).toBe('');
  });

  it('should require all fields', () => {
    component['_form'].setValue({ email: '', password: '', newPassword: '', confirmPassword: '' });
    expect(component['_form'].valid).toBeFalsy();
    component['_form'].controls.email.setValue('test@example.com');
    component['_form'].controls.password.setValue('oldpass');
    component['_form'].controls.newPassword.setValue('Strong1!');
    component['_form'].controls.confirmPassword.setValue('Strong1!');
    expect(component['_form'].valid).toBeTruthy();
  });

  it('should require valid email', () => {
    component['_form'].controls.email.setValue('not-an-email');
    expect(component['_form'].controls.email.valid).toBeFalsy();
    component['_form'].controls.email.setValue('user@example.com');
    expect(component['_form'].controls.email.valid).toBeTruthy();
  });

  it('should require newPassword and confirmPassword to match', () => {
    component['_form'].controls.newPassword.setValue('Strong1!');
    component['_form'].controls.confirmPassword.setValue('Different1!');
    expect(component['_form'].errors?.['passwordMismatch']).toBeTruthy();
    component['_form'].controls.confirmPassword.setValue('Strong1!');
    expect(component['_form'].errors).toBeNull();
  });

  it('should use default password validators on newPassword', () => {
    const validators = component['_form'].controls.newPassword.validator;
    expect(validators).toBeTruthy();
    component['_form'].controls.newPassword.setValue('weak');
    expect(component['_form'].controls.newPassword.valid).toBeFalsy();
    component['_form'].controls.newPassword.setValue('Strong1!');
    expect(component['_form'].controls.newPassword.valid).toBeTruthy();
  });

  it('should update password validator when passwordValidators input is set', async () => {
    const customValidator = Validators.minLength(10);
    component.passwordValidators = [customValidator];
    await new Promise(r => setTimeout(r, 600));
    component['_form'].controls.password.setValue('short');
    expect(component['_form'].controls.password.valid).toBeFalsy();
    component['_form'].controls.password.setValue('longenoughpassword');
    expect(component['_form'].controls.password.valid).toBeTruthy();
  });

  it('should emit changePassword with correct dto on submit when valid', () => {
    const emitSpy = jest.spyOn(component.changePassword, 'emit');
    component['_form'].setValue({
      email: 'user@example.com',
      password: 'oldpass',
      newPassword: 'Strong1!',
      confirmPassword: 'Strong1!'
    });
    (component as any).submit();
    expect(emitSpy).toHaveBeenCalledWith({
      email: 'user@example.com',
      password: 'oldpass',
      newPassword: 'Strong1!',
      confirmPassword: 'Strong1!'
    });
  });

  it('should not emit changePassword on submit when form is invalid', () => {
    const emitSpy = jest.spyOn(component.changePassword, 'emit');
    component['_form'].setValue({ email: '', password: '', newPassword: '', confirmPassword: '' });
    (component as any).submit();
    expect(emitSpy).not.toHaveBeenCalled();
  });

  it('should toggle showCurrentPassword signal', () => {
    expect(component['showCurrentPassword']()).toBe(false);
    component['onCurrentPasswordToggle'](true);
    expect(component['showCurrentPassword']()).toBe(false);
    component['onCurrentPasswordToggle'](false);
    expect(component['showCurrentPassword']()).toBe(true);
  });

  it('should toggle showNewPassword signal', () => {
    expect(component['showNewPassword']()).toBe(false);
    component['onNewPasswordToggle'](true);
    expect(component['showNewPassword']()).toBe(false);
    component['onNewPasswordToggle'](false);
    expect(component['showNewPassword']()).toBe(true);
  });

  it('should toggle showConfirmPassword signal', () => {
    expect(component['showConfirmPassword']()).toBe(false);
    component['onConfirmPasswordToggle'](true);
    expect(component['showConfirmPassword']()).toBe(false);
    component['onConfirmPasswordToggle'](false);
    expect(component['showConfirmPassword']()).toBe(true);
  });
});
