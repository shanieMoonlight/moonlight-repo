const utils = require('../utils/build-helper-utils.js');
const path = require('path');



module.exports = function localPublish_CommandTxt_Generator({ buildHelpersDir, packageName, local_Bat_Filename }) {
  
  const packageShortNameUnderscore = utils.toShortUnderscoredPackageName(packageName);
  const name = `local_publish_${packageShortNameUnderscore}_command.txt`


  const content = path.join(buildHelpersDir, local_Bat_Filename);

  return { name, content };

}
