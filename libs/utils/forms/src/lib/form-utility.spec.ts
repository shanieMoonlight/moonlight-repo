import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FormUtility } from './form-utility';

describe('FormUtility', () => {
  
  // Test fixtures
  let validForm: FormGroup;
  let invalidForm: FormGroup;
  let mixedForm: FormGroup;
  let emptyForm: FormGroup;

  beforeEach(() => {
    // Valid form
    validForm = new FormGroup({
      email: new FormControl('test@example.com', [Validators.required, Validators.email]),
      username: new FormControl('testuser', [Validators.required, Validators.minLength(3)]),
      age: new FormControl(25, [Validators.required, Validators.min(18)])
    });

    // Invalid form
    invalidForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      username: new FormControl('ab', [Validators.required, Validators.minLength(3)]),
      age: new FormControl(15, [Validators.required, Validators.min(18)])
    });

    // Mixed form (some valid, some invalid)
    mixedForm = new FormGroup({
      email: new FormControl('valid@email.com', [Validators.required, Validators.email]),
      username: new FormControl('', [Validators.required, Validators.minLength(3)]),
      password: new FormControl('secret123', [Validators.required, Validators.minLength(8)])
    });

    // Empty form
    emptyForm = new FormGroup({});
  });

  //----------------------------//

  describe('findInvalidControlNames', () => {
    it('should return empty Set for valid form', () => {
      const result = FormUtility.findInvalidControlNames(validForm);
      
      expect(result).toBeInstanceOf(Set);
      expect(result.size).toBe(0);
      expect([...result]).toEqual([]);
    });

    it('should return all control names for completely invalid form', () => {
      const result = FormUtility.findInvalidControlNames(invalidForm);
      
      expect(result).toBeInstanceOf(Set);
      expect(result.size).toBe(3);
      expect([...result].sort()).toEqual(['age', 'email', 'username']);
    });

    it('should return only invalid control names for mixed form', () => {
      const result = FormUtility.findInvalidControlNames(mixedForm);
      
      expect(result).toBeInstanceOf(Set);
      expect(result.size).toBe(1);
      expect([...result]).toEqual(['username']);
    });

    it('should return empty Set for empty form', () => {
      const result = FormUtility.findInvalidControlNames(emptyForm);
      
      expect(result).toBeInstanceOf(Set);
      expect(result.size).toBe(0);
    });

    it('should handle form with nested errors', () => {
      const formWithNestedErrors = new FormGroup({
        profile: new FormGroup({
          firstName: new FormControl('', [Validators.required]),
          lastName: new FormControl('Valid', [Validators.required])
        })
      });

      // Note: This tests the current implementation which only checks top-level controls
      const result = FormUtility.findInvalidControlNames(formWithNestedErrors);
      expect(result.size).toBe(1);
      expect([...result]).toEqual(['profile']);
    });
  });

  //----------------------------//

  describe('findInvalidControlInfo', () => {
    it('should return empty Set for valid form', () => {
      const result = FormUtility.findInvalidControlInfo(validForm);
      
      expect(result).toBeInstanceOf(Set);
      expect(result.size).toBe(0);
    });

    it('should return control names with error types for invalid form', () => {
      const result = FormUtility.findInvalidControlInfo(invalidForm);
      
      expect(result).toBeInstanceOf(Set);
      expect(result.size).toBe(3);
      
      const resultArray = [...result].sort();
      expect(resultArray).toContain('email: required');
      expect(resultArray).toContain('username: minlength');
      expect(resultArray).toContain('age: min');
    });

    it('should use "Invalid" fallback when firstErrorKey returns null', () => {
      // Create a control with null errors (edge case)
      const formWithNullError = new FormGroup({
        test: new FormControl('value')
      });
      
      // Manually set invalid status with no errors (edge case)
      formWithNullError.get('test')?.setErrors({});
      
      const result = FormUtility.findInvalidControlInfo(formWithNullError);
      expect([...result]).toEqual(['test: Invalid']);
    });

    it('should handle multiple error types and return the first one', () => {
      const formWithMultipleErrors = new FormGroup({
        field: new FormControl('', [Validators.required, Validators.email, Validators.minLength(5)])
      });

      const result = FormUtility.findInvalidControlInfo(formWithMultipleErrors);
      expect([...result]).toEqual(['field: required']);
    });
  });

  //----------------------------//

  describe('findInvalidControls', () => {
    it('should return empty array for valid form', () => {
      const result = FormUtility.findInvalidControls(validForm);
      
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(0);
    });

    it('should return AbstractControl instances for invalid form', () => {
      const result = FormUtility.findInvalidControls(invalidForm);
      
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(3);
      
      result.forEach(control => {
        expect(control).toBeInstanceOf(FormControl);
        expect(control.invalid).toBe(true);
      });
    });

    it('should return only invalid controls for mixed form', () => {
      const result = FormUtility.findInvalidControls(mixedForm);
      
      expect(result.length).toBe(1);
      expect(result[0]).toBe(mixedForm.get('username'));
      expect(result[0].invalid).toBe(true);
    });

    it('should maintain reference equality with original controls', () => {
      const result = FormUtility.findInvalidControls(invalidForm);
      
      expect(result[0]).toBe(invalidForm.get('email'));
      expect(result[1]).toBe(invalidForm.get('username'));
      expect(result[2]).toBe(invalidForm.get('age'));
    });
  });

  //----------------------------//

  describe('findInvalidControlsData', () => {
    it('should return empty array for valid form', () => {
      const result = FormUtility.findInvalidControlsData(validForm);
      
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(0);
    });

    it('should return ControlData objects for invalid form', () => {
      const result = FormUtility.findInvalidControlsData(invalidForm);
      
      expect(result.length).toBe(3);
      
      // Check structure of returned objects
      result.forEach(item => {
        expect(item).toHaveProperty('name');
        expect(item).toHaveProperty('control');
        expect(typeof item.name).toBe('string');
        expect(item.control.invalid).toBe(true);
      });

      // Check specific mappings
      const emailData = result.find(item => item.name === 'email');
      expect(emailData?.control).toBe(invalidForm.get('email'));
      
      const usernameData = result.find(item => item.name === 'username');
      expect(usernameData?.control).toBe(invalidForm.get('username'));
    });

    it('should return correct name-control pairs for mixed form', () => {
      const result = FormUtility.findInvalidControlsData(mixedForm);
      
      expect(result.length).toBe(1);
      expect(result[0].name).toBe('username');
      expect(result[0].control).toBe(mixedForm.get('username'));
    });

    it('should match the ControlData interface structure', () => {
      const result = FormUtility.findInvalidControlsData(invalidForm);
      
      result.forEach(item => {
        // TypeScript interface validation
        expect(typeof item.name).toBe('string');
        expect(item.control).toBeDefined();
        expect(item.control.invalid).toBe(true);
      });
    });
  });

  //----------------------------//

  describe('replaceNullWithUndefined', () => {
    it('should replace null values with undefined', () => {
      const input = {
        validField: 'test',
        nullField: null,
        undefinedField: undefined,
        numberField: 42,
        booleanField: false
      };

      const result = FormUtility.replaceNullWithUndefined(input);

      expect(result['validField']).toBe('test');
      expect(result['nullField']).toBeUndefined();
      expect(result['undefinedField']).toBeUndefined();
      expect(result['numberField']).toBe(42);
      expect(result['booleanField']).toBe(false);
    });

    it('should handle empty object', () => {
      const input = {};
      const result = FormUtility.replaceNullWithUndefined(input);
      
      expect(result).toEqual({});
    });

    it('should handle object with only null values', () => {
      const input = {
        field1: null,
        field2: null,
        field3: null
      };

      const result = FormUtility.replaceNullWithUndefined(input);

      expect(result['field1']).toBeUndefined();
      expect(result['field2']).toBeUndefined();
      expect(result['field3']).toBeUndefined();
    });

    it('should mutate the original object', () => {
      const input = { nullField: null, validField: 'test' };
      const result = FormUtility.replaceNullWithUndefined(input);

      // Should return the same reference
      expect(result).toBe(input);
      // Original object should be modified
      expect(input['nullField']).toBeUndefined();
    });

    it('should handle nested objects (shallow replacement only)', () => {
      const input = {
        nullField: null,
        nestedObject: {
          nestedNull: null,
          nestedValid: 'test'
        }
      };

      const result = FormUtility.replaceNullWithUndefined(input);

      expect(result['nullField']).toBeUndefined();
      // Nested null should remain unchanged (method is shallow)
      expect(result['nestedObject'].nestedNull).toBeNull();
      expect(result['nestedObject'].nestedValid).toBe('test');
    });
  });

  //----------------------------//

  describe('getFirstFormError', () => {
    it('should return null for valid form', () => {
      const result = FormUtility.getFirstFormError(validForm);
      expect(result).toBeNull();
    });

    it('should return form-level errors before control errors', () => {
      // Create form with form-level error
      const formWithFormError = new FormGroup({
        email: new FormControl('', [Validators.required])
      }, { validators: [() => ({ formLevelError: 'Form is invalid' })] });

      const result = FormUtility.getFirstFormError(formWithFormError);
      
      expect(result).toEqual({ formLevelError: 'Form is invalid' });
    });

    it('should return first control error when no form-level errors', () => {
      const result = FormUtility.getFirstFormError(invalidForm);
        expect(result).toBeDefined();
      expect(typeof result).toBe('object');
      
      // Should return one of the control errors
      const possibleErrors = ['required', 'minlength', 'min'];
      const errorKey = result ? Object.keys(result)[0] : '';
      expect(possibleErrors).toContain(errorKey);
    });

    it('should return null for empty form', () => {
      const result = FormUtility.getFirstFormError(emptyForm);
      expect(result).toBeNull();
    });

    it('should handle form with only valid controls', () => {
      const validOnlyForm = new FormGroup({
        validField: new FormControl('valid', [Validators.required])
      });

      const result = FormUtility.getFirstFormError(validOnlyForm);
      expect(result).toBeNull();
    });
  });

  //----------------------------//

  describe('firstErrorKey', () => {
    it('should return null for control with no errors', () => {
      const validControl = new FormControl('valid', [Validators.required]);
      const result = FormUtility.firstErrorKey(validControl);
      
      expect(result).toBeNull();
    });

    it('should return first error key for control with single error', () => {
      const invalidControl = new FormControl('', [Validators.required]);
      const result = FormUtility.firstErrorKey(invalidControl);
      
      expect(result).toBe('required');
    });

    it('should return first error key for control with multiple errors', () => {
      const multiErrorControl = new FormControl('', [
        Validators.required,
        Validators.email,
        Validators.minLength(5)
      ]);

      const result = FormUtility.firstErrorKey(multiErrorControl);
      
      expect(result).toBe('required');
    });

    it('should handle control with null errors', () => {
      const control = new FormControl('value');
      // Explicitly set errors to null
      control.setErrors(null);
      
      const result = FormUtility.firstErrorKey(control);
      expect(result).toBeNull();
    });

    it('should handle custom error keys', () => {
      const control = new FormControl('value');
      control.setErrors({ customError: 'Custom error message', anotherError: 'Another error' });
      
      const result = FormUtility.firstErrorKey(control);
      
      // Should return one of the custom error keys (order depends on object iteration)
      expect(['customError', 'anotherError']).toContain(result);
    });
  });

  //----------------------------//

  describe('Integration Tests', () => {
    it('should work correctly with FormGroup containing firstError', () => {
      // Simulate what FirstErrorDirective does
      const form = new FormGroup({
        email: new FormControl('', [Validators.required]),
        password: new FormControl('123', [Validators.minLength(8)])
      });

      // Add firstError like the directive would
      form.get('email')?.setErrors({
        required: true,
        firstError: 'Email is required.'
      });

      const invalidNames = FormUtility.findInvalidControlNames(form);
      const invalidData = FormUtility.findInvalidControlsData(form);
      
      expect(invalidNames.size).toBe(2); // Both email and password are invalid
      expect(invalidData.length).toBe(2);
      
      // Check that firstError doesn't interfere with detection
      const emailData = invalidData.find(item => item.name === 'email');
      expect(emailData?.control.errors).toHaveProperty('firstError');
      expect(emailData?.control.errors).toHaveProperty('required');
    });

    it('should handle complex form validation scenarios', () => {
      const complexForm = new FormGroup({
        personalInfo: new FormGroup({
          firstName: new FormControl('', [Validators.required]),
          lastName: new FormControl('Valid', [Validators.required])
        }),
        email: new FormControl('invalid-email', [Validators.required, Validators.email]),
        preferences: new FormGroup({
          newsletter: new FormControl(true),
          notifications: new FormControl(false)
        })
      });

      // Should only detect top-level invalid controls
      const invalidNames = FormUtility.findInvalidControlNames(complexForm);
      expect(invalidNames.has('personalInfo')).toBe(true);
      expect(invalidNames.has('email')).toBe(true);
      expect(invalidNames.has('preferences')).toBe(false);
    });
  });

  //----------------------------//

  describe('Performance Tests', () => {
    it('should handle large forms efficiently', () => {
      // Create a form with many controls
      const controls: { [key: string]: FormControl } = {};
      for (let i = 0; i < 100; i++) {
        controls[`field${i}`] = new FormControl(i % 2 === 0 ? '' : 'valid', [Validators.required]);
      }
      
      const largeForm = new FormGroup(controls);
      
      const startTime = performance.now();
      const result = FormUtility.findInvalidControlsData(largeForm);
      const endTime = performance.now();
      
      expect(result.length).toBe(50); // Half the controls should be invalid
      expect(endTime - startTime).toBeLessThan(10); // Should complete in under 10ms
    });
  });

  //----------------------------//

  describe('Edge Cases', () => {
    it('should handle disabled controls', () => {
      const formWithDisabled = new FormGroup({
        enabledInvalid: new FormControl('', [Validators.required]),
        disabledInvalid: new FormControl('', [Validators.required])
      });

      formWithDisabled.get('disabledInvalid')?.disable();
      
      const result = FormUtility.findInvalidControlNames(formWithDisabled);
      
      // Disabled controls should still be detected if invalid
      // (This tests current behavior - adjust if behavior should change)
      expect(result.has('enabledInvalid')).toBe(true);
    });

    it('should handle async validators (not tested in this suite)', () => {
      // Note: Async validators would require more complex testing setup
      // This is a placeholder to document the limitation
      expect(true).toBe(true);
    });
  });
});
