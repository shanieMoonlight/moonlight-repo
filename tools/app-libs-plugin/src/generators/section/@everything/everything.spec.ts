import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { Tree, readProjectConfiguration } from '@nx/devkit';

import { sectionEverythingGenerator } from './everything';
import { SectionGeneratorSchema } from '../../@shared/schema/schema';

describe('section generator', () => {
  let tree: Tree;
  const options: SectionGeneratorSchema = {
    name: 'test',
    application: '',
    classNamePrefix: ''
  };

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace();
  });

  it('should run successfully', async () => {
    await sectionEverythingGenerator(tree, options);
    const config = readProjectConfiguration(tree, 'test');
    expect(config).toBeDefined();
  });
});
