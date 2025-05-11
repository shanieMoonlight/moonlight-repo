import { CommandUtils } from './command-utils';
import { CommandResult } from "./command-models";




export class BuildUtils {

   static buildLibraryForProduction(nxBuildTarget: string): CommandResult {
        return CommandUtils.run(`npx nx run ${nxBuildTarget}`);
    }

    //----------------------------//


}//Cls