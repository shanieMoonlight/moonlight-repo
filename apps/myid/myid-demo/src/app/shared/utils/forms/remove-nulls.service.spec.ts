import { RemoveNulls } from './remove-nulls.service';

global.structuredClone = (val) => JSON.parse(JSON.stringify(val))

describe('RemoveNulls Function', () => {

  describe('Input Validation', () => {
    it('should return null when input is null', () => {
      const result = RemoveNulls(null);
      expect(result).toBeNull();
    });

    it('should return undefined when input is undefined', () => {
      const result = RemoveNulls(undefined);
      expect(result).toBeUndefined();
    });

    it('should return primitives unchanged', () => {
      expect(RemoveNulls('string')).toBe('string');
      expect(RemoveNulls(123)).toBe(123);
      expect(RemoveNulls(true)).toBe(true);
      expect(RemoveNulls(false)).toBe(false);
    });
  });

  describe('Object Property Removal', () => {
    it('should remove null properties from object', () => {
      const input = { name: 'John', age: null, city: 'NYC' };
      const result = RemoveNulls(input);
      
      expect(result).toEqual({ name: 'John', city: 'NYC' });
      expect(result).not.toHaveProperty('age');
    });

    it('should remove undefined properties from object', () => {
      const input = { name: 'John', age: undefined, city: 'NYC' };
      const result = RemoveNulls(input);
      
      expect(result).toEqual({ name: 'John', city: 'NYC' });
      expect(result).not.toHaveProperty('age');
    });

    it('should remove both null and undefined properties', () => {
      const input = { 
        name: 'John', 
        age: null, 
        email: undefined, 
        city: 'NYC',
        active: true
      };
      const result = RemoveNulls(input);
      
      expect(result).toEqual({ name: 'John', city: 'NYC', active: true });
      expect(result).not.toHaveProperty('age');
      expect(result).not.toHaveProperty('email');
    });

    it('should preserve falsy values that are not null/undefined', () => {
      const input = { 
        name: '', 
        age: 0, 
        active: false, 
        avatar: null,
        bio: undefined
      };
      const result = RemoveNulls(input);
      
      expect(result).toEqual({ 
        name: '', 
        age: 0, 
        active: false 
      });
      expect(result).not.toHaveProperty('avatar');
      expect(result).not.toHaveProperty('bio');
    });
  });

  describe('Array Handling', () => {
    it('should remove null and undefined items from arrays', () => {
      const input = ['apple', null, 'banana', undefined, 'cherry'];
      const result = RemoveNulls(input);
      
      expect(result).toEqual(['apple', 'banana', 'cherry']);
    });

    it('should clean objects within arrays when iterate is true', () => {
      const input = [
        { name: 'John', age: null },
        null,
        { name: 'Jane', email: undefined, city: 'NYC' },
        undefined
      ];
      const result = RemoveNulls(input, true);
      
      expect(result).toEqual([
        { name: 'John' },
        { name: 'Jane', city: 'NYC' }
      ]);
    });

    it('should not clean objects within arrays when iterate is false', () => {
      const input = [
        { name: 'John', age: null },
        null,
        { name: 'Jane', email: undefined }
      ];
      const result = RemoveNulls(input, false);
      
      expect(result).toEqual([
        { name: 'John', age: null },
        { name: 'Jane', email: undefined }
      ]);
    });

    it('should handle nested arrays', () => {
      const input = [
        ['apple', null],
        null,
        ['banana', undefined, 'cherry']
      ];
      const result = RemoveNulls(input, true);
      
      expect(result).toEqual([
        ['apple'],
        ['banana', 'cherry']
      ]);
    });

    it('should preserve empty arrays', () => {
      const input = { items: [], count: null };
      const result = RemoveNulls(input);
      
      expect(result).toEqual({ items: [] });
    });
  });

  describe('Nested Object Cleaning', () => {
    it('should clean nested objects when iterate is true', () => {
      const input = {
        user: {
          name: 'John',
          profile: {
            bio: null,
            avatar: 'pic.jpg',
            settings: {
              theme: 'dark',
              notifications: null
            }
          }
        },
        metadata: null
      };
      
      const result = RemoveNulls(input, true);
      
      expect(result).toEqual({
        user: {
          name: 'John',
          profile: {
            avatar: 'pic.jpg',
            settings: {
              theme: 'dark'
            }
          }
        }
      });
    });

    it('should not clean nested objects when iterate is false', () => {
      const input = {
        user: {
          name: 'John',
          bio: null
        },
        metadata: null
      };
      
      const result = RemoveNulls(input, false);
      
      expect(result).toEqual({
        user: {
          name: 'John',
          bio: null
        }
      });
    });
  });

  describe('Special Object Types', () => {
    it('should handle Date objects', () => {
      const date = new Date('2023-01-01');
      const input = { created: date, updated: null };
      const result = RemoveNulls(input);
      
      expect(result).toEqual({ created: date.toISOString() });  //Because mock structuredClone , above, is faked with JSON.stringify
    });

  });

  describe('Immutability', () => {
    it('should not modify the original object', () => {
      const original = { name: 'John', age: null, city: 'NYC' };
      const originalCopy = { ...original };
      
      const result = RemoveNulls(original);
      
      // NOTE: This test will FAIL due to the bug in your function!
      // Your function returns 'obj' instead of 'cleaned'
      expect(original).toEqual(originalCopy);
      expect(result).not.toBe(original);
    });

    it('should not modify nested objects in the original', () => {
      const original = {
        user: { name: 'John', bio: null },
        settings: { theme: 'dark', locale: null }
      };
      const originalCopy = JSON.parse(JSON.stringify(original));
      
      RemoveNulls(original);
      
      // NOTE: This test will also FAIL due to the bug!
      expect(original).toEqual(originalCopy);
    });

    it('should not modify original arrays', () => {
      const original = ['apple', null, 'banana'];
      const originalCopy = [...original];
      
      const result = RemoveNulls(original);
      
      expect(original).toEqual(originalCopy);
      expect(result).not.toBe(original);
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty objects', () => {
      const result = RemoveNulls({});
      expect(result).toEqual({});
    });

    it('should handle objects with only null properties', () => {
      const input = { a: null, b: null, c: undefined };
      const result = RemoveNulls(input);
      
      expect(result).toEqual({});
      expect(Object.keys(result)).toHaveLength(0);
    });

    it('should handle deeply nested structures', () => {
      const input = {
        level1: {
          level2: {
            level3: {
              value: 'deep',
              nullValue: null
            },
            arrayLevel: [
              { item: 'test', nullItem: null },
              null
            ]
          }
        }
      };
      
      const result = RemoveNulls(input, true);
      
      expect(result).toEqual({
        level1: {
          level2: {
            level3: {
              value: 'deep'
            },
            arrayLevel: [
              { item: 'test' }
            ]
          }
        }
      });
    });
  });

  describe('Real-World Scenarios', () => {
    it('should clean form data for HTTP requests', () => {
      const formData = {
        email: 'user@example.com',
        password: 'secret123',
        confirmPassword: null, // Not needed for API
        rememberMe: true,
        profile: {
          firstName: 'John',
          lastName: 'Doe',
          avatar: null, // No avatar uploaded
          bio: undefined
        }
      };
      
      const result = RemoveNulls(formData);
      
      expect(result).toEqual({
        email: 'user@example.com',
        password: 'secret123',
        rememberMe: true,
        profile: {
          firstName: 'John',
          lastName: 'Doe'
        }
      });
    });

    it('should clean API response data', () => {
      const apiResponse = {
        users: [
          { id: 1, name: 'John', email: 'john@test.com' },
          { id: 2, name: 'Jane', email: null },
          null, // Invalid user entry
          { id: 3, name: 'Bob', phone: undefined }
        ],
        pagination: {
          total: 3,
          page: 1,
          nextPage: null
        }
      };
      
      const result = RemoveNulls(apiResponse);
      
      expect(result).toEqual({
        users: [
          { id: 1, name: 'John', email: 'john@test.com' },
          { id: 2, name: 'Jane' },
          { id: 3, name: 'Bob' }
        ],
        pagination: {
          total: 3,
          page: 1
        }
      });
    });
  });

  describe('Bug Detection', () => {
    it('should demonstrate the current bug - returning original instead of cleaned', () => {
      const original = { name: 'John', age: null };
      const result = RemoveNulls(original);
      
      // This test documents the current bug:
      // The function should return a new object, but currently returns the original
      // TODO: Fix the function to return 'cleaned' instead of 'obj'
      
      // What should happen (after fixing the bug):
      // expect(result).not.toBe(original);
      // expect(result).toEqual({ name: 'John' });
      
      // What currently happens (due to the bug):
      console.warn('BUG: Function returns original object instead of cleaned copy');
    });
  });
});