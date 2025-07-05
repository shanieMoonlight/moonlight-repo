import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import {
  FirstErrorComponent,
  FirstErrorDirective,
} from '@spider-baby/utils-forms';
import { SbButtonComponent } from '@spider-baby/ui-kit/buttons';
import { SbInputStyleDirective } from '@spider-baby/ui-kit/inputs';
import { SbConfirmPhoneFormComponent } from './confirm-phone.component';
import { ComponentRef } from '@angular/core';
import { By } from '@angular/platform-browser';

describe('SbConfirmPhoneFormComponent', () => {
  let component: SbConfirmPhoneFormComponent;
  let fixture: ComponentFixture<SbConfirmPhoneFormComponent>;
  let componentRef: ComponentRef<SbConfirmPhoneFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        SbConfirmPhoneFormComponent,
        ReactiveFormsModule,
        FirstErrorComponent,
        FirstErrorDirective,
        SbButtonComponent,
        SbInputStyleDirective,
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(SbConfirmPhoneFormComponent);
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

  it('should initialize form with default value', () => {
    expect(component['_form'].controls.confirmationToken.value).toBe('');
  });

  it('should require confirmationToken', () => {
    component['_form'].controls.confirmationToken.setValue('');
    expect(component['_form'].valid).toBeFalsy();
    component['_form'].controls.confirmationToken.setValue('123456');
    expect(component['_form'].valid).toBeTruthy();
  });

  it('should emit confirmPhone with correct dto on submit when valid', () => {
    const emitSpy = jest.spyOn(component.confirmPhone, 'emit');
    component['_form'].controls.confirmationToken.setValue('654321');
    component.submit();
    expect(emitSpy).toHaveBeenCalledWith({ confirmationToken: '654321' });
  });

  it('should not emit confirmPhone on submit when form is invalid', () => {
    const emitSpy = jest.spyOn(component.confirmPhone, 'emit');
    component['_form'].controls.confirmationToken.setValue('');
    component.submit();
    expect(emitSpy).not.toHaveBeenCalled();
  });
});
