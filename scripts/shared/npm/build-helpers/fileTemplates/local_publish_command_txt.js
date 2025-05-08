module.exports = function localPublishCommandTxt({packageShortNameUnderscore}) {
  return `powershell -ExecutionPolicy Bypass -File build-helpers/local_publish_${packageShortNameUnderscore}.ps1`;
}
