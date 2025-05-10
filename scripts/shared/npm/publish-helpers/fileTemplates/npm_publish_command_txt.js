/**
 * Generates a command.txt file for npm publishing with specific naming conventions.
 * 
 * @param {Object} options - The options for generating the npm publish command.
 * @param {string} options.buildHelpersDir - The directory where build helpers are located.
 * @param {string} options.packageName - The name of the package to be published.
 * @param {string} options.npm_Bat_Filename - The filename of the npm batch file to be referenced.
 * @returns {Object} An object containing the generated filename and content.
 * @returns {string} returns.name - The generated filename for the command text file.
 * @returns {string} returns.content - The full path to the npm batch file.
 */
const utils = require('../utils/build-helper-utils.js');
const path = require('path');



module.exports = function npmPublish_CommandTxt_Generator({ buildHelpersDir, packageName, npm_Bat_Filename }) {
  
  const packageShortNameUnderscore = utils.toShortUnderscoredPackageName(packageName);
  const name = `npm_publish_${packageShortNameUnderscore}_command.txt`

  const content = path.join(buildHelpersDir, npm_Bat_Filename);

  return { name, content };

}
