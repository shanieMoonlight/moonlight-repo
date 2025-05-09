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
