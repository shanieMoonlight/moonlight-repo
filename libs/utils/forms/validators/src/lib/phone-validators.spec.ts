import { FormControl } from '@angular/forms';
import { PhoneValidation } from './phone-validators';
import { CountryCode } from 'libphonenumber-js';

describe('PhoneValidation', () => {
  const validCases: { value: string; country: CountryCode; }[] = [
    { value: '+353871234567', country: 'IE' }, // Ireland
    { value: '+14155552671', country: 'US' }, // US
    { value: '+447911123456', country: 'GB' }, // UK
    { value: '+33612345678', country: 'FR' }, // France
    { value: '+61412345678', country: 'AU' }, // Australia
    { value: '+919876543210', country: 'IN' }, // India
    { value: '+27821234567', country: 'ZA' }, // South Africa
    { value: '+819012345678', country: 'JP' }, // Japan
    { value: '', country: 'FR' },//Skip empty value
  ];

  const invalidCases: { value: string; country: CountryCode; reason: string }[] = [
    { value: '+1234', country: 'IE', reason: 'Too short' },
    { value: '+1415555', country: 'US', reason: 'Too short for US' },
    { value: '+44791112345X', country: 'GB', reason: 'Contains letter' },
    { value: '+614123456789012345', country: 'AU', reason: 'Too long' },
    { value: 'notaphone', country: 'IN', reason: 'Not a number' },
    { value: '+278212', country: 'ZA', reason: 'Too short for ZA' },
    { value: '+819012', country: 'JP', reason: 'Too short for JP' },
  ];

  describe('validator', () => {
    it('should validate correct phone numbers', () => {
      for (const test of validCases) {
        const control = new FormControl(test.value);
        const validator = PhoneValidation.validator(test.country);
        const result = validator(control);
        expect(result).toBeNull();
      }
    });

    it('should invalidate incorrect phone numbers', () => {
      for (const test of invalidCases) {
        const control = new FormControl(test.value);
        const validator = PhoneValidation.validator(test.country);
        const result = validator(control);
        console.log(test.value, result);
        console.log(`Testing ${control.value} for ${test.country}:`, result);
        
        expect(result).not.toBeNull();
        expect(result?.phoneNumber?.message).toContain('Invalid phone number');
      }
    });
  });
});
