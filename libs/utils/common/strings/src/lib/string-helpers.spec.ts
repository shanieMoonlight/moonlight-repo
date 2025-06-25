import { StringHelpers } from './string-helpers';

describe('StringHelpers', () => {
  describe('clone', () => {
    it('returns a copy of a string', () => {
      expect(StringHelpers.clone('foo')).toBe('foo');
    });
    it('returns empty string for null or undefined', () => {
      expect(StringHelpers.clone(null)).toBe('');
      expect(StringHelpers.clone(undefined)).toBe('');
    });
  });

  describe('isNullOrWhitespace', () => {
    it('returns true for null, undefined, empty, or whitespace', () => {
      expect(StringHelpers.isNullOrWhitespace(null)).toBe(true);
      expect(StringHelpers.isNullOrWhitespace(undefined)).toBe(true);
      expect(StringHelpers.isNullOrWhitespace('')).toBe(true);
      expect(StringHelpers.isNullOrWhitespace('   ')).toBe(true);
    });
    it('returns false for non-empty, non-whitespace strings', () => {
      expect(StringHelpers.isNullOrWhitespace('foo')).toBe(false);
      expect(StringHelpers.isNullOrWhitespace('  bar  ')).toBe(false);
    });
  });

  describe('isString', () => {
    it('returns true for string primitives and String objects', () => {
      expect(StringHelpers.isString('foo')).toBe(true);
      expect(StringHelpers.isString(new String('bar'))).toBe(true);
    });
    it('returns false for non-strings', () => {
      expect(StringHelpers.isString(123)).toBe(false);
      expect(StringHelpers.isString({})).toBe(false);
      expect(StringHelpers.isString([])).toBe(false);
      expect(StringHelpers.isString(null)).toBe(false);
      expect(StringHelpers.isString(undefined)).toBe(false);
    });
  });

  describe('removeWhitespace', () => {
    it('removes all whitespace and trims', () => {
      expect(StringHelpers.removeWhitespace('  a b  c d  ')).toBe('abcd');
      expect(StringHelpers.removeWhitespace('\tfoo\nbar ')).toBe('foobar');
    });
    it('returns empty string for only whitespace', () => {
      expect(StringHelpers.removeWhitespace('   ')).toBe('');
    });
  });

  describe('dashedToTitleCase', () => {
    it('converts dashed/camelCase to title case', () => {
      expect(StringHelpers.dashedToTitleCase('foo-barBaz')).toBe('Foo Bar Baz');
      expect(StringHelpers.dashedToTitleCase('fooBar')).toBe('Foo Bar');
      expect(StringHelpers.dashedToTitleCase('foo-bar-baz')).toBe('Foo Bar Baz');
    });
    it('returns empty string for empty input', () => {
      expect(StringHelpers.dashedToTitleCase('')).toBe('');
      expect(StringHelpers.dashedToTitleCase(undefined)).toBe('');
    });
  });

  describe('toTitleCase', () => {
    it('converts camelCase to title case', () => {
      expect(StringHelpers.toTitleCase('fooBarBaz')).toBe('Foo Bar Baz');
      expect(StringHelpers.toTitleCase('fooBar')).toBe('Foo Bar');
      expect(StringHelpers.toTitleCase('foo')).toBe('Foo');
    });
    it('returns empty string for empty input', () => {
      expect(StringHelpers.toTitleCase('')).toBe('');
      expect(StringHelpers.toTitleCase(undefined)).toBe('');
    });
  });

  describe('toTitleCases', () => {
    it('converts camelCase to title case', () => {
      expect(StringHelpers.toTitleCases('fooBarBaz')).toBe('Foo Bar Baz');
    });
    it('converts dashed/camelCase to title case and removes dashes if requested', () => {
      expect(StringHelpers.toTitleCases('foo-barBaz', true)).toBe('Foo Bar Baz');
      expect(StringHelpers.toTitleCases('foo-bar-baz', true)).toBe('Foo Bar Baz');
    });
    it('keeps dashes if removeDashes is false', () => {
      expect(StringHelpers.toTitleCases('foo-barBaz', false)).toBe('Foo-bar Baz');
    });

    it('returns empty string for empty input', () => {
      expect(StringHelpers.toTitleCases('')).toBe('');
      expect(StringHelpers.toTitleCases(undefined)).toBe('');
    });
  });

  describe('truncate', () => {
    it('truncates and adds ellipsis if needed', () => {
      expect(StringHelpers.truncate('abcdefghij', 5)).toBe('abcde…');
      expect(StringHelpers.truncate('abcdefghij', 10)).toBe('abcdefghij');
      expect(StringHelpers.truncate('abcdefghij', 5, false)).toBe('abcde');
    });
    it('returns empty string for empty input', () => {
      expect(StringHelpers.truncate('')).toBe('');
      expect(StringHelpers.truncate(undefined)).toBe('');
    });
    it('returns original string if shorter than maxLength', () => {
      expect(StringHelpers.truncate('foo', 10)).toBe('foo');
    });
  });
});