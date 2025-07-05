import { FormGroup, FormControl } from '@angular/forms';
import { NumericValidation } from './numeric-validators';

describe('NumericValidation.lessThanValidator', () => {
  it('should return null when min < max (strict)', () => {
    const form = new FormGroup({
      min: new FormControl(1),
      max: new FormControl(2),
    });
    const validator = NumericValidation.lessThanValidator('min', 'max', true);
    expect(validator(form)).toBeNull();
  });

  it('should return error when min >= max (strict)', () => {
    const form = new FormGroup({
      min: new FormControl(2),
      max: new FormControl(2),
    });
    const validator = NumericValidation.lessThanValidator('min', 'max', true);
    expect(validator(form)).toHaveProperty('minMaxError');
  });

  it('should return null when min == max (non-strict)', () => {
    const form = new FormGroup({
      min: new FormControl(2),
      max: new FormControl(2),
    });
    const validator = NumericValidation.lessThanValidator('min', 'max', false);
    expect(validator(form)).toBeNull();
  });

  it('should return error when min > max (non-strict)', () => {
    const form = new FormGroup({
      min: new FormControl(3),
      max: new FormControl(2),
    });
    const validator = NumericValidation.lessThanValidator('min', 'max', false);
    expect(validator(form)).toHaveProperty('minMaxError');
  });

  it('should return null if controls are missing', () => {
    const form = new FormGroup({
      min: new FormControl(1),
    });
    const validator = NumericValidation.lessThanValidator('min', 'max', true);
    expect(validator(form)).toBeNull();
  });

  it('should return null if values are not numbers', () => {
    const form = new FormGroup({
      min: new FormControl('foo'),
      max: new FormControl('bar'),
    });
    const validator = NumericValidation.lessThanValidator('min', 'max', true);
    expect(validator(form)).toBeNull();
  });

  it('should use custom error message if provided', () => {
    const form = new FormGroup({
      min: new FormControl(5),
      max: new FormControl(2),
    });
    const validator = NumericValidation.lessThanValidator('min', 'max', true, 'Custom error');
    const result = validator(form);
    expect(result?.['minMaxError']?.message).toBe('Custom error');
  });
});