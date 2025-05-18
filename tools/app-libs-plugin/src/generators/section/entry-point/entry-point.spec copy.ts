import { Tree } from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { NoramlizedSectionGeneratorSchema } from '../../@shared/schema/schema';
import { ParentLibUtils } from '../../@shared/utils/parent-lib-utils';
import { GeneratorUtils } from '../../@shared/utils/generator-utils';
import * as entryPointModule from './entry-point';
import { addToRoutesArray, getLibrarySettings, updateParentEntryPointRoutes } from './entry-point';

// Import the functions to test - you'll need to export them in entry-point.ts
// For example: export { getLibrarySettings, addToRoutesArray } for testing

describe('Entry Point Generator Utilities', () => {
  let tree: Tree;

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace();

    // Mock readProjectConfiguration to return consistent test data
    jest.spyOn(require('@nx/devkit'), 'readProjectConfiguration').mockReturnValue({
      root: 'libs/test-app/sections/test',
      sourceRoot: 'libs/test-app/sections/test/src',
      projectType: 'library'
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getLibrarySettings', () => {
    it('should return correct library settings based on options', () => {
      // Arrange
      const options: NoramlizedSectionGeneratorSchema = {
        sectionRoot: 'libs/test-app/sections/test',
        importPrefix: '@test-app/sections-test',
        libraryNamePrefix: 'test-app-test',
        className: 'Blog',
        classNamePrefix: 'Test',
        propertyName: 'blog',
        constantName: 'BLOG',
        fileName: 'blog',
        directory: 'blog',
        prefix: 'sb-test',
        sectionClassNamePrefix: 'TestBlog',
        name: 'blog',
        application: 'sb-test-app'
      };

      // Act
      const result = getLibrarySettings(options);

      // Assert
      expect(result).toEqual({
        directory: 'libs/test-app/sections/test/@entry-point',
        importPath: '@test-app/sections-test/entry-point',
        libraryName: 'test-app-test-entry-point'
      });
    });
  });

  describe('addToRoutesArray', () => {
    it('should add route element to routes array', () => {
      // Arrange
      const routesContent = `
import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  ...ExistingRoutes(),
  
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  }
];`;

      const testFilePath = '/test-routes.ts';
      tree.write(testFilePath, routesContent);

      // Act
      addToRoutesArray(tree, testFilePath, '...TestRoutes()');

      // Assert
      const updatedContent = tree.read(testFilePath, 'utf-8');
      expect(updatedContent).toContain('...TestRoutes()');
      expect(updatedContent).toContain('...ExistingRoutes()');
    });

    it('should return empty string if file does not exist', () => {
      // Act
      const result = addToRoutesArray(tree, '/non-existent.ts', '...TestRoutes()');

      // Assert
      expect(result).toBeFalsy();
    });
  });

  describe('updateParentEntryPointRoutes', () => {
    it('should update parent routes when parentEntryPoint is provided', () => {
      // Arrange
      const options: NoramlizedSectionGeneratorSchema = {
        sectionRoot: 'libs/test-app/sections/test',
        importPrefix: '@test-app/sections-test',
        libraryNamePrefix: 'test-app-test',
        className: 'Blog',
        classNamePrefix: 'Test',
        propertyName: 'blog',
        constantName: 'BLOG',
        fileName: 'blog',
        directory: 'blog',
        prefix: 'sb-test',
        sectionClassNamePrefix: 'TestBlog',
        name: 'blog',
        application: 'sb-test-app',
        parentEntryPoint: 'sb-test-app-entry-point'
      };

      // Mock findFilesByPattern to return a test file
      jest.spyOn(GeneratorUtils, 'findFilesByPattern').mockReturnValue(
        ['libs/test-app/src/lib/routes/app.routes.ts']
      );

      // Create test file
      const routesContent = `
import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  ...ExistingRoutes(),
  
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  }
];`;

      tree.write('libs/test-app/src/lib/routes/app.routes.ts', routesContent);

      // Mock addImportToClass
      jest.spyOn(ParentLibUtils, 'addImportToClass').mockReturnValue(routesContent);

      // Mock addToRoutesArray
      const addToRoutesArraySpy = jest.spyOn(entryPointModule, 'addToRoutesArray');

      // Act
      updateParentEntryPointRoutes(tree, options);

      // Assert
      expect(ParentLibUtils.addImportToClass).toHaveBeenCalled();
      expect(addToRoutesArraySpy).toHaveBeenCalledWith(
        tree,
        'libs/test-app/src/lib/routes/app.routes.ts',
        '...TestBlogRoutes(),'
      );
    });

    it('should do nothing when parentEntryPoint is not provided', () => {
      // Arrange
      const options: NoramlizedSectionGeneratorSchema = {
        sectionRoot: 'libs/test-app/sections/test',
        importPrefix: '@test-app/sections-test',
        libraryNamePrefix: 'test-app-test',
        className: 'Blog',
        classNamePrefix: 'Test',
        propertyName: 'blog',
        constantName: 'BLOG',
        fileName: 'blog',
        directory: 'blog',
        prefix: 'sb-test',
        sectionClassNamePrefix: 'TestBlog',
        name: 'blog',
        application: 'sb-test-app'
      };

      // Mock dependencies
      const findFilesSpy = jest.spyOn(GeneratorUtils, 'findFilesByPattern');

      // Act
      updateParentEntryPointRoutes(tree, options);

      // Assert
      expect(findFilesSpy).not.toHaveBeenCalled();
    });
  });
});