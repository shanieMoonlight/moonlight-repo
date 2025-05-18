import { Tree } from '@nx/devkit';
import { SectionGeneratorSchema } from '../../@shared/schema/schema';
import sectionConfigGenerator from '../config/config';
import sectionEntryPointGenerator from '../entry-point/entry-point';
import sectionFeatureHomeGenerator from '../features/home/feature-home';
import sectionRouteDefsGenerator from '../route-defs/route-defs';
import sectionUiNavGenerator from '../ui/nav/ui-nav';


//##############################################//


export async function sectionEverythingGenerator(tree: Tree, options: SectionGeneratorSchema) {

  await sectionRouteDefsGenerator(tree, options);
  await sectionConfigGenerator(tree, options);
  await sectionFeatureHomeGenerator(tree, options);
  await sectionUiNavGenerator(tree, options);
  await sectionEntryPointGenerator(tree, options);

}


//##############################################//

export default sectionEverythingGenerator;

//##############################################//

//npx nx generate @spider-baby-repo/app-libs-plugin:section-everything --name=admin --application=spider-baby-hub --classNamePrefix=hub --importPrefix=sb-hub --parentEntryPoint=sb-hub-app-entry-point --no-interactive --dry-run 


// npx nx generate @nx/workspace:remove --projectName=sb-hub-admin-entry-point --no-interactive 
// npx nx generate @nx/workspace:remove --projectName=sb-hub-admin-route-defs --no-interactive 
// npx nx generate @nx/workspace:remove --projectName=sb-hub-admin-features-home --no-interactive 
// npx nx generate @nx/workspace:remove --projectName=sb-hub-admin-ui-nav --no-interactive 
// npx nx generate @nx/workspace:remove --projectName=sb-hub-admin-config --no-interactive 