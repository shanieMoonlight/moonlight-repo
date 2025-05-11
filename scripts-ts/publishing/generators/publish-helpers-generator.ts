import path from "path";
import fs from "fs";
import { program } from 'commander';
import { findRepositoryRootPath } from "../../shared/utils/find-repository-root";
import { extractLibraryData } from "../../shared/library-data/extract_data_from_library";

//####################################################//
//DEFAULTS

const defaultLocalNpmDir = "C:/Users/Shaneyboy/my-npm";
const defaultSharedScriptsRelativePath = 'scripts-ps1/shared/npm'
const defaultPublishingScriptsDir = 'scripts-ts/publishing'

//####################################################//
//CONFIGURABLE VARIABLES

program
    .requiredOption('-l, --libraryRootRelative <path>', 'Relative path to the library root')
    .option('-n, --localNpmDir <dir>', 'Local npm directory', defaultLocalNpmDir)
    .option('-s, --sharedScriptsRelativePath <path>', 'Relative path to shared scripts', defaultSharedScriptsRelativePath)

program.parse(process.argv);

const options = program.opts();

const libraryRootRelative = options.libraryRootRelative;
const localNpmDir = options.localNpmDir;
const sharedScriptsRelativePath = options.sharedScriptsRelativePath;
const localNpmPublisherScriptRelativePath = path.join(sharedScriptsRelativePath, 'local-npm-publish-package.ps1');
const npmPublisherScriptRelativePath = path.join(sharedScriptsRelativePath, 'npm-publish-package.ps1');


//= = = = = = = = = = = = = = = = = = = = = = = = = = //
//EXTRACT DATA FROM LIBRARY

const libraryData = extractLibraryData(libraryRootRelative);
const packageName = libraryData.packageName;
const packageDistRelativePath = libraryData.packageDistPathRelative;
const pkgVersion = libraryData.pkgVersion
const nxBuildTarget = libraryData.nxBuildTarget;

console.log(`Extracted data from ${libraryRootRelative}:`);
console.log(`  libraryData`, libraryData);


//= = = = = = = = = = = = = = = = = = = = = = = = = = //
//VALIDATE EXTRACTED DATA

const requiredFields = [
    { field: 'packageName', value: packageName },
    { field: 'packageDistPath', value: packageDistRelativePath },
    { field: 'pkgVersion', value: pkgVersion },
    { field: 'nxBuildTarget', value: nxBuildTarget }
];

for (const { field, value } of requiredFields) {
    if (!value)
        throw new Error(`Missing required field: ${field} from library ${libraryRootRelative}`);
}


//= = = = = = = = = = = = = = = = = = = = = = = = = = //
//PATHS

const repoRoot = findRepositoryRootPath()
if (!repoRoot)
    throw new Error('Could not find repository root. No tsconfig.base.json file found in parent directories.');

const publishingScriptsDirAbsolute = path.join(repoRoot, defaultPublishingScriptsDir);
const libraryPublishersDirAbsolute = path.join(publishingScriptsDirAbsolute, libraryRootRelative);
// const buildHelpersDir = path.join(libraryRootAbsolute,); //@ to place the folder in the top of the library
console.log('buildHelpersDir:', libraryPublishersDirAbsolute);


//= = = = = = = = = = = = = = = = = = = = = = = = = = //
//FILE CONTENTS

const files = [
    //   findRepoFileNameAndContent,  
    //   errorReporting_Ps1_FileNameAndContent,

    //   localPublish_Ps1_FileNameAndContent,
    //   localPublish_Bat_FileNameAndContent,
    //   localPublish_CommandTxt_FileNameAndContent,
    //   localInstall_CommandTxt_FileNameAndContent,

    //   npmPublish_Ps1_FileNameAndContent,
    //   npmPublish_Bat_FileNameAndContent,
    //   npmPublish_CommandTxt_FileNameAndContent,

    //   readmeMd_FileNameAndContent
];


//####################################################//
//CREATE FOLDER AND FILES

try {

    if (!fs.existsSync(libraryPublishersDirAbsolute)) {
        console.log(`Creating build helpers directory: ${libraryPublishersDirAbsolute}`);
        fs.mkdirSync(libraryPublishersDirAbsolute, { recursive: true });
        console.log(`Successfully created directory: ${libraryPublishersDirAbsolute}`);
    } else {
        console.log(`Directory already exists: ${libraryPublishersDirAbsolute}`);
    }

} catch (error) {
    if (error instanceof Error) console.error(error.message)
    console.error(error)
    throw new Error(`Failed to create build helpers directory at ${libraryPublishersDirAbsolute}`);
}

//- - - - - - - - - - - - - - - - - - - - - - - - - - //

// files.forEach(file => {

//   if (!file || !file.name || !file.content)
//     throw new Error(`Invalid file data: ${JSON.stringify(file)}`);

//   const filePath = path.join(buildHelpersDir, file.name);
//   fs.writeFileSync(filePath, file.content, 'utf8');
//   console.log(`Created: ${filePath}`);

// });


//####################################################//