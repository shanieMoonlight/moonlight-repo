import { Tree } from "@nx/devkit";
import path = require("path");

export class PackageJsonUtils {

  static getPackageJson(tree: Tree, projectConfig: any) {

    // console.log(`projectConfig???`, projectConfig);

    if (!projectConfig || !projectConfig.root) {
      console.error(`Could not find project configuration`);
      return null;
    }

    const packageJsonPath = path.join(projectConfig.root, 'package.json');

    if (!tree.exists(packageJsonPath)) {
      console.warn(`package.json not found at ${packageJsonPath} for project`);
      return null;
    }



    try {
      const packageJsonBuffer = tree.read(packageJsonPath);
      if (!packageJsonBuffer) {
        console.warn(`Could not read package.json at ${packageJsonPath}`); // Should be caught by tree.exists, but good practice
        return null;
      }

      return JSON.parse(packageJsonBuffer.toString('utf-8'));
    } catch (e) {
      console.error(`Error locating package.json for :`, e);
      return null;
    }


  }




  //----------------------------//

  static getPackageJsonNameProperty(tree: Tree, projectConfig: any): string|null {
    return PackageJsonUtils.getPackageJson(tree, projectConfig)?.name
  }

}//Cls