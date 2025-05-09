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
