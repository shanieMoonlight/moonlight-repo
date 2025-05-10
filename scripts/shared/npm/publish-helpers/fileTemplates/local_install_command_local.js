/**
 * Generates a text file containing an npm install command for a local package.
 * @param {Object} options - The options for generating the text file.
 * @param {string} options.localNpmDir - The directory where the local npm package is stored.
 * @param {string} options.packageName - The name of the package to install.
 * @param {string} [options.pkgVersion='1.0.0'] - The version of the package.
 * @returns {Object} An object containing the name and content of the generated text file.
 * @returns {string} returns.name - The name of the generated file.
 * @returns {string} returns.content - The content of the file (npm install command).
 */
const utils = require('../utils/build-helper-utils.js');
const path = require('path');



module.exports = function localInstall_CommandTxt_Generator({ localNpmDir, packageName, pkgVersion }) {

  pkgVersion ??= '1.0.0'
  const packageShortNameUnderscore = utils.toShortUnderscoredPackageName(packageName);
  const packageFilename = packageName
    .replace(/[/]/g, '-')
    .replace(/[@]/g, '');

  const tgzFile = path.join(localNpmDir, `${packageFilename}-${pkgVersion}.tgz`);

  const name = `local_install_${packageShortNameUnderscore}_command.txt`;
  const content = `npm install ${tgzFile}`;

  return { name, content };
}
