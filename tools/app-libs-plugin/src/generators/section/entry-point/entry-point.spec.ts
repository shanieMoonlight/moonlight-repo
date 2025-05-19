import { Tree } from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { NoramlizedSectionGeneratorSchema } from '../../@shared/schema/schema';
import * as entryPointModule from './entry-point';
import { GeneratorUtils } from '../../@shared/utils/generator-utils';

describe('Entry Point Generator Utilities', () => {
  let tree: Tree;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
    tree = createTreeWithEmptyWorkspace();

    // Mock readProjectConfiguration to return a valid project configuration
    jest.spyOn(require('@nx/devkit'), 'readProjectConfiguration').mockImplementation((tree, projectName) => {
      if (projectName === 'sb-test-app-entry-point') {
        return {
          root: 'libs/test-app',
          sourceRoot: 'libs/test-app/src',
          projectType: 'library',
        };
      }
      throw new Error(`Cannot find configuration for '${projectName}'`);
    });
  });

  describe('updateParentEntryPointRoutes', () => {
    

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
      entryPointModule.updateParentEntryPointRoutes(tree, options);

      // Assert
      expect(findFilesSpy).not.toHaveBeenCalled();
    });

  });
});