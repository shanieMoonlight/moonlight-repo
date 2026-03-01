import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FirstErrorMatComponent } from './first-error-mat.component';
import { AbstractControl, FormControl, Validators } from '@angular/forms';
import { TemplateRef, Component, ViewChild } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NgTemplateOutlet } from '@angular/common';

// Host component for custom template test
@Component({
  template: `
    <sb-first-error-mat [control]="control" [customErrorTemplate]="errorTemplate"></sb-first-error-mat>
    <ng-template #error let-errorMessage="errorMessage">
      <span class="custom-error">Custom: {{errorMessage}}</span>
    </ng-template>
  `,
  standalone: true,
  imports: [FirstErrorMatComponent, NgTemplateOutlet, MatFormFieldModule]
})
class HostComponent {
  control = new FormControl('', [Validators.required]);
  @ViewChild('error', { static: true }) errorTemplate!: TemplateRef<unknown>;
}

describe('FirstErrorMatComponent (direct)', () => {
  let fixture: ComponentFixture<FirstErrorMatComponent>;
  let component: FirstErrorMatComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FirstErrorMatComponent, NgTemplateOutlet, MatFormFieldModule]
    }).compileComponents();
    fixture = TestBed.createComponent(FirstErrorMatComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render mat-error with firstError when no custom template', () => {
    const control = new FormControl('', [Validators.required]);
    control.setErrors({ firstError: 'Required field' });
    fixture.componentRef.setInput('control', control as AbstractControl);
    fixture.detectChanges();
    const errorEl = fixture.nativeElement.querySelector('mat-error');
    expect(errorEl).toBeTruthy();
    expect(errorEl.textContent).toContain('Required field');
  });

  it('should not render anything if there is no firstError', () => {
    const control = new FormControl('');
    fixture.componentRef.setInput('control', control as AbstractControl);
    fixture.detectChanges();
    const errorEl = fixture.nativeElement.querySelector('mat-error');
    expect(errorEl).toBeFalsy();
  });
});

describe('FirstErrorMatComponent (with custom template)', () => {
  let hostFixture: ComponentFixture<HostComponent>;
  let hostComponent: HostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HostComponent]
    }).compileComponents();
    hostFixture = TestBed.createComponent(HostComponent);
    hostComponent = hostFixture.componentInstance;
  });

  it('should render custom error template if provided', () => {
    hostComponent.control.setErrors({ firstError: 'Custom error' });
    hostFixture.detectChanges();
    const customErrorEl = hostFixture.nativeElement.querySelector('.custom-error');
    expect(customErrorEl).toBeTruthy();
    expect(customErrorEl.textContent).toContain('Custom: Custom error');
  });
});
