import { CommandResult } from "../../../shared/utils/cmd/command-models";
import { CommandUtils } from "../../../shared/utils/cmd/command-utils";




export class BuildUtils {

    static buildLibraryForProduction = (nxBuildTarget: string): CommandResult => 
        CommandUtils.run(`npx nx run ${nxBuildTarget}`)


}//Cls
