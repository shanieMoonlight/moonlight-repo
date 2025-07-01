/* eslint-disable @typescript-eslint/no-explicit-any */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { FirstErrorComponent, FirstErrorDirective } from '@spider-baby/utils-forms';
import { SbButtonComponent } from '@spider-baby/ui-kit/buttons';
import { SbInputStyleDirective } from '@spider-baby/ui-kit/inputs';
import { SbForgotPwdFormComponent } from './forgot-pwd.component';
import { ComponentRef } from '@angular/core';
import { By } from '@angular/platform-browser';

describe('SbForgotPwdFormComponent', () => {
  let component: SbForgotPwdFormComponent;
  let fixture: ComponentFixture<SbForgotPwdFormComponent>;
  let componentRef: ComponentRef<SbForgotPwdFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        SbForgotPwdFormComponent,
        ReactiveFormsModule,
        FirstErrorComponent,
        FirstErrorDirective,
        SbButtonComponent,
        SbInputStyleDirective,
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(SbForgotPwdFormComponent);
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

  it('should initialize form with default value', () => {
    expect(component['_form'].controls.email.value).toBe('');
  });

  it('should require email', () => {
    component['_form'].controls.email.setValue('');
    expect(component['_form'].valid).toBeFalsy();
    component['_form'].controls.email.setValue('test@example.com');
    expect(component['_form'].valid).toBeTruthy();
  });

  it('should require valid email format', () => {
    component['_form'].controls.email.setValue('not-an-email');
    expect(component['_form'].controls.email.valid).toBeFalsy();
    component['_form'].controls.email.setValue('user@example.com');
    expect(component['_form'].controls.email.valid).toBeTruthy();
  });

  it('should emit forgotPassword with correct dto on submit when valid', () => {
    const emitSpy = jest.spyOn(component.forgotPassword, 'emit');
    component['_form'].controls.email.setValue('user@example.com');
    (component as any).submit();
    expect(emitSpy).toHaveBeenCalledWith({ email: 'user@example.com' });
  });

  it('should not emit forgotPassword on submit when form is invalid', () => {
    const emitSpy = jest.spyOn(component.forgotPassword, 'emit');
    component['_form'].controls.email.setValue('');
    (component as any).submit();
    expect(emitSpy).not.toHaveBeenCalled();
  });
});
