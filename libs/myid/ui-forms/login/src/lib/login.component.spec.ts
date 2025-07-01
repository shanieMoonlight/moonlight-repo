import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginFormComponent } from './login.component';
import { By } from '@angular/platform-browser';
import { ComponentRef } from '@angular/core';

describe('LoginFormComponent', () => {
  let component: LoginFormComponent;
  let fixture: ComponentFixture<LoginFormComponent>;
  let componentRef: ComponentRef<LoginFormComponent>;


  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginFormComponent);
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
  it('should initialize form with default values', () => {
    expect(component['_form'].controls.email.value).toBe('');
    expect(component['_form'].controls.password.value).toBe('');
    expect(component['_form'].controls.rememberMe.value).toBe(false);
  });

  it('should require all fields except rememberMe', () => {
    component['_form'].setValue({ email: '', password: '', rememberMe: false });
    expect(component['_form'].valid).toBeFalsy();
    component['_form'].controls.email.setValue('test@example.com');
    component['_form'].controls.password.setValue('abc');
    expect(component['_form'].valid).toBeTruthy();
  });

  it('should require valid email', () => {
    component['_form'].controls.email.setValue('not-an-email');
    expect(component['_form'].controls.email.valid).toBeFalsy();
    component['_form'].controls.email.setValue('user@example.com');
    expect(component['_form'].controls.email.valid).toBeTruthy();
  });

  it('should require password min length 3', () => {
    component['_form'].controls.password.setValue('ab');
    expect(component['_form'].controls.password.valid).toBeFalsy();
    component['_form'].controls.password.setValue('abc');
    expect(component['_form'].controls.password.valid).toBeTruthy();
  });

  it('should emit login with correct dto on submit when valid', () => {
    const emitSpy = jest.spyOn(component.login, 'emit');
    component['_form'].setValue({
      email: 'user@example.com',
      password: 'abc123',
      rememberMe: true
    });
    component.submit();
    expect(emitSpy).toHaveBeenCalledWith({
      email: 'user@example.com',
      password: 'abc123',
      rememberMe: true
    });
  });

  it('should not emit login on submit when form is invalid', () => {
    const emitSpy = jest.spyOn(component.login, 'emit');
    component['_form'].setValue({ email: '', password: '', rememberMe: false });
    component.submit();
    expect(emitSpy).not.toHaveBeenCalled();
  });

  it('should emit forgotPwd when forgotPwdClick is called', () => {
    const emitSpy = jest.spyOn(component.forgotPwd, 'emit');
    component['forgotPwdClick']();
    expect(emitSpy).toHaveBeenCalled();
  });

  it('should toggle showPassword signal', () => {
    expect(component['showPassword']()).toBe(false);
    component['onPasswordToggle'](true);
    expect(component['showPassword']()).toBe(false);
    component['onPasswordToggle'](false);
    expect(component['showPassword']()).toBe(true);
  });
});
