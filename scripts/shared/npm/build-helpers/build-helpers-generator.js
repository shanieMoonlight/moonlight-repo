const fs = require('fs');
const path = require('path');
const findRepoRootPs1Generator = require('./fileTemplates/find-repo-root.js');
const localPublish_Ps1_Generator = require('./fileTemplates/local_publish_ps1.js');
const localPublish_Bat_Generator = require('./fileTemplates/local_publish_bat.js');
const localPublish_CommandTxt_Generator = require('./fileTemplates/local_publish_command_txt.js');
const localInstall_CommandTxt_Generator = require('./fileTemplates/local_install_command_local.js');
const npmPublish_Bat_Generator = require('./fileTemplates/npm_publish_bat.js');
const npmPublish_Ps1_Generator = require('./fileTemplates/npm_publish_ps1.js');
const npmPublish_CommandTxt_Generator = require('./fileTemplates/npm_publish_command_txt.js');
const readmeMd_Generator = require('./fileTemplates/README_md.js');



// ---- CONFIGURABLE VARIABLES ----

const packageName = "@spider-baby/ssr-storage";
const packageDistPath = "./dist/libs/packages/@spider-baby/ssr/storage";
const nxBuildTarget = "spider-baby-ssr-local-storage:build:production";
const libraryRoot = "libs/packages/@spider-baby/ssr/storage/tester";
// const libraryRoot = "scripts/shared/npm/build-helpers/testing";
const localNpmDir = "C:/Users/Shaneyboy/my-npm";
const sharedScriptsRelativePath = 'scripts/shared/npm'
const repoRoot = 'C:/Users/Shaneyboy/VsCode/moonlight-repo'
const pkgVersion = '1.0.0'



// ---- PATHS ----

const buildHelpersDir = path.join(repoRoot, libraryRoot, 'build-helpers');



// ---- FILE NAMES AND CONTENTS ----

const findRepoFileNameAndContent = findRepoRootPs1Generator();
const localPublish_Ps1_FileNameAndContent = localPublish_Ps1_Generator({
  packageName,
  packageDistPath,
  nxBuildTarget,
  localNpmDir,
  sharedScriptsRelativePath
})
const local_Ps1_Filename = localPublish_Ps1_FileNameAndContent.name


const localPublish_Bat_FileNameAndContent = localPublish_Bat_Generator({
  packageName,
  ps1Filename: local_Ps1_Filename
})
const local_Bat_Filename = localPublish_Ps1_FileNameAndContent.name


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



const npmPublish_Ps1_FileNameAndContent = npmPublish_Ps1_Generator({
  packageName,
  packageDistPath,
  nxBuildTarget,
  sharedScriptsRelativePath
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


// ---- FILE CONTENTS ----

const files = [
  findRepoFileNameAndContent,

  localPublish_Ps1_FileNameAndContent,
  localPublish_Bat_FileNameAndContent,
  localPublish_CommandTxt_FileNameAndContent,
  localInstall_CommandTxt_FileNameAndContent,

  npmPublish_Ps1_FileNameAndContent,
  npmPublish_Bat_FileNameAndContent,
  npmPublish_CommandTxt_FileNameAndContent,

  readmeMd_FileNameAndContent
];

// ---- CREATE FOLDER AND FILES ----

console.log(`Creating build helpers directory: ${buildHelpersDir}`);
if (!fs.existsSync(buildHelpersDir)) {
  fs.mkdirSync(buildHelpersDir, { recursive: true });
}

files.forEach(file => {
  const filePath = path.join(buildHelpersDir, file.name);
  fs.writeFileSync(filePath, file.content, 'utf8');
  console.log(`Created: ${filePath}`);
});