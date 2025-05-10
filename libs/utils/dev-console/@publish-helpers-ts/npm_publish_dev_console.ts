import * as path from 'path';
import { findRepositoryRootPath } from './find-repository-root';
import { devLog } from '@spider-baby/utils-rxjs';

const packageName = "@spider-baby/dev-console";
const packageDistRelativePath = "dist/libs/utils/dev-console";
const nxBuildTarget = "sb-dev-console:build:production";
const localNpmDir = "C:/Users/Shaneyboy/my-npm";

async function main() {
    try {
        const repositoryRoot = findRepositoryRootPath(process.cwd());
        if (!repositoryRoot) {
            throw new Error("Could not find repository root (no tsconfig.base.json found).");
        }

        const packageDistPath = path.join(repositoryRoot, packageDistRelativePath);

        await localNpmPublishPackage(
            packageName,
            packageDistPath,
            nxBuildTarget,
            localNpmDir
        );

        console.log("PUBLISHED!!!!!!!!!!!!!!");
        process.exit(0);
    } catch (err) {
        console.error("😱 ERROR: An error occurred during the publish processing! 👻");
        console.error(err);
        process.exit(1);
    }
}

main();