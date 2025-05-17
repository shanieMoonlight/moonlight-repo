import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { Tree, readProjectConfiguration } from '@nx/devkit';
import { SectionGeneratorSchema } from '../../../@shared/schema/schema';
import { sectionFeatureHomeGenerator } from './feature-home';


describe('section generator', () => {
  let tree: Tree;
  const options: SectionGeneratorSchema = {
    name: 'test',
    application: 'sb-tester',
    classNamePrefix: 'test'
  };

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace();
  });

  it('should run successfully', async () => {
    await sectionFeatureHomeGenerator(tree, options);
    const config = readProjectConfiguration(tree, 'test');
    expect(config).toBeDefined();
  });
});
