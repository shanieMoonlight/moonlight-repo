import { } from '@nx/angular';
import { Tree } from '@nx/devkit';
import { SectionGeneratorSchema } from '../../@shared/schema/schema';
import sectionConfigGenerator from '../config/config';
import sectionEntryPointGenerator from '../entry-point/entry-point';
import sectionFeatureHomeGenerator from '../features/home/feature-home';
import sectionRouteDefsGenerator from '../route-defs/route-defs';
import sectionUiNavGenerator from '../ui/nav/ui-nav';
import path = require('path');

//##############################################//

export async function sectionEverythingGenerator(tree: Tree, options: SectionGeneratorSchema) {

  await sectionRouteDefsGenerator(tree, options);
  await sectionConfigGenerator(tree, options);
  await sectionFeatureHomeGenerator(tree, options);
  await sectionUiNavGenerator(tree, options);
  await sectionEntryPointGenerator(tree, options);


  // await formatFiles(tree);
}

//##############################################//

export default sectionEverythingGenerator;

//##############################################//

// npx nx generate @nx/workspace:remove --projectName=sb-hub-blog-entry-point --no-interactive 
// npx nx generate @nx/workspace:remove --projectName=sb-hub-blog-route-defs --no-interactive 
// npx nx generate @nx/workspace:remove --projectName=sb-hub-blog-features-home --no-interactive 
// npx nx generate @nx/workspace:remove --projectName=sb-hub-blog-ui-nav --no-interactive 
// npx nx generate @nx/workspace:remove --projectName=sb-hub-blog-config --no-interactive 