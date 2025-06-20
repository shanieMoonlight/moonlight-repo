import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { FirstErrorComponent, FirstErrorDirective } from '@spider-baby/utils-forms';
import { SbButtonComponent } from '../../../../ui/buttons';
import { SbToggleIconButtonComponent } from '../../../../ui/buttons';
import { SbInputWithBtnDirective } from '../../../../ui/input/input-with-btn.directive';
import { SbInputStyleDirective } from '../../../../ui/input/input.directive';
import { SbResetPwdFormComponent } from './reset-pwd.component';

describe('SbResetPwdFormComponent', () => {
  let component: SbResetPwdFormComponent;
  let fixture: ComponentFixture<SbResetPwdFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        SbResetPwdFormComponent,
        ReactiveFormsModule,
        FirstErrorComponent,
        FirstErrorDirective,
        SbButtonComponent,
        SbInputWithBtnDirective,
        SbInputStyleDirective,
        SbToggleIconButtonComponent,
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(SbResetPwdFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with default values', () => {
    expect(component['_form'].controls.newPassword.value).toBe('');
    expect(component['_form'].controls.confirmPassword.value).toBe('');
  });

  it('should require all fields', () => {
    expect(component['_form'].valid).toBeFalsy();
    component['_form'].controls.newPassword.setValue('Password1!');
    component['_form'].controls.confirmPassword.setValue('Password1!');
    expect(component['_form'].valid).toBeTruthy();
  });


  it('should require password and confirmPassword to match', () => {
    component['_form'].controls.newPassword.setValue('Password1!');
    component['_form'].controls.confirmPassword.setValue('Different1!');
    expect(component['_form'].errors?.['passwordMismatch']).toBeTruthy();
    
    component['_form'].controls.confirmPassword.setValue('Password1!');
    expect(component['_form'].errors).toBeNull();
  });

  it('should use default password validators on newPassword', () => {
    const validators = component['_form'].controls.newPassword.validator;
    expect(validators).toBeTruthy();
    // Should be valid for a strong password, invalid for a weak one
    component['_form'].controls.newPassword.setValue('weak');
    expect(component['_form'].controls.newPassword.valid).toBeFalsy();
    component['_form'].controls.newPassword.setValue('Strong1!');
    expect(component['_form'].controls.newPassword.valid).toBeTruthy();
  });

  it('should update newPassword validator when passwordValidators input is set', async () => {
    const customValidator: import('@angular/forms').ValidatorFn = c => c.value === 'abc123' ? null : { custom: true };
    component.passwordValidators = [customValidator];
    await new Promise(r => setTimeout(r, 600));
    component['_form'].controls.newPassword.setValue('notabc123');
    expect(component['_form'].controls.newPassword.valid).toBeFalsy();
    component['_form'].controls.newPassword.setValue('abc123');
    expect(component['_form'].controls.newPassword.valid).toBeTruthy();
  });

  it('should emit resetPassword with correct dto on submit when valid', () => {
    const emitSpy = jest.spyOn(component.resetPassword, 'emit');
    component['_form'].setValue({
      newPassword: 'Password1!',
      confirmPassword: 'Password1!'
    });
    (component as any).submit();
    expect(emitSpy).toHaveBeenCalledWith({
      newPassword: 'Password1!',
      confirmPassword: 'Password1!'
    });
  });

  it('should not emit resetPassword on submit when form is invalid', () => {
    const emitSpy = jest.spyOn(component.resetPassword, 'emit');
    component['_form'].setValue({ newPassword: '', confirmPassword: '' });
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
