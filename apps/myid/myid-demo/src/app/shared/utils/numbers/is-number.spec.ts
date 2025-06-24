import { isNumber } from './is-number';

describe('isNumber', () => {
  it('returns true for integer numbers', () => {
    expect(isNumber(42)).toBe(true);
    expect(isNumber(-1)).toBe(true);
    expect(isNumber(0)).toBe(true);
  });

  it('returns true for floating point numbers', () => {
    expect(isNumber(3.14)).toBe(true);
    expect(isNumber(-0.001)).toBe(true);
  });

  it('returns false for NaN and Infinity', () => {
    expect(isNumber(NaN)).toBe(false);
    expect(isNumber(Infinity)).toBe(false);
    expect(isNumber(-Infinity)).toBe(false);
  });

  it('returns true for numeric strings', () => {
    expect(isNumber('123')).toBe(true);
    expect(isNumber('-123.45')).toBe(true);
    expect(isNumber('0')).toBe(true);
    expect(isNumber('  42  ')).toBe(true);
    expect(isNumber('1e3')).toBe(true);
  });

  it('returns false for empty or whitespace strings', () => {
    expect(isNumber('')).toBe(false);
    expect(isNumber('   ')).toBe(false);
  });

  it('returns false for non-numeric strings', () => {
    expect(isNumber('abc')).toBe(false);
    expect(isNumber('123abc')).toBe(false);
    expect(isNumber('abc123')).toBe(false);
    expect(isNumber('NaN')).toBe(false);
    expect(isNumber('Infinity')).toBe(false);
  });

  it('returns false for null, undefined, and non-string/number types', () => {
    expect(isNumber(null)).toBe(false);
    expect(isNumber(undefined)).toBe(false);
    expect(isNumber({})).toBe(false);
    expect(isNumber([])).toBe(false);
    expect(isNumber([1,2,3])).toBe(false);
    expect(isNumber(true)).toBe(false);
    expect(isNumber(false)).toBe(false);
    expect(isNumber(Symbol('1'))).toBe(false);
    expect(isNumber(() => 1)).toBe(false);
  });
});