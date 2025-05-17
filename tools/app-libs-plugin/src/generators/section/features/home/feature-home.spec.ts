import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { Tree, readProjectConfiguration } from '@nx/devkit';
import { SectionGeneratorSchema } from '../../../@shared/schema/schema';
import { generator } from './feature-home';


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
    await generator(tree, options);
    const config = readProjectConfiguration(tree, 'test');
    expect(config).toBeDefined();
  });
});
