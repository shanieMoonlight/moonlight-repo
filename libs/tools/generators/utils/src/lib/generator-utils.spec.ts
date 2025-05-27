import { Tree } from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { GeneratorUtils } from './generator-utils';

describe('GeneratorUtils', () => {
  let tree: Tree;

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace();
  });

  describe('findFilesByPattern', () => {
    beforeEach(() => {
      // Create a test directory structure
      tree.write('test-dir/file1.ts', 'content1');
      tree.write('test-dir/file2.js', 'content2');
      tree.write('test-dir/route-defs.ts', 'route content');
      tree.write('test-dir/sub-dir/file3.ts', 'content3');
      tree.write('test-dir/sub-dir/route-defs.ts', 'nested route content');
      tree.write('test-dir/sub-dir/deep/file4.ts', 'content4');
      tree.write('test-dir/sub-dir/deep/route-defs.ts', 'deep route content');
      tree.write('test-dir/another-file.txt', 'text content');
      tree.write('other-dir/route-defs.ts', 'other route content');
    });

    // Helper function to normalize paths to forward slashes for cross-platform compatibility
    const normalizePaths = (paths: string[]) => paths.map(p => p.replace(/\\/g, '/'));    it('should find files matching the pattern in directory', () => {
      // Act
      const result = GeneratorUtils.findFilesByPattern(tree, 'test-dir', 'route-defs.ts');
      const normalizedResult = normalizePaths(result);

      // Assert
      expect(normalizedResult).toHaveLength(3);
      expect(normalizedResult).toContain('test-dir/route-defs.ts');
      expect(normalizedResult).toContain('test-dir/sub-dir/route-defs.ts');
      expect(normalizedResult).toContain('test-dir/sub-dir/deep/route-defs.ts');
    });    it('should find files with different extensions', () => {
      // Act
      const tsFiles = GeneratorUtils.findFilesByPattern(tree, 'test-dir', '.ts');
      const normalizedFiles = normalizePaths(tsFiles);
      
      // Assert - Should find 6 .ts files (not 5 as previously expected)
      expect(normalizedFiles).toHaveLength(6); // All .ts files including route-defs.ts files
      expect(normalizedFiles).toContain('test-dir/file1.ts');
      expect(normalizedFiles).toContain('test-dir/route-defs.ts');
      expect(normalizedFiles).toContain('test-dir/sub-dir/file3.ts');
      expect(normalizedFiles).toContain('test-dir/sub-dir/route-defs.ts');
      expect(normalizedFiles).toContain('test-dir/sub-dir/deep/file4.ts');
      expect(normalizedFiles).toContain('test-dir/sub-dir/deep/route-defs.ts');
    });

    it('should return empty array when no files match pattern', () => {
      // Act
      const result = GeneratorUtils.findFilesByPattern(tree, 'test-dir', 'nonexistent.ts');

      // Assert
      expect(result).toHaveLength(0);
    });

    it('should return empty array when directory does not exist', () => {
      // Act
      const result = GeneratorUtils.findFilesByPattern(tree, 'nonexistent-dir', 'route-defs.ts');

      // Assert
      expect(result).toHaveLength(0);
    });

    it('should handle empty directory', () => {
      // Arrange
      tree.write('empty-dir/.gitkeep', ''); // Create empty directory with a placeholder
      tree.delete('empty-dir/.gitkeep'); // Remove the placeholder to leave empty directory

      // Act
      const result = GeneratorUtils.findFilesByPattern(tree, 'empty-dir', 'route-defs.ts');

      // Assert
      expect(result).toHaveLength(0);
    });    it('should search recursively through nested directories', () => {
      // Arrange
      tree.write('deep-test/level1/level2/level3/target.ts', 'deep content');
      tree.write('deep-test/level1/other.ts', 'other content');

      // Act
      const result = GeneratorUtils.findFilesByPattern(tree, 'deep-test', 'target.ts');
      const normalizedResult = normalizePaths(result);

      // Assert
      expect(normalizedResult).toHaveLength(1);
      expect(normalizedResult).toContain('deep-test/level1/level2/level3/target.ts');
    });    it('should handle patterns that are substrings of filenames', () => {
      // Arrange
      tree.write('substring-test/component.ts', 'component content');
      tree.write('substring-test/component.spec.ts', 'spec content');
      tree.write('substring-test/my-component.ts', 'my-component content');

      // Act
      const result = GeneratorUtils.findFilesByPattern(tree, 'substring-test', 'component.ts');
      const normalizedResult = normalizePaths(result);

      // Assert
      expect(normalizedResult).toHaveLength(2); // component.ts and my-component.ts
      expect(normalizedResult).toContain('substring-test/component.ts');
      expect(normalizedResult).toContain('substring-test/my-component.ts');
      expect(normalizedResult).not.toContain('substring-test/component.spec.ts');
    });    it('should handle special characters in pattern', () => {
      // Arrange
      tree.write('special-test/file-with-dash.ts', 'dash content');
      tree.write('special-test/file_with_underscore.ts', 'underscore content');
      tree.write('special-test/file.with.dots.ts', 'dots content');

      // Act
      const dashResult = GeneratorUtils.findFilesByPattern(tree, 'special-test', 'file-with-dash.ts');
      const underscoreResult = GeneratorUtils.findFilesByPattern(tree, 'special-test', 'file_with_underscore.ts');
      const dotsResult = GeneratorUtils.findFilesByPattern(tree, 'special-test', 'file.with.dots.ts');

      // Assert
      expect(normalizePaths(dashResult)).toHaveLength(1);
      expect(normalizePaths(dashResult)).toContain('special-test/file-with-dash.ts');
      
      expect(normalizePaths(underscoreResult)).toHaveLength(1);
      expect(normalizePaths(underscoreResult)).toContain('special-test/file_with_underscore.ts');
      
      expect(normalizePaths(dotsResult)).toHaveLength(1);
      expect(normalizePaths(dotsResult)).toContain('special-test/file.with.dots.ts');
    });    it('should handle case-sensitive pattern matching', () => {
      // Arrange
      tree.write('case-test/RouteDeFs.ts', 'case content');
      tree.write('case-test/route-defs.ts', 'lowercase content');
      tree.write('case-test/ROUTE-DEFS.ts', 'uppercase content');

      // Act
      const result = GeneratorUtils.findFilesByPattern(tree, 'case-test', 'route-defs.ts');
      const normalizedResult = normalizePaths(result);

      // Assert
      expect(normalizedResult).toHaveLength(1);
      expect(normalizedResult).toContain('case-test/route-defs.ts');
      expect(normalizedResult).not.toContain('case-test/RouteDeFs.ts');
      expect(normalizedResult).not.toContain('case-test/ROUTE-DEFS.ts');
    });    it('should handle directories with many nested levels', () => {
      // Arrange
      const deepPath = 'very/deep/nested/structure/with/many/levels';
      tree.write(`${deepPath}/target.ts`, 'very deep content');
      tree.write(`${deepPath}/other.ts`, 'other deep content');

      // Act
      const result = GeneratorUtils.findFilesByPattern(tree, 'very', 'target.ts');
      const normalizedResult = normalizePaths(result);

      // Assert
      expect(normalizedResult).toHaveLength(1);
      expect(normalizedResult).toContain(`${deepPath}/target.ts`);
    });

    it('should log search directory and pattern', () => {
      // Arrange
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      // Act
      GeneratorUtils.findFilesByPattern(tree, 'test-dir', 'route-defs.ts');

      // Assert
      expect(consoleSpy).toHaveBeenCalledWith('Searching in directory: test-dir for pattern: route-defs.ts');
      
      // Cleanup
      consoleSpy.mockRestore();
    });    it('should handle mixed file types in same directory', () => {
      // Arrange
      tree.write('mixed-test/component.ts', 'ts content');
      tree.write('mixed-test/component.js', 'js content');
      tree.write('mixed-test/component.html', 'html content');
      tree.write('mixed-test/component.scss', 'scss content');
      tree.write('mixed-test/README.md', 'md content');

      // Act - Search for files that start with 'component' and have any extension
      const result = GeneratorUtils.findFilesByPattern(tree, 'mixed-test', 'component.ts');
      const normalizedResult = normalizePaths(result);

      // Assert - Should find only the TypeScript component file
      expect(normalizedResult).toHaveLength(1);
      expect(normalizedResult).toContain('mixed-test/component.ts');
      expect(normalizedResult).not.toContain('mixed-test/component.js');
      expect(normalizedResult).not.toContain('mixed-test/component.html');
      expect(normalizedResult).not.toContain('mixed-test/component.scss');
      expect(normalizedResult).not.toContain('mixed-test/README.md');
    });
  });

  describe('joinTags', () => {
    it('should join tags with commas', () => {
      // Act
      const result = GeneratorUtils.joinTags(['tag1', 'tag2', 'tag3']);

      // Assert
      expect(result).toBe('tag1,tag2,tag3');
    });

    it('should handle empty array', () => {
      // Act
      const result = GeneratorUtils.joinTags([]);

      // Assert
      expect(result).toBe('');
    });

    it('should trim whitespace from tags', () => {
      // Act
      const result = GeneratorUtils.joinTags(['  tag1  ', ' tag2 ', 'tag3']);

      // Assert
      expect(result).toBe('tag1,tag2,tag3');
    });

    it('should filter out empty tags', () => {
      // Act
      const result = GeneratorUtils.joinTags(['tag1', '', 'tag2', '   ', 'tag3']);

      // Assert
      expect(result).toBe('tag1,tag2,tag3');
    });
  });
});
