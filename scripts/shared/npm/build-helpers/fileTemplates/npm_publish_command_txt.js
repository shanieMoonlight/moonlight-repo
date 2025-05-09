const utils = require('../utils/build-helper-utils.js');
const path = require('path');



module.exports = function npmPublish_CommandTxt_Generator({ buildHelpersDir, packageName, npm_Bat_Filename }) {
  
  const packageShortNameUnderscore = utils.toShortUnderscoredPackageName(packageName);
  const name = `npm_publish_${packageShortNameUnderscore}_command.txt`

  const content = path.join(buildHelpersDir, npm_Bat_Filename);

  return { name, content };

}
