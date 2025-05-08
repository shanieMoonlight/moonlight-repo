module.exports = function readmeMd({ packageName, packageShortNameUnderscore, localNpmDir }) {
    return`# Build & Publish Helpers for ${packageName}

This folder contains scripts to build, locally publish, and publish to NPM.

## Scripts

- **local_publish_${packageShortNameUnderscore}.ps1**: Build and publish to local npm dir (${localNpmDir})
- **npm_publish_${packageShortNameUnderscore}.ps1**: Build and publish to NPM registry

## Usage

\`\`\`sh
# Local publish (PowerShell)
powershell -ExecutionPolicy Bypass -File build-helpers/local_publish_${packageShortNameUnderscore}.ps1

# NPM publish (PowerShell)
powershell -ExecutionPolicy Bypass -File build-helpers/npm_publish_${packageShortNameUnderscore}.ps1
\`\`\`

## Local Install

\`\`\`sh
npm install --registry file:///${localNpmDir.replace(/\\/g, "/")}/${packageName}
\`\`\`
`
}
