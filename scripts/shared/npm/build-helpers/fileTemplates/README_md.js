


/**
 * Generates a README.md file content for a package with build and publish help.
 * 
 * @param {Object} params - The parameters object.
 * @param {string} params.packageName - The name of the package.
 * @param {string} params.local_Ps1_Filename - The filename of the PowerShell script for local publishing.
 * @param {string} params.npm_Ps1_Filename - The filename of the PowerShell script for NPM publishing.
 * @param {string} params.localNpmDir - The directory path for local npm publishing.
 * @returns {Object} An object containing the name and content of the README file.
 * @returns {string} returns.name - The name of the file (README.md).
 * @returns {string} returns.content - The content of the README file.
 */
module.exports = function readmeMd_Generator({
    packageName,
    local_Ps1_Filename,
    npm_Ps1_Filename,
    localNpmDir }) {
    const name = `README.md`


    const content = `# Build & Publish Helpers for ${packageName}

This folder contains scripts to build, locally publish, and publish to NPM.

## Scripts

- **${local_Ps1_Filename}**: Build and publish to local npm dir (${localNpmDir})
- **${npm_Ps1_Filename}**: Build and publish to NPM registry

## Usage

\`\`\`sh
# Local publish (PowerShell)
powershell -ExecutionPolicy Bypass -File build-helpers/${local_Ps1_Filename}

# NPM publish (PowerShell)
powershell -ExecutionPolicy Bypass -File build-helpers/${npm_Ps1_Filename}
\`\`\`

## Local Install

\`\`\`sh
npm install --registry file:///${localNpmDir.replace(/\\/g, "/")}/${packageName}
\`\`\`
`

    return { name, content };

}
