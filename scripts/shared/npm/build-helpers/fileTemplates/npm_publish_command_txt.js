module.exports = function npmPublishCommandTxt({packageShortNameUnderscore}) {
  return `powershell -ExecutionPolicy Bypass -File build-helpers/npm_publish_${packageShortNameUnderscore}.ps1`;
}
