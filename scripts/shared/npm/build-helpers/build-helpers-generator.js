const fs = require('fs');
const path = require('path');
const { program } = require('commander');
const findRepoRootPs1Generator = require('./fileTemplates/find-repository-root.js');
const localPublish_Ps1_Generator = require('./fileTemplates/local_publish_ps1.js');
const localPublish_Bat_Generator = require('./fileTemplates/local_publish_bat.js');
const localPublish_CommandTxt_Generator = require('./fileTemplates/local_publish_command_txt.js');
const localInstall_CommandTxt_Generator = require('./fileTemplates/local_install_command_local.js');
const npmPublish_Bat_Generator = require('./fileTemplates/npm_publish_bat.js');
const npmPublish_Ps1_Generator = require('./fileTemplates/npm_publish_ps1.js');
const npmPublish_CommandTxt_Generator = require('./fileTemplates/npm_publish_command_txt.js');
const readmeMd_Generator = require('./fileTemplates/README_md.js');
const errorReporting_Ps1_Generator = require('./utils/error_reprorting_ps1.js');
const findRepositoryRootPath = require('./utils/find-repo-root.js');
const extractLibraryData = require('./utils/extract_data_from_library.js');

//= = = = = = = = = = = = = = = = = = = = = = = = = = //
//DEFAULTS

const defaultLocalNpmDir = "C:/Users/Shaneyboy/my-npm";
// const errorReportingScriptRelativePath = "error-reporting.ps1";
const defaultSharedScriptsRelativePath = 'scripts-ps1/shared/npm'



//= = = = = = = = = = = = = = = = = = = = = = = = = = //
//CONFIGURABLE VARIABLES

program
  .requiredOption('-l, --libraryRootRelative <path>', 'Relative path to the library root')
  .option('-n, --localNpmDir <dir>', 'Local npm directory', defaultLocalNpmDir)
  .option('-s, --sharedScriptsRelativePath <path>', 'Relative path to shared scripts', defaultSharedScriptsRelativePath);

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
const packageDistRelativePath = libraryData.packageDistPath;
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
  if (!value) {
    throw new Error(`Missing required field: ${field} from library ${libraryRootRelative}`);
  }
}


//= = = = = = = = = = = = = = = = = = = = = = = = = = //
//PATHS

const repoRoot = findRepositoryRootPath()
const libraryRootAbsolute = path.join(repoRoot, libraryRootRelative);
const buildHelpersDir = path.join(libraryRootAbsolute, '@publish-helpers'); //@ to place the folder in the top of the library
console.log('buildHelpersDir:', buildHelpersDir);


//= = = = = = = = = = = = = = = = = = = = = = = = = = //
//FILE NAMES AND CONTENTS 

const findRepoFileNameAndContent = findRepoRootPs1Generator();
const findRepoScriptFilename = findRepoFileNameAndContent.name

const errorReporting_Ps1_FileNameAndContent = errorReporting_Ps1_Generator()
const errorReportingScriptFilename = errorReporting_Ps1_FileNameAndContent.name

//- - - - - - - - - - - - - - - - - - - - - - - - - - //

const localPublish_Ps1_FileNameAndContent = localPublish_Ps1_Generator({
  packageName,
  packageDistRelativePath,
  nxBuildTarget,
  localNpmDir,
  localNpmPublisherScriptRelativePath,
  findRepoScriptFilename,
  errorReportingScriptFilename
})
const local_Ps1_Filename = localPublish_Ps1_FileNameAndContent.name

const localPublish_Bat_FileNameAndContent = localPublish_Bat_Generator({
  packageName,
  ps1Filename: local_Ps1_Filename
})
const local_Bat_Filename = localPublish_Bat_FileNameAndContent.name

const localPublish_CommandTxt_FileNameAndContent = localPublish_CommandTxt_Generator({
  buildHelpersDir,
  packageName,
  local_Bat_Filename
})

const localInstall_CommandTxt_FileNameAndContent = localInstall_CommandTxt_Generator({
  localNpmDir,
  packageName,
  pkgVersion
})

//- - - - - - - - - - - - - - - - - - - - - - - - - - //

const npmPublish_Ps1_FileNameAndContent = npmPublish_Ps1_Generator({
  packageName,
  packageDistRelativePath,
  nxBuildTarget,
  npmPublisherScriptRelativePath,
  findRepoScriptFilename,
  errorReportingScriptFilename
})
const npm_Ps1_Filename = npmPublish_Ps1_FileNameAndContent.name

const npmPublish_Bat_FileNameAndContent = npmPublish_Bat_Generator({
  packageName,
  ps1Filename: npm_Ps1_Filename
})
const npm_Bat_Filename = npmPublish_Bat_FileNameAndContent.name

const npmPublish_CommandTxt_FileNameAndContent = npmPublish_CommandTxt_Generator({
  buildHelpersDir,
  packageName,
  npm_Bat_Filename
})

const readmeMd_FileNameAndContent = readmeMd_Generator({
  packageName,
  local_Ps1_Filename,
  npm_Ps1_Filename,
  localNpmDir
})


//= = = = = = = = = = = = = = = = = = = = = = = = = = //
//FILE CONTENTS

const files = [
  findRepoFileNameAndContent,  
  errorReporting_Ps1_FileNameAndContent,

  localPublish_Ps1_FileNameAndContent,
  localPublish_Bat_FileNameAndContent,
  localPublish_CommandTxt_FileNameAndContent,
  localInstall_CommandTxt_FileNameAndContent,

  npmPublish_Ps1_FileNameAndContent,
  npmPublish_Bat_FileNameAndContent,
  npmPublish_CommandTxt_FileNameAndContent,

  readmeMd_FileNameAndContent
];


//####################################################//
//CREATE FOLDER AND FILES

try {

  if (!fs.existsSync(buildHelpersDir)) {
    console.log(`Creating build helpers directory: ${buildHelpersDir}`);
    fs.mkdirSync(buildHelpersDir, { recursive: true });
    console.log(`Successfully created directory: ${buildHelpersDir}`);
  } else {
    console.log(`Directory already exists: ${buildHelpersDir}`);
  }

} catch (error) {
  console.error(`Failed to create build helpers directory at ${buildHelpersDir}: ${error.message}`);
  throw new Error(`Directory creation failed: ${error.message}`);
}

//- - - - - - - - - - - - - - - - - - - - - - - - - - //

files.forEach(file => {

  if (!file || !file.name || !file.content)
    throw new Error(`Invalid file data: ${JSON.stringify(file)}`);

  const filePath = path.join(buildHelpersDir, file.name);
  fs.writeFileSync(filePath, file.content, 'utf8');
  console.log(`Created: ${filePath}`);

});


//####################################################//