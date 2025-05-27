import { Tree } from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { PackageJsonUtils } from './package-json-utils';

describe('PackageJsonUtils', () => {
  let tree: Tree;
  let mockProjectConfig: any;

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace();
    mockProjectConfig = {
      root: 'libs/test-project',
      name: 'test-project'
    };
  });

  describe('getPackageJson', () => {
    it('should return package.json content when file exists and is valid', () => {
      // Arrange
      const packageJsonContent = {
        name: '@test/my-package',
        version: '1.0.0',
        dependencies: {
          'rxjs': '^7.0.0'
        }
      };
      
      tree.write('libs/test-project/package.json', JSON.stringify(packageJsonContent, null, 2));

      // Act
      const result = PackageJsonUtils.getPackageJson(tree, mockProjectConfig);

      // Assert
      expect(result).toEqual(packageJsonContent);
    });

    it('should return null when projectConfig is null', () => {
      // Arrange
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      // Act
      const result = PackageJsonUtils.getPackageJson(tree, null);

      // Assert
      expect(result).toBeNull();
      expect(consoleSpy).toHaveBeenCalledWith('Could not find project configuration');
      
      // Cleanup
      consoleSpy.mockRestore();
    });

    it('should return null when projectConfig is undefined', () => {
      // Arrange
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      // Act
      const result = PackageJsonUtils.getPackageJson(tree, undefined);

      // Assert
      expect(result).toBeNull();
      expect(consoleSpy).toHaveBeenCalledWith('Could not find project configuration');
      
      // Cleanup
      consoleSpy.mockRestore();
    });

    it('should return null when projectConfig has no root property', () => {
      // Arrange
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      const invalidProjectConfig = { name: 'test-project' }; // Missing root

      // Act
      const result = PackageJsonUtils.getPackageJson(tree, invalidProjectConfig);

      // Assert
      expect(result).toBeNull();
      expect(consoleSpy).toHaveBeenCalledWith('Could not find project configuration');
      
      // Cleanup
      consoleSpy.mockRestore();
    });    it('should return null when package.json file does not exist', () => {
      // Arrange
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();

      // Act
      const result = PackageJsonUtils.getPackageJson(tree, mockProjectConfig);

      // Assert
      expect(result).toBeNull();
      // Use regex to handle both Windows (\) and Unix (/) path separators
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringMatching(/package\.json not found at libs[\\/]test-project[\\/]package\.json for project/)
      );
      
      // Cleanup
      consoleSpy.mockRestore();
    }); 
      it('should return null when package.json file exists but is empty', () => {
      // Arrange
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      tree.write('libs/test-project/package.json', '');

      // Act
      const result = PackageJsonUtils.getPackageJson(tree, mockProjectConfig);

      // Assert
      expect(result).toBeNull();
      expect(consoleSpy).toHaveBeenCalledWith('Error locating package.json for :', expect.any(SyntaxError));
      
      // Cleanup
      consoleSpy.mockRestore();
    });


    it('should return null when package.json contains invalid JSON', () => {
      // Arrange
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      tree.write('libs/test-project/package.json', '{ invalid json content }');

      // Act
      const result = PackageJsonUtils.getPackageJson(tree, mockProjectConfig);

      // Assert
      expect(result).toBeNull();
      expect(consoleSpy).toHaveBeenCalledWith('Error locating package.json for :', expect.any(SyntaxError));
      
      // Cleanup
      consoleSpy.mockRestore();
    });

    it('should handle different project root paths correctly', () => {
      // Arrange
      const deepProjectConfig = {
        root: 'libs/deep/nested/project',
        name: 'nested-project'
      };
      const packageJsonContent = {
        name: '@deep/nested-package',
        version: '2.1.0'
      };
      
      tree.write('libs/deep/nested/project/package.json', JSON.stringify(packageJsonContent));

      // Act
      const result = PackageJsonUtils.getPackageJson(tree, deepProjectConfig);

      // Assert
      expect(result).toEqual(packageJsonContent);
    });

    it('should handle package.json with complex structure', () => {
      // Arrange
      const complexPackageJson = {
        name: '@test/complex-package',
        version: '1.0.0',
        description: 'A complex package for testing',
        main: 'index.js',
        scripts: {
          build: 'tsc',
          test: 'jest',
          lint: 'eslint'
        },
        dependencies: {
          'rxjs': '^7.0.0',
          '@angular/core': '^17.0.0'
        },
        devDependencies: {
          'typescript': '^5.0.0',
          'jest': '^29.0.0'
        },
        peerDependencies: {
          '@angular/common': '^17.0.0'
        },
        keywords: ['angular', 'library'],
        author: 'Test Author',
        license: 'MIT',
        repository: {
          type: 'git',
          url: 'https://github.com/test/repo.git'
        }
      };
      
      tree.write('libs/test-project/package.json', JSON.stringify(complexPackageJson, null, 2));

      // Act
      const result = PackageJsonUtils.getPackageJson(tree, mockProjectConfig);

      // Assert
      expect(result).toEqual(complexPackageJson);
      expect(result.scripts.build).toBe('tsc');
      expect(result.dependencies.rxjs).toBe('^7.0.0');
      expect(result.devDependencies.typescript).toBe('^5.0.0');
    });

    it('should handle package.json with special characters in values', () => {
      // Arrange
      const specialCharsPackageJson = {
        name: '@test/special-chars',
        version: '1.0.0',
        description: 'Package with "quotes", \'apostrophes\', and other special chars: !@#$%^&*()',
        author: 'Test Author <test@example.com>',
        scripts: {
          'build:prod': 'ng build --configuration=production',
          'test:watch': 'jest --watch'
        }
      };
      
      tree.write('libs/test-project/package.json', JSON.stringify(specialCharsPackageJson, null, 2));

      // Act
      const result = PackageJsonUtils.getPackageJson(tree, mockProjectConfig);

      // Assert
      expect(result).toEqual(specialCharsPackageJson);
      expect(result.description).toContain('quotes');
      expect(result.scripts['build:prod']).toContain('--configuration=production');
    });
  });

  describe('getPackageJsonNameProperty', () => {
    it('should return package name when package.json exists and has name property', () => {
      // Arrange
      const packageJsonContent = {
        name: '@test/my-awesome-package',
        version: '1.0.0'
      };
      
      tree.write('libs/test-project/package.json', JSON.stringify(packageJsonContent));

      // Act
      const result = PackageJsonUtils.getPackageJsonNameProperty(tree, mockProjectConfig);

      // Assert
      expect(result).toBe('@test/my-awesome-package');
    });

    it('should return undefined when package.json does not exist', () => {
      // Arrange
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();

      // Act
      const result = PackageJsonUtils.getPackageJsonNameProperty(tree, mockProjectConfig);

      // Assert
      expect(result).toBeUndefined();
      
      // Cleanup
      consoleSpy.mockRestore();
    });

    it('should return undefined when package.json exists but has no name property', () => {
      // Arrange
      const packageJsonContent = {
        version: '1.0.0',
        description: 'Package without name'
      };
      
      tree.write('libs/test-project/package.json', JSON.stringify(packageJsonContent));

      // Act
      const result = PackageJsonUtils.getPackageJsonNameProperty(tree, mockProjectConfig);

      // Assert
      expect(result).toBeUndefined();
    });

    it('should return undefined when projectConfig is invalid', () => {
      // Arrange
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      // Act
      const result = PackageJsonUtils.getPackageJsonNameProperty(tree, null);

      // Assert
      expect(result).toBeUndefined();
      
      // Cleanup
      consoleSpy.mockRestore();
    });

    it('should handle scoped package names correctly', () => {
      // Arrange
      const packageJsonContent = {
        name: '@my-org/sub-scope/deep-package',
        version: '2.1.0'
      };
      
      tree.write('libs/test-project/package.json', JSON.stringify(packageJsonContent));

      // Act
      const result = PackageJsonUtils.getPackageJsonNameProperty(tree, mockProjectConfig);

      // Assert
      expect(result).toBe('@my-org/sub-scope/deep-package');
    });

    it('should handle non-scoped package names correctly', () => {
      // Arrange
      const packageJsonContent = {
        name: 'simple-package-name',
        version: '1.0.0'
      };
      
      tree.write('libs/test-project/package.json', JSON.stringify(packageJsonContent));

      // Act
      const result = PackageJsonUtils.getPackageJsonNameProperty(tree, mockProjectConfig);

      // Assert
      expect(result).toBe('simple-package-name');
    });

    it('should handle package names with special characters', () => {
      // Arrange
      const packageJsonContent = {
        name: '@test/package-with_special.chars',
        version: '1.0.0'
      };
      
      tree.write('libs/test-project/package.json', JSON.stringify(packageJsonContent));

      // Act
      const result = PackageJsonUtils.getPackageJsonNameProperty(tree, mockProjectConfig);

      // Assert
      expect(result).toBe('@test/package-with_special.chars');
    });

    it('should return undefined when package.json is invalid JSON', () => {
      // Arrange
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      tree.write('libs/test-project/package.json', '{ invalid json }');

      // Act
      const result = PackageJsonUtils.getPackageJsonNameProperty(tree, mockProjectConfig);

      // Assert
      expect(result).toBeUndefined();
      
      // Cleanup
      consoleSpy.mockRestore();
    });

    it('should work with different project configurations', () => {
      // Arrange
      const appsProjectConfig = {
        root: 'apps/my-app',
        name: 'my-app'
      };
      const packageJsonContent = {
        name: '@apps/my-application',
        version: '1.0.0'
      };
      
      tree.write('apps/my-app/package.json', JSON.stringify(packageJsonContent));

      // Act
      const result = PackageJsonUtils.getPackageJsonNameProperty(tree, appsProjectConfig);

      // Assert
      expect(result).toBe('@apps/my-application');
    });
  });

  describe('edge cases and integration scenarios', () => {
    it('should handle multiple calls to the same project correctly', () => {
      // Arrange
      const packageJsonContent = {
        name: '@test/cached-package',
        version: '1.0.0'
      };
      
      tree.write('libs/test-project/package.json', JSON.stringify(packageJsonContent));

      // Act
      const result1 = PackageJsonUtils.getPackageJsonNameProperty(tree, mockProjectConfig);
      const result2 = PackageJsonUtils.getPackageJsonNameProperty(tree, mockProjectConfig);
      const fullResult1 = PackageJsonUtils.getPackageJson(tree, mockProjectConfig);
      const fullResult2 = PackageJsonUtils.getPackageJson(tree, mockProjectConfig);

      // Assert
      expect(result1).toBe('@test/cached-package');
      expect(result2).toBe('@test/cached-package');
      expect(fullResult1).toEqual(packageJsonContent);
      expect(fullResult2).toEqual(packageJsonContent);
    });

    it('should handle concurrent access to different projects', () => {
      // Arrange
      const project1Config = { root: 'libs/project1', name: 'project1' };
      const project2Config = { root: 'libs/project2', name: 'project2' };
      
      const package1Content = { name: '@test/project1', version: '1.0.0' };
      const package2Content = { name: '@test/project2', version: '2.0.0' };
      
      tree.write('libs/project1/package.json', JSON.stringify(package1Content));
      tree.write('libs/project2/package.json', JSON.stringify(package2Content));

      // Act
      const name1 = PackageJsonUtils.getPackageJsonNameProperty(tree, project1Config);
      const name2 = PackageJsonUtils.getPackageJsonNameProperty(tree, project2Config);
      const full1 = PackageJsonUtils.getPackageJson(tree, project1Config);
      const full2 = PackageJsonUtils.getPackageJson(tree, project2Config);

      // Assert
      expect(name1).toBe('@test/project1');
      expect(name2).toBe('@test/project2');
      expect(full1.version).toBe('1.0.0');
      expect(full2.version).toBe('2.0.0');
    });

    it('should handle Windows and Unix path separators correctly', () => {
      // Arrange
      const windowsStyleConfig = {
        root: 'libs\\windows\\style\\path',
        name: 'windows-project'
      };
      const packageJsonContent = {
        name: '@test/windows-package',
        version: '1.0.0'
      };
      
      // The tree normalizes paths, so we write with forward slashes
      tree.write('libs/windows/style/path/package.json', JSON.stringify(packageJsonContent));

      // Act
      const result = PackageJsonUtils.getPackageJsonNameProperty(tree, windowsStyleConfig);

      // Assert
      expect(result).toBe('@test/windows-package');
    });
  });
});
