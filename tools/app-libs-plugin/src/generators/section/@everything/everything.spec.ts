import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { Tree } from '@nx/devkit';
import { SectionGeneratorSchema } from '../../@shared/schema/schema';

// Import the main generator to be tested
import { sectionEverythingGenerator } from './everything';

// Mock the imported generator functions.
// These mocks must be at the top level of your test file, before any describe/it blocks.
jest.mock('../config/config', () => jest.fn().mockResolvedValue(undefined));
jest.mock('../entry-point/entry-point', () => jest.fn().mockResolvedValue(undefined));
jest.mock('../features/home/feature-home', () => jest.fn().mockResolvedValue(undefined));
jest.mock('../route-defs/route-defs', () => jest.fn().mockResolvedValue(undefined));
jest.mock('../ui/nav/ui-nav', () => jest.fn().mockResolvedValue(undefined));

// Now, when you import these, you'll get the mocked versions.
import sectionConfigGenerator from '../config/config';
import sectionEntryPointGenerator from '../entry-point/entry-point';
import sectionFeatureHomeGenerator from '../features/home/feature-home';
import sectionRouteDefsGenerator from '../route-defs/route-defs';
import sectionUiNavGenerator from '../ui/nav/ui-nav';

describe('sectionEverythingGenerator', () => {
  let tree: Tree;

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace();

    // Clear the call history of mocks before each test
    // Type assertion (as jest.Mock) is used to access Jest mock-specific methods
    (sectionConfigGenerator as jest.Mock).mockClear();
    (sectionEntryPointGenerator as jest.Mock).mockClear();
    (sectionFeatureHomeGenerator as jest.Mock).mockClear();
    (sectionRouteDefsGenerator as jest.Mock).mockClear();
    (sectionUiNavGenerator as jest.Mock).mockClear();
  });

  it('should call all the individual generators', async () => {
    const options: SectionGeneratorSchema = {
      name: 'test',
      application: 'sb-test-app', // Make sure this matches a project if readProjectConfiguration is used internally
      classNamePrefix: 'Test',
      // Add any other properties required by SectionGeneratorSchema or used by the generators
      // For example:
      // parentEntryPoint: 'sb-test-app-entry-point', // if applicable
      // sectionRoot: 'libs/sb-test-app/sections/test', // if applicable
      importPrefix: '@sb-test-app/sections-test', // if applicable
      // libraryNamePrefix: 'sb-test-app-test', // if applicable
      // className: 'Test', // if applicable
      // propertyName: 'test', // if applicable
      // constantName: 'TEST', // if applicable
      // fileName: 'test', // if applicable
      directory: 'test', // if applicable
      // prefix: 'sb', // if applicable
      // sectionClassNamePrefix: 'Test' // if applicable
    };

    // Act
    await sectionEverythingGenerator(tree, options);

    // Assert
    expect(sectionRouteDefsGenerator).toHaveBeenCalledWith(tree, options);
    expect(sectionConfigGenerator).toHaveBeenCalledWith(tree, options);
    expect(sectionFeatureHomeGenerator).toHaveBeenCalledWith(tree, options);
    expect(sectionUiNavGenerator).toHaveBeenCalledWith(tree, options);
    expect(sectionEntryPointGenerator).toHaveBeenCalledWith(tree, options);
  });
});