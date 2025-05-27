import { PathUtils } from './path-utils';

describe('PathUtils', () => {
  
  describe('combine', () => {
    
    it('should combine multiple valid path segments', () => {
      // Act
      const result = PathUtils.combine('path', 'to', 'file');

      // Assert
      expect(result).toBe('path/to/file');
    });

    it('should handle single path segment', () => {
      // Act
      const result = PathUtils.combine('single-path');

      // Assert
      expect(result).toBe('single-path');
    });

    it('should return empty string when no arguments provided', () => {
      // Act
      const result = PathUtils.combine();

      // Assert
      expect(result).toBe('');
    });

    it('should filter out null values', () => {
      // Act
      const result = PathUtils.combine('path', null, 'to', 'file');

      // Assert
      expect(result).toBe('path/to/file');
    });

    it('should filter out undefined values', () => {
      // Act
      const result = PathUtils.combine('path', undefined, 'to', 'file');

      // Assert
      expect(result).toBe('path/to/file');
    });

    it('should filter out empty strings', () => {
      // Act
      const result = PathUtils.combine('path', '', 'to', 'file');

      // Assert
      expect(result).toBe('path/to/file');
    });

    it('should filter out whitespace-only strings', () => {
      // Act
      const result = PathUtils.combine('path', '   ', 'to', 'file');

      // Assert
      expect(result).toBe('path/to/file');
    });

    it('should trim whitespace from valid segments', () => {
      // Act
      const result = PathUtils.combine('  path  ', '  to  ', '  file  ');

      // Assert
      expect(result).toBe('path/to/file');
    });

    it('should handle mixed valid and invalid segments', () => {
      // Act
      const result = PathUtils.combine('path', null, '  to  ', '', undefined, 'file', '   ');

      // Assert
      expect(result).toBe('path/to/file');
    });

    it('should replace multiple consecutive slashes with single slash', () => {
      // Act
      const result = PathUtils.combine('path//to', 'file///name');

      // Assert
      expect(result).toBe('path/to/file/name');
    });

    it('should handle segments that already contain slashes', () => {
      // Act
      const result = PathUtils.combine('path/to', 'some/file');

      // Assert
      expect(result).toBe('path/to/some/file');
    });

    it('should remove trailing slash except for root path', () => {
      // Act
      const result = PathUtils.combine('path', 'to', 'folder/');

      // Assert
      expect(result).toBe('path/to/folder');
    });

    it('should preserve root path with trailing slash', () => {
      // Act
      const result = PathUtils.combine('/');

      // Assert
      expect(result).toBe('/');
    });

    it('should handle absolute paths starting with slash', () => {
      // Act
      const result = PathUtils.combine('/root', 'path', 'to', 'file');

      // Assert
      expect(result).toBe('/root/path/to/file');
    });

    it('should handle Windows-style paths with backslashes', () => {
      // Act
      const result = PathUtils.combine('C:\\Users', 'Documents', 'file.txt');

      // Assert
      expect(result).toBe('C:\\Users/Documents/file.txt');
    });

    it('should handle relative paths with dots', () => {
      // Act
      const result = PathUtils.combine('.', 'relative', 'path');

      // Assert
      expect(result).toBe('./relative/path');
    });

    it('should handle parent directory references', () => {
      // Act
      const result = PathUtils.combine('..', 'parent', 'path');

      // Assert
      expect(result).toBe('../parent/path');
    });

    it('should handle complex path with multiple edge cases', () => {
      // Act
      const result = PathUtils.combine(
        '  /root  ',
        null,
        '  path//to  ',
        '',
        undefined,
        '  folder/  ',
        '   ',
        'file.txt'
      );

      // Assert
      expect(result).toBe('/root/path/to/folder/file.txt');
    });

    it('should return empty string when all segments are invalid', () => {
      // Act
      const result = PathUtils.combine(null, undefined, '', '   ', '  ');

      // Assert
      expect(result).toBe('');
    });

    it('should handle file extensions correctly', () => {
      // Act
      const result = PathUtils.combine('path', 'to', 'file.json');

      // Assert
      expect(result).toBe('path/to/file.json');
    });

    it('should handle paths with special characters', () => {
      // Act
      const result = PathUtils.combine('path-with-dashes', 'path_with_underscores', 'path.with.dots');

      // Assert
      expect(result).toBe('path-with-dashes/path_with_underscores/path.with.dots');
    });

    it('should handle very long path segments', () => {
      // Arrange
      const longSegment = 'a'.repeat(100);
      
      // Act
      const result = PathUtils.combine('short', longSegment, 'path');

      // Assert
      expect(result).toBe(`short/${longSegment}/path`);
    });

    it('should handle paths with spaces in segment names', () => {
      // Act
      const result = PathUtils.combine('path with spaces', 'another path', 'file name.txt');

      // Assert
      expect(result).toBe('path with spaces/another path/file name.txt');
    });

    it('should handle unicode characters in paths', () => {
      // Act
      const result = PathUtils.combine('path', 'tö', 'fïlé.txt');

      // Assert
      expect(result).toBe('path/tö/fïlé.txt');
    });

    it('should handle multiple trailing slashes', () => {
      // Act
      const result = PathUtils.combine('path', 'to', 'folder///');

      // Assert
      expect(result).toBe('path/to/folder');
    });

    it('should handle mix of forward and backward slashes', () => {
      // Act
      const result = PathUtils.combine('path\\to', 'folder/subfolder', 'file');

      // Assert
      expect(result).toBe('path\\to/folder/subfolder/file');
    });

    it('should handle numeric path segments', () => {
      // Act
      const result = PathUtils.combine('path', '123', '456', 'file');

      // Assert
      expect(result).toBe('path/123/456/file');
    });

    it('should handle boolean-like strings', () => {
      // Act
      const result = PathUtils.combine('path', 'true', 'false', 'file');

      // Assert
      expect(result).toBe('path/true/false/file');
    });

    // Edge cases and integration scenarios
    describe('edge cases and integration scenarios', () => {
      
      it('should handle extremely nested paths', () => {
        // Arrange
        const segments = Array.from({ length: 20 }, (_, i) => `level${i}`);
        
        // Act
        const result = PathUtils.combine(...segments);

        // Assert
        const expected = segments.join('/');
        expect(result).toBe(expected);
      });

      it('should handle alternating valid and invalid segments', () => {
        // Act
        const result = PathUtils.combine(
          'valid1', null, 'valid2', undefined, 'valid3', '', 'valid4', '   '
        );

        // Assert
        expect(result).toBe('valid1/valid2/valid3/valid4');
      });

      it('should be consistent across multiple calls with same input', () => {
        // Arrange
        const segments = ['path', '  to  ', null, 'file'];
        
        // Act
        const result1 = PathUtils.combine(...segments);
        const result2 = PathUtils.combine(...segments);

        // Assert
        expect(result1).toBe(result2);
        expect(result1).toBe('path/to/file');
      });

      it('should handle TypeScript strict null checks properly', () => {
        // Arrange
        const maybeNull: string | null = Math.random() > 0.5 ? 'valid' : null;
        const maybeUndefined: string | undefined = Math.random() > 0.5 ? 'valid' : undefined;
        
        // Act & Assert - Should not throw
        expect(() => {
          PathUtils.combine('path', maybeNull, maybeUndefined, 'file');
        }).not.toThrow();
      });
    });
  });
});
