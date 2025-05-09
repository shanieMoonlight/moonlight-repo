
function toShortPackageName(packageName) {
  return packageName.split('/').pop();
}

//--------------------------//

function toShortUnderscoredPackageName(packageName) {
  return toShortPackageName(packageName).replace(/-/g, '_');
}

//==========================//

module.exports = {
  toShortPackageName,
  toShortUnderscoredPackageName
};

//==========================//
