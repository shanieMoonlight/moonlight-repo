module.exports = function localInstallCommandLocal({localNpmDir, packageName}) {
  return `npm install --registry file:///${localNpmDir.replace(/\\/g, "/")}/${packageName}`;
}
