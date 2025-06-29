import { CamelToTitlePipe } from './camelcase-to-titlecase.pipe';

describe('CamelToTitlePipe', () => {
  let pipe: CamelToTitlePipe;

  beforeEach(() => {
    pipe = new CamelToTitlePipe();
  });

  it('should convert camelCase to title case', () => {
    expect(pipe.transform('camelCaseString')).toBe('Camel Case String');
    expect(pipe.transform('anotherExampleHere')).toBe('Another Example Here');
  });

  it('should convert PascalCase to title case', () => {
    expect(pipe.transform('PascalCaseString')).toBe('Pascal Case String');
  });

  it('should handle empty string', () => {
    expect(pipe.transform('')).toBe('');
  });

  it('should return value if not a string', () => {
    expect(pipe.transform(null as any)).toBe('');
    expect(pipe.transform(undefined as any)).toBe('');
    expect(pipe.transform(123 as any)).toBe(123);
    expect(pipe.transform({} as any)).toEqual({});
  });
});
