import { Tree } from "@nx/devkit";
import path = require("path");

export class ProjectJsonUtils {

  static getProjectJson(tree: Tree, projectConfig: any) {

    // console.log(`projectConfig???`, projectConfig);

    if (!projectConfig || !projectConfig.root) {
      console.error(`Could not find project configuration`);
      return null;
    }

    const projectJsonPath = path.join(projectConfig.root, 'project.json');

    if (!tree.exists(projectJsonPath)) {
      console.warn(`project.json not found at ${projectJsonPath} for project`);
      return null;
    }



    try {
      const projectJsonBuffer = tree.read(projectJsonPath);
      if (!projectJsonBuffer) {
        console.warn(`Could not read project.json at ${projectJsonPath}`); // Should be caught by tree.exists, but good practice
        return null;
      }

      return JSON.parse(projectJsonBuffer.toString('utf-8'));
    } catch (e) {
      console.error(`Error locating project.json for :`, e);
      return null;
    }


  }


  //----------------------------//

  static getProjectJsonNameProperty(tree: Tree, projectConfig: any): string {
    return ProjectJsonUtils.getProjectJson(tree, projectConfig)?.name
  }

}//Cls