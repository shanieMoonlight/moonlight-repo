import { Component, DebugElement, inject } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { FirstErrorDirective } from './first-error.directive';
import { CustomErrorMessageMap, FormErrors } from '../form-errors';
import { FormUtility } from '../form-utility';

// Test host component to test the directive
@Component({
    standalone: true,
    imports: [ReactiveFormsModule, FirstErrorDirective],
    template: `
    <form [formGroup]="testForm" 
          [sbFormControlFirstError]="testForm"
          [customErrorMessages]="customMessages"
          [showUntouched]="showUntouched"
          data-testid="test-form">
      <input formControlName="email" data-testid="email-input">
      <input formControlName="password" data-testid="password-input">
      <input formControlName="confirmPassword" data-testid="confirm-input">
    </form>
  `
})
class TestHostComponent {

    private fb: FormBuilder = inject(FormBuilder);

    testForm: FormGroup;
    customMessages?: CustomErrorMessageMap;
    showUntouched = false;


    constructor() {
        this.testForm = this.fb.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(8)]],
            confirmPassword: ['', [Validators.required]]
        });
    } updateForm(formConfig: { [key: string]: unknown }) {
        this.testForm = this.fb.group(formConfig);
    }
}

describe('FirstErrorDirective', () => {
    let component: TestHostComponent;
    let fixture: ComponentFixture<TestHostComponent>;
    let directiveElement: DebugElement;
    let directiveInstance: FirstErrorDirective;
    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ReactiveFormsModule, FirstErrorDirective, TestHostComponent],
            providers: [FormBuilder]
        }).compileComponents();

        fixture = TestBed.createComponent(TestHostComponent);
        component = fixture.componentInstance;

        // Get the directive instance
        directiveElement = fixture.debugElement.query(By.directive(FirstErrorDirective));
        directiveInstance = directiveElement.injector.get(FirstErrorDirective);

        fixture.detectChanges();
    });

    afterEach(() => {
        fixture.destroy();
    });

    describe('Directive Initialization', () => {

        it('should create the directive', () => {
            expect(directiveInstance).toBeTruthy();
        });

        it('should bind to form correctly', () => {
            expect(directiveInstance['_form']).toBe(component.testForm);
        });

        it('should initialize with default showUntouched as false', () => {
            expect(directiveInstance.showUntouched).toBe(false);
        });

        it('should accept custom error messages input', () => {
            const customMessages: CustomErrorMessageMap = new Map([
                ['required', (fieldName) => `Custom: ${fieldName} is required`]
            ]);

            component.customMessages = customMessages;
            fixture.detectChanges();

            expect(directiveInstance.customErrorMessages).toBe(customMessages);
        });

        it('should update showUntouched input', () => {
            component.showUntouched = true;
            fixture.detectChanges();

            expect(directiveInstance.showUntouched).toBe(true);
        });
    });

    //----------------------------//    

    describe('Form Status Change Processing', () => {

        it('should not process valid form', fakeAsync(() => {
            // Set valid values
            component.testForm.patchValue({
                email: 'test@example.com',
                password: 'password123',
                confirmPassword: 'password123'
            });

            tick();
            fixture.detectChanges();

            // Form should be valid, no firstError should be set
            expect(component.testForm.valid).toBe(true);
            expect(component.testForm.get('email')?.errors?.['firstError']).toBeUndefined();
            expect(component.testForm.get('password')?.errors?.['firstError']).toBeUndefined();
        }));

        it('should process invalid form and add firstError', fakeAsync(() => {
            // Make form invalid
            component.testForm.patchValue({
                email: '',
                password: 'short',
                confirmPassword: ''
            });

            // Mark as touched to trigger error display
            component.testForm.get('email')?.markAsTouched();
            component.testForm.get('password')?.markAsTouched();
            component.testForm.get('confirmPassword')?.markAsTouched();

            component.testForm.updateValueAndValidity();
            tick();
            fixture.detectChanges();

            // Should add firstError to invalid controls
            expect(component.testForm.get('email')?.errors?.['firstError']).toBe('Email is required.');
            expect(component.testForm.get('password')?.errors?.['firstError']).toBe('Password must be at least 8 characters.');
            expect(component.testForm.get('confirmPassword')?.errors?.['firstError']).toBe('Confirm Password is required.');
        })); it('should only process untouched controls when showUntouched is true', fakeAsync(() => {
            component.showUntouched = true;
            fixture.detectChanges();

            // Make form invalid but keep controls untouched
            component.testForm.patchValue({
                email: '',
                password: '',
                confirmPassword: ''
            });

            // Force status evaluation for reactive testing
            component.testForm.updateValueAndValidity();
            tick();
            fixture.detectChanges();

            // Should add firstError even to untouched controls
            expect(component.testForm.get('email')?.errors?.['firstError']).toBe('Email is required.');
            expect(component.testForm.get('password')?.errors?.['firstError']).toBe('Password is required.');
            expect(component.testForm.get('confirmPassword')?.errors?.['firstError']).toBe('Confirm Password is required.');
        })); it('should not process untouched controls when showUntouched is false', fakeAsync(() => {
            component.showUntouched = false;
            fixture.detectChanges();

            // Make form invalid but keep controls untouched
            component.testForm.patchValue({
                email: '',
                password: '',
                confirmPassword: ''
            });

            // Force status evaluation for reactive testing
            component.testForm.updateValueAndValidity();
            tick();
            fixture.detectChanges();

            // Should NOT add firstError to untouched controls
            expect(component.testForm.get('email')?.errors?.['firstError']).toBeUndefined();
            expect(component.testForm.get('password')?.errors?.['firstError']).toBeUndefined();
            expect(component.testForm.get('confirmPassword')?.errors?.['firstError']).toBeUndefined();
        })); it('should skip controls that already have firstError', fakeAsync(() => {
            // Pre-set firstError on email control
            const emailControl = component.testForm.get('email');
            emailControl?.setErrors({
                required: true,
                firstError: 'Existing error message'
            });
            emailControl?.markAsTouched();

            // Make other controls invalid and touched
            component.testForm.patchValue({
                password: 'short',
                confirmPassword: ''
            });
            component.testForm.get('password')?.markAsTouched();
            component.testForm.get('confirmPassword')?.markAsTouched();

            // Force status evaluation for reactive testing
            component.testForm.updateValueAndValidity();
            tick();
            fixture.detectChanges();

            // Email should keep existing firstError, others should get new ones
            expect(component.testForm.get('email')?.errors?.['firstError']).toBe('Existing error message');
            expect(component.testForm.get('password')?.errors?.['firstError']).toBe('Password must be at least 8 characters.');
            expect(component.testForm.get('confirmPassword')?.errors?.['firstError']).toBe('Confirm Password is required.');
        }));
    });

    //----------------------------//    

    describe('Custom Error Messages', () => {
        it('should use custom error messages when provided', fakeAsync(() => {
            const customMessages: CustomErrorMessageMap = new Map([
                ['required', (fieldName) => `Custom: ${fieldName} is required!`],
                ['minlength', (fieldName, errorValue) => `Custom: ${fieldName} needs ${errorValue?.requiredLength} chars`]
            ]);

            component.customMessages = customMessages;
            fixture.detectChanges();

            // Make form invalid
            component.testForm.patchValue({
                email: '',
                password: 'short'
            });
            component.testForm.get('email')?.markAsTouched();
            component.testForm.get('password')?.markAsTouched();

            // Force status evaluation for reactive testing
            component.testForm.updateValueAndValidity();
            tick();
            fixture.detectChanges();

            // Should use custom messages
            expect(component.testForm.get('email')?.errors?.['firstError']).toBe('Custom: Email is required!');
            expect(component.testForm.get('password')?.errors?.['firstError']).toBe('Custom: Password needs 8 chars');
        }));


        it('should fall back to default messages for unmapped errors', fakeAsync(() => {
            const customMessages: CustomErrorMessageMap = new Map([
                ['required', (fieldName) => `Custom: ${fieldName} is required!`]
                // No custom message for minlength
            ]);

            component.customMessages = customMessages;
            fixture.detectChanges();

            // Make form invalid
            component.testForm.patchValue({
                email: '',
                password: 'short'
            });
            component.testForm.get('email')?.markAsTouched();
            component.testForm.get('password')?.markAsTouched();

            // Force status evaluation for reactive testing
            component.testForm.updateValueAndValidity();
            tick();
            fixture.detectChanges();

            // Should use custom for required, default for minlength
            expect(component.testForm.get('email')?.errors?.['firstError']).toBe('Custom: Email is required!');
            expect(component.testForm.get('password')?.errors?.['firstError']).toBe('Password must be at least 8 characters.');
        }));
    });

    //----------------------------//    

    describe('Form Updates and Re-binding', () => {

        it('should handle form replacement', fakeAsync(() => {
            // Create new form
            const newForm = new FormBuilder().group({
                username: ['', [Validators.required]],
                age: [0, [Validators.min(18)]]
            });

            // Update the component form (simulates [sbFormControlFirstError]="newForm")
            component.testForm = newForm;
            directiveElement.nativeElement.setAttribute('sbFormControlFirstError', 'newForm');

            // Trigger change detection to simulate input change
            directiveInstance.sbFormControlFirstError = newForm;

            component.testForm.updateValueAndValidity();
            tick();
            fixture.detectChanges();

            // Make new form invalid
            newForm.get('username')?.markAsTouched();
            newForm.get('age')?.markAsTouched();

            component.testForm.updateValueAndValidity();
            tick();
            fixture.detectChanges();

            // Should process new form
            expect(newForm.get('username')?.errors?.['firstError']).toBe('Username is required.');
            expect(newForm.get('age')?.errors?.['firstError']).toBe('Age must be at least 18.');
        }));

        it('should unsubscribe from previous form when form changes', () => {
            const subscription = directiveInstance['_vcSub'];
            const spy = subscription ? jest.spyOn(subscription, 'unsubscribe') : jest.fn();

            // Change the form
            const newForm = new FormBuilder().group({
                newField: ['', [Validators.required]]
            });

            directiveInstance.sbFormControlFirstError = newForm;

            // Should unsubscribe from previous subscription
            if (subscription) {
                expect(spy).toHaveBeenCalled();
            }
        });
    });

    //----------------------------//    

    describe('Subscription Management', () => {
        it('should clean up subscription on destroy', () => {
            const subscription = directiveInstance['_vcSub'];
            const spy = subscription ? jest.spyOn(subscription, 'unsubscribe') : jest.fn();

            directiveInstance.ngOnDestroy();

            if (subscription) {
                expect(spy).toHaveBeenCalled();
            }
        });

        it('should handle multiple subscription cleanups safely', () => {
            // Call ngOnDestroy multiple times
            expect(() => {
                directiveInstance.ngOnDestroy();
                directiveInstance.ngOnDestroy();
                directiveInstance.ngOnDestroy();
            }).not.toThrow();
        });

        it('should create new subscription when form changes', () => {
            const originalSub = directiveInstance['_vcSub'];

            // Change form
            const newForm = new FormBuilder().group({
                newField: ['']
            });
            directiveInstance.sbFormControlFirstError = newForm;

            // Should have new subscription
            expect(directiveInstance['_vcSub']).not.toBe(originalSub);
            expect(directiveInstance['_vcSub']).toBeTruthy();
        });
    });

    //----------------------------//    

    describe('Performance and Edge Cases', () => {

        it('should only process when form status is INVALID', fakeAsync(() => {
            const spy = jest.spyOn(FormUtility, 'findInvalidControlsData');

            // Set valid form (status will be VALID)
            component.testForm.patchValue({
                email: 'test@example.com',
                password: 'password123',
                confirmPassword: 'password123'
            });

            component.testForm.updateValueAndValidity()
            tick();
            fixture.detectChanges();

            // Should not call FormUtility when form is valid
            expect(spy).not.toHaveBeenCalled();
        }));

        it('should handle rapid form value changes', fakeAsync(() => {
            const spy = jest.spyOn(FormErrors, 'setFirstErrorMessage');

            // Simulate rapid typing
            component.testForm.get('email')?.setValue('');
            component.testForm.get('email')?.markAsTouched();
            tick(10);

            component.testForm.get('email')?.setValue('a');
            tick(10);

            component.testForm.get('email')?.setValue('');
            tick(10);

            fixture.detectChanges();

            // Should handle rapid changes without errors
            expect(spy).toHaveBeenCalled();
        }));

        it('should handle form with no controls', fakeAsync(() => {
            const emptyForm = new FormBuilder().group({});

            expect(() => {
                directiveInstance.sbFormControlFirstError = emptyForm;
                tick();
                fixture.detectChanges();
            }).not.toThrow();
        }));

        it('should handle null/undefined custom messages', fakeAsync(() => {
            component.customMessages = undefined;
            fixture.detectChanges();

            component.testForm.patchValue({ email: '' });
            component.testForm.get('email')?.markAsTouched();

            expect(() => {
                component.testForm.updateValueAndValidity()
                tick();
                fixture.detectChanges();
            }).not.toThrow();

            expect(component.testForm.get('email')?.errors?.['firstError']).toBe('Email is required.');
        }));
    });

    //----------------------------//    

    describe('Real-world Scenarios', () => {

        it('should simulate user typing and validation flow', fakeAsync(() => {
            const emailControl = component.testForm.get('email');

            // User focuses email field (becomes touched)
            emailControl?.markAsTouched();

            // User types invalid email
            emailControl?.setValue('invalid-email');
            tick();
            fixture.detectChanges();

            // Should show email format error
            expect(emailControl?.errors?.['firstError']).toBe('Please enter a valid email address.');

            // User corrects email
            emailControl?.setValue('test@example.com');
            tick();
            fixture.detectChanges();

            // Should remove error (form becomes valid for email)
            expect(emailControl?.errors?.['firstError']).toBeUndefined();
        }));

        it('should handle form submission attempt', fakeAsync(() => {
            // Simulate form submission with invalid data
            component.testForm.markAllAsTouched();

            component.testForm.updateValueAndValidity()
            tick();
            fixture.detectChanges();

            // All invalid controls should show errors
            expect(component.testForm.get('email')?.errors?.['firstError']).toBe('Email is required.');
            expect(component.testForm.get('password')?.errors?.['firstError']).toBe('Password is required.');
            expect(component.testForm.get('confirmPassword')?.errors?.['firstError']).toBe('Confirm Password is required.');
        }));

        it('should work with dynamic form controls', fakeAsync(() => {
            // Add new control dynamically
            component.testForm.addControl('newField', new FormControl('', [Validators.required]));

            // Make new control invalid and touched
            component.testForm.get('newField')?.markAsTouched();

            component.testForm.updateValueAndValidity()
            tick();
            fixture.detectChanges();

            // Should handle dynamically added control
            expect(component.testForm.get('newField')?.errors?.['firstError']).toBe('New Field is required.');
        }));
    });
});
