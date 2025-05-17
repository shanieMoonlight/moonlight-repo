import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { Tree, readProjectConfiguration } from '@nx/devkit';

import { generator } from './route-defs';
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
    await generator(tree, options);
    const config = readProjectConfiguration(tree, 'test');
    expect(config).toBeDefined();
  });
});
