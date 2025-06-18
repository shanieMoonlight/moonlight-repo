import { FormControl, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { FormErrors, CustomErrorMessageMap, ErrorMessageFunction } from './form-errors';

// Custom validators for testing
const customPatternValidator = (pattern: RegExp) => (control: AbstractControl) => {
  if (!control.value) return null;
  return pattern.test(control.value) ? null : { customPattern: { pattern: pattern.source, value: control.value } };
};

// Async validator for future testing
// const asyncEmailValidator = (control: AbstractControl) => {
//   return new Promise(resolve => {
//     setTimeout(() => {
//       const isValid = control.value && control.value.includes('@async');
//       resolve(isValid ? null : { asyncEmail: 'Email must contain @async' });
//     }, 100);
//   });
// };

describe('FormErrors', () => {

  // Test fixtures
  let validForm: FormGroup;
  let invalidForm: FormGroup;
  let customErrorMap: CustomErrorMessageMap;
  let spanishErrorMap: CustomErrorMessageMap;

  beforeEach(() => {
    // Valid form
    validForm = new FormGroup({
      email: new FormControl('test@example.com', [Validators.required, Validators.email]),
      username: new FormControl('testuser', [Validators.required, Validators.minLength(3)]),
      password: new FormControl('SecurePass123!', [Validators.required, Validators.minLength(8)])
    });

    // Invalid form
    invalidForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      username: new FormControl('ab', [Validators.required, Validators.minLength(3)]),
      password: new FormControl('123', [Validators.required, Validators.minLength(8)]),
      age: new FormControl(15, [Validators.required, Validators.min(18)])
    });

    // Custom error message maps
    customErrorMap = new Map<string, ErrorMessageFunction>([
      ['required', (fieldName) => `Please provide a ${fieldName.toLowerCase()}.`],
      ['email', () => 'Enter a valid email address.'],
      ['minlength', (fieldName, errorValue) => `${fieldName} needs at least ${errorValue?.requiredLength} characters.`],
      ['customPattern', (fieldName, errorValue) => `${fieldName} must match pattern: ${errorValue?.pattern}`]
    ]);

    spanishErrorMap = new Map<string, ErrorMessageFunction>([
      ['required', (fieldName) => `${fieldName} es requerido.`],
      ['email', () => 'Por favor ingrese un email válido.'],
      ['minlength', (fieldName, errorValue) => `${fieldName} debe tener al menos ${errorValue?.requiredLength} caracteres.`]
    ]);
  });

  //----------------------------//

  describe('setFirstErrors', () => {
    it('should not modify valid form', () => {
      FormErrors.setFirstErrors(validForm);

      // Valid controls should remain unchanged
      Object.keys(validForm.controls).forEach(key => {
        const control = validForm.get(key);
        expect(control?.errors).toBeNull();
      });
    });

    it('should add firstError to all invalid controls', () => {
      FormErrors.setFirstErrors(invalidForm);

      // Check each invalid control has firstError
      expect(invalidForm.get('email')?.errors?.['firstError']).toBe('Email is required.');
      expect(invalidForm.get('username')?.errors?.['firstError']).toBe('Username must be at least 3 characters.');
      expect(invalidForm.get('password')?.errors?.['firstError']).toBe('Password must be at least 8 characters.');
      expect(invalidForm.get('age')?.errors?.['firstError']).toBe('Age must be at least 18.');
    });

    it('should preserve existing errors while adding firstError', () => {
      FormErrors.setFirstErrors(invalidForm);

      const emailControl = invalidForm.get('email');
      expect(emailControl?.errors?.['required']).toBe(true);
      expect(emailControl?.errors?.['firstError']).toBe('Email is required.');

      const usernameControl = invalidForm.get('username');
      expect(usernameControl?.errors?.['minlength']).toBeDefined();
      expect(usernameControl?.errors?.['firstError']).toBe('Username must be at least 3 characters.');
    });

    it('should use custom error messages when provided', () => {
      FormErrors.setFirstErrors(invalidForm, customErrorMap);

      expect(invalidForm.get('email')?.errors?.['firstError']).toBe('Please provide a email.');
      expect(invalidForm.get('username')?.errors?.['firstError']).toBe('Username needs at least 3 characters.');
    });

    it('should handle Spanish error messages', () => {
      FormErrors.setFirstErrors(invalidForm, spanishErrorMap);

      expect(invalidForm.get('email')?.errors?.['firstError']).toBe('Email es requerido.');
      expect(invalidForm.get('username')?.errors?.['firstError']).toBe('Username debe tener al menos 3 caracteres.');
    });

    it('should handle empty form gracefully', () => {
      const emptyForm = new FormGroup({});

      expect(() => FormErrors.setFirstErrors(emptyForm)).not.toThrow();
    });

    it('should skip valid controls in mixed form', () => {
      const mixedForm = new FormGroup({
        validField: new FormControl('valid', [Validators.required]),
        invalidField: new FormControl('', [Validators.required])
      });

      FormErrors.setFirstErrors(mixedForm);

      expect(mixedForm.get('validField')?.errors).toBeNull();
      expect(mixedForm.get('invalidField')?.errors?.['firstError']).toBe('Invalid Field is required.');
    });

    it('should handle controls with multiple errors', () => {
      const multiErrorForm = new FormGroup({
        field: new FormControl('', [Validators.required, Validators.email, Validators.minLength(5)])
      });

      FormErrors.setFirstErrors(multiErrorForm);

      const control = multiErrorForm.get('field');
      expect(control?.errors?.['required']).toBe(true);
      expect(control?.errors?.['firstError']).toBe('Field is required.');
    });

    it('should not emit events to prevent infinite loops', () => {
      const statusChangeSpy = jest.fn();
      invalidForm.statusChanges.subscribe(statusChangeSpy);

      FormErrors.setFirstErrors(invalidForm);

      // Should not trigger additional status changes
      expect(statusChangeSpy).not.toHaveBeenCalled();
    });
  });

  //----------------------------//

  describe('setFirstErrorMessage', () => {

    it('should add firstError to single invalid control', () => {
      const control = new FormControl('', [Validators.required]);

      FormErrors.setFirstErrorMessage('testField', control);

      expect(control.errors?.['firstError']).toBe('Test Field is required.');
      expect(control.errors?.['required']).toBe(true);
    });

    it('should use custom error messages for single control', () => {
      const control = new FormControl('', [Validators.required]);

      FormErrors.setFirstErrorMessage('email', control, customErrorMap);

      expect(control.errors?.['firstError']).toBe('Please provide a email.');
    });

    it('should handle control with no errors', () => {
      const validControl = new FormControl('valid', [Validators.required]);

      FormErrors.setFirstErrorMessage('testField', validControl);

      expect(validControl.errors).toBeNull();
    });

    it('should handle control with custom validator', () => {
      const control = new FormControl('invalid', [customPatternValidator(/^test/)]);

      FormErrors.setFirstErrorMessage('customField', control, customErrorMap);

      expect(control.errors?.['firstError']).toBe('Custom Field must match pattern: ^test');
    });

    it('should not emit events', () => {
      const control = new FormControl('', [Validators.required]);
      const statusChangeSpy = jest.fn();
      control.statusChanges.subscribe(statusChangeSpy);

      FormErrors.setFirstErrorMessage('testField', control);

      expect(statusChangeSpy).not.toHaveBeenCalled();
    });
  });

  //----------------------------//

  describe('getFirstErrorMessage', () => {

    it('should return null for valid control', () => {
      const validControl = new FormControl('valid', [Validators.required]);

      const result = FormErrors.getFirstErrorMessage('testField', validControl);

      expect(result).toBeNull();
    });

    it('should return correct message for required error', () => {
      const control = new FormControl('', [Validators.required]);

      const result = FormErrors.getFirstErrorMessage('email', control);

      expect(result).toBe('Email is required.');
    });

    it('should return correct message for email error', () => {
      const control = new FormControl('invalid-email', [Validators.email]);

      const result = FormErrors.getFirstErrorMessage('email', control);

      expect(result).toBe('Please enter a valid email address.');
    });

    it('should return correct message for minlength error', () => {
      const control = new FormControl('ab', [Validators.minLength(5)]);

      const result = FormErrors.getFirstErrorMessage('password', control);

      expect(result).toBe('Password must be at least 5 characters.');
    });

    it('should return correct message for maxlength error', () => {
      const control = new FormControl('toolongtext', [Validators.maxLength(5)]);

      const result = FormErrors.getFirstErrorMessage('code', control);

      expect(result).toBe('Code must be no more than 5 characters.');
    });

    it('should return correct message for min value error', () => {
      const control = new FormControl(15, [Validators.min(18)]);

      const result = FormErrors.getFirstErrorMessage('age', control);

      expect(result).toBe('Age must be at least 18.');
    });

    it('should return correct message for max value error', () => {
      const control = new FormControl(150, [Validators.max(100)]);

      const result = FormErrors.getFirstErrorMessage('score', control);

      expect(result).toBe('Score must be no more than 100.');
    });

    it('should return correct message for pattern error', () => {
      const control = new FormControl('invalid123', [Validators.pattern(/^[a-zA-Z]+$/)]);

      const result = FormErrors.getFirstErrorMessage('name', control);

      expect(result).toBe('Name format is invalid.');
    });

    it('should use custom error messages when provided', () => {
      const control = new FormControl('', [Validators.required]);

      const result = FormErrors.getFirstErrorMessage('username', control, customErrorMap);

      expect(result).toBe('Please provide a username.');
    });

    it('should handle custom error functions with error values', () => {
      const control = new FormControl('ab', [Validators.minLength(5)]);

      const result = FormErrors.getFirstErrorMessage('password', control, customErrorMap);

      expect(result).toBe('Password needs at least 5 characters.');
    });

    it('should return string error values directly', () => {
      const control = new FormControl('test');
      control.setErrors({ customError: 'Direct error message' });

      const result = FormErrors.getFirstErrorMessage('field', control);

      expect(result).toBe('Direct error message');
    });

    it('should handle unknown error types with fallback', () => {
      const control = new FormControl('test');
      control.setErrors({ unknownError: { some: 'data' } });

      const result = FormErrors.getFirstErrorMessage('customField', control);

      expect(result).toBe('Invalid value for Custom Field.');
    });

    it('should prioritize custom messages over default messages', () => {
      const control = new FormControl('', [Validators.required]);

      const customMessages = new Map([
        ['required', () => 'Custom required message']
      ]);

      const result = FormErrors.getFirstErrorMessage('field', control, customMessages);

      expect(result).toBe('Custom required message');
    });

    it('should handle camelCase field names correctly', () => {
      const control = new FormControl('', [Validators.required]);

      const result = FormErrors.getFirstErrorMessage('firstName', control);

      expect(result).toBe('First Name is required.');
    });

    it('should handle kebab-case field names correctly', () => {
      const control = new FormControl('', [Validators.required]);

      const result = FormErrors.getFirstErrorMessage('first-name', control);

      expect(result).toBe('First-name is required.');
    });

    it('should handle multiple custom error validators', () => {
      const control = new FormControl('invalid', [customPatternValidator(/^test/)]);

      const customMessages: CustomErrorMessageMap = new Map([
        ['customPattern', (fieldName, errorValue) => `${fieldName} failed custom validation: ${errorValue.pattern}`]
      ]);

      const result = FormErrors.getFirstErrorMessage('testField', control, customMessages);

      expect(result).toBe('Test Field failed custom validation: ^test');
    });
  });

  //----------------------------//

  describe('firstErrorKey', () => {

    it('should return null for control with no errors', () => {
      const validControl = new FormControl('valid', [Validators.required]);

      const result = FormErrors['firstErrorKey'](validControl);

      expect(result).toBeNull();
    });

    it('should return first error key for control with single error', () => {
      const control = new FormControl('', [Validators.required]);

      const result = FormErrors['firstErrorKey'](control);

      expect(result).toBe('required');
    });

    it('should return first error key for control with multiple errors', () => {
      const control = new FormControl('', [Validators.required, Validators.email]);

      const result = FormErrors['firstErrorKey'](control);

      expect(result).toBe('required');
    });

    it('should handle custom error keys', () => {
      const control = new FormControl('test');
      control.setErrors({ customError: 'Custom message' });

      const result = FormErrors['firstErrorKey'](control);

      expect(result).toBe('customError');
    });

    it('should handle null errors gracefully', () => {
      const control = new FormControl('test');
      control.setErrors(null);

      const result = FormErrors['firstErrorKey'](control);

      expect(result).toBeNull();
    });
  });

  describe('toTitleCase', () => {

    it('should convert camelCase to title case', () => {
      const result = FormErrors['toTitleCase']('firstName');
      expect(result).toBe('First Name');
    });

    it('should handle single word', () => {
      const result = FormErrors['toTitleCase']('email');
      expect(result).toBe('Email');
    });

    it('should handle multiple capital letters', () => {
      const result = FormErrors['toTitleCase']('userIDNumber');
      expect(result).toBe('User I D Number');
    });

    it('should handle already capitalized words', () => {
      const result = FormErrors['toTitleCase']('Email');
      expect(result).toBe(' Email');
    });

    it('should handle empty string', () => {
      const result = FormErrors['toTitleCase']('');
      expect(result).toBe('');
    });

    it('should handle kebab-case', () => {
      const result = FormErrors['toTitleCase']('first-name');
      expect(result).toBe('First-name');
    });

    it('should handle snake_case', () => {
      const result = FormErrors['toTitleCase']('first_name');
      expect(result).toBe('First_name');
    });
  });

  //----------------------------//

  describe('Default Error Messages', () => {

    it('should have correct required message', () => {
      const control = new FormControl('', [Validators.required]);
      const result = FormErrors.getFirstErrorMessage('testField', control);
      expect(result).toBe('Test Field is required.');
    });

    it('should have correct email message', () => {
      const control = new FormControl('invalid', [Validators.email]);
      const result = FormErrors.getFirstErrorMessage('email', control);
      expect(result).toBe('Please enter a valid email address.');
    });

    it('should handle all default error types', () => {
    const testCases = [
      { 
        validator: Validators.required, 
        initialValue: '', // Empty string to trigger required error
        expected: 'Test Field is required.' 
      },
      { 
        validator: Validators.email, 
        initialValue: 'invalid-email', // Invalid email format
        expected: 'Please enter a valid email address.' 
      },
      { 
        validator: Validators.minLength(5), 
        initialValue: 'ab', // Too short to trigger minlength error
        expected: 'Test Field must be at least 5 characters.' 
      },
      { 
        validator: Validators.maxLength(3), 
        initialValue: 'toolong', // Too long to trigger maxlength error
        expected: 'Test Field must be no more than 3 characters.' 
      },
      { 
        validator: Validators.min(18), 
        initialValue: 15, // Below minimum to trigger min error
        expected: 'Test Field must be at least 18.' 
      },
      { 
        validator: Validators.max(100), 
        initialValue: 150, // Above maximum to trigger max error
        expected: 'Test Field must be no more than 100.' 
      },
      { 
        validator: Validators.pattern(/^test/), 
        initialValue: 'invalid', // Doesn't match pattern
        expected: 'Test Field format is invalid.' 
      }
    ];

    testCases.forEach(({ validator, initialValue, expected }) => {
      const control = new FormControl(initialValue, [validator]);
      
      // Verify the control is actually invalid
      expect(control.invalid).toBe(true);
      
      const result = FormErrors.getFirstErrorMessage('testField', control);
      expect(result).toBe(expected);
    });
  });
  });

  //----------------------------//

  describe('Integration with FirstErrorDirective', () => {

    it('should work correctly when firstError already exists', () => {
      const form = new FormGroup({
        email: new FormControl('', [Validators.required])
      });

      // Simulate directive adding firstError
      const emailControl = form.get('email');
      emailControl?.setErrors({
        required: true,
        firstError: 'Previous error message'
      });

      // setFirstErrors should update the firstError
      FormErrors.setFirstErrors(form);

      expect(emailControl?.errors?.['firstError']).toBe('Email is required.');
      expect(emailControl?.errors?.['required']).toBe(true);
    });

    it('should handle rapid successive calls without issues', () => {
      const form = new FormGroup({
        field: new FormControl('', [Validators.required])
      });

      // Simulate rapid calls like directive might make
      FormErrors.setFirstErrors(form);
      FormErrors.setFirstErrors(form);
      FormErrors.setFirstErrors(form);

      const control = form.get('field');
      expect(control?.errors?.['firstError']).toBe('Field is required.');
      expect(control?.errors?.['required']).toBe(true);
    });
  });

  //----------------------------//

  describe('Performance Tests', () => {

    it('should handle large forms efficiently', () => {
      // Create a form with many invalid controls
      const controls: { [key: string]: FormControl } = {};
      for (let i = 0; i < 100; i++) {
        controls[`field${i}`] = new FormControl('', [Validators.required]);
      }

      const largeForm = new FormGroup(controls);

      const startTime = performance.now();
      FormErrors.setFirstErrors(largeForm);
      const endTime = performance.now();

      // Should complete quickly
      expect(endTime - startTime).toBeLessThan(50);

      // All controls should have firstError
      Object.keys(controls).forEach(key => {
        expect(largeForm.get(key)?.errors?.['firstError']).toContain('is required.');
      });
    });

    it('should handle complex custom error message functions efficiently', () => {
      const complexCustomMap: CustomErrorMessageMap = new Map([
        ['required', (fieldName) => {
          // Simulate complex logic
          const parts = fieldName.split(' ');
          return `The field "${parts.join('-').toLowerCase()}" is absolutely required for this operation.`;
        }]
      ]);

      const form = new FormGroup({
        complexFieldName: new FormControl('', [Validators.required])
      });

      const startTime = performance.now();
      FormErrors.setFirstErrors(form, complexCustomMap);
      const endTime = performance.now();

      expect(endTime - startTime).toBeLessThan(10);
      expect(form.get('complexFieldName')?.errors?.['firstError'])
        .toBe('The field "complex-field-name" is absolutely required for this operation.');
    });
  });

  //----------------------------//

  describe('Edge Cases', () => {

    it('should handle null errorValue gracefully', () => {
      const control = new FormControl('test');
      control.setErrors({ customError: null });

      const result = FormErrors.getFirstErrorMessage('field', control);

      expect(result).toBe('Invalid value for Field.');
    });

    it('should handle undefined errorValue gracefully', () => {
      const control = new FormControl('test');
      control.setErrors({ customError: undefined });

      const result = FormErrors.getFirstErrorMessage('field', control);

      expect(result).toBe('Invalid value for Field.');
    });

    it('should handle minlength error with missing requiredLength', () => {
      const control = new FormControl('test');
      control.setErrors({ minlength: null });

      const result = FormErrors.getFirstErrorMessage('field', control);

      expect(result).toBe('Value is too short');
    });

    it('should handle custom error functions that throw', () => {
      const throwingCustomMap = new Map([
        ['required', () => { throw new Error('Test error'); }]
      ]);

      const control = new FormControl('', [Validators.required]);

      expect(() => {
        FormErrors.getFirstErrorMessage('field', control, throwingCustomMap);
      }).toThrow('Test error');
    });

    //----------------------------//

    it('should handle very long field names', () => {
      const longFieldName = 'a'.repeat(1000);
      const control = new FormControl('', [Validators.required]);

      const result = FormErrors.getFirstErrorMessage(longFieldName, control);

      expect(result).toContain('is required.');
      expect(result?.length).toBeGreaterThan(1000);
    });
  });
});
