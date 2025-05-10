/**
 * Generates a command.txt file for local publishing of a package.
 * 
 * @param {Object} options - The options for generating the command text file
 * @param {string} options.buildHelpersDir - The directory path containing build helper scripts
 * @param {string} options.packageName - The name of the package to be published locally
 * @param {string} options.local_Bat_Filename - The filename of the batch file used for local publishing
 * @returns {Object} An object containing the name and content for the command text file
 * @returns {string} returns.name - The generated filename for the command text file
 * @returns {string} returns.content - The content (path to the batch file) for the command text file
 */
const utils = require('../utils/build-helper-utils.js');
const path = require('path');



module.exports = function localPublish_CommandTxt_Generator({ buildHelpersDir, packageName, local_Bat_Filename }) {
  
  const packageShortNameUnderscore = utils.toShortUnderscoredPackageName(packageName);
  const name = `local_publish_${packageShortNameUnderscore}_command.txt`


  const content = path.join(buildHelpersDir, local_Bat_Filename);

  return { name, content };

}
