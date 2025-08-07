/* eslint-disable @typescript-eslint/no-empty-function */
import { NgTemplateOutlet } from '@angular/common';
import { Component, TemplateRef, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AbstractControl, FormControl, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FirstErrorMatComponent } from './first-error-mat.component';

// Helper component to test custom template
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
class TestHostComponent {
    control = new FormControl('', [Validators.required]);
    // errorTemplate = viewChild.required<TemplateRef<unknown>>('error')
    @ViewChild('error', { static: true }) errorTemplate!: TemplateRef<unknown>;
}



describe('FirstErrorMatComponent', () => {
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
        fixture.componentRef.setInput('control', control as AbstractControl)
        fixture.detectChanges();
        const errorEl = fixture.nativeElement.querySelector('mat-error');
        expect(errorEl).toBeTruthy();
        expect(errorEl.textContent).toContain('Required field');
    });


    it('should render custom error template if provided', () => {

        const hostFixture = TestBed.createComponent(TestHostComponent);
        const hostComponent = hostFixture.componentInstance;
        hostComponent.control.setErrors({ firstError: 'Custom error' });
        hostFixture.detectChanges();

        // The custom error should be rendered
        const customErrorEl = hostFixture.nativeElement.querySelector('.custom-error');
        expect(customErrorEl).toBeTruthy();
        expect(customErrorEl.textContent).toContain('Custom: Custom error');


    });


    it('should not render anything if there is no firstError', () => {
        const control = new FormControl('');
        fixture.componentRef.setInput('control', control as AbstractControl)
        fixture.detectChanges();
        const errorEl = fixture.nativeElement.querySelector('mat-error');
        expect(errorEl).toBeFalsy();
    });
});
