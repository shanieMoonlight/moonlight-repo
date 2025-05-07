# Publishing Scripts for @spider-baby/mini-state

This directory contains scripts for building, packaging, and publishing the mini-state library.

## Available Scripts

### NPM Publishing

- **npm_publish_mini_state.ps1** - PowerShell script to build and publish to NPM
- **npm_publish_mini_state.bat** - Batch launcher for the NPM publish script
- **npm_publish_mini_state_command.txt** - Quick reference for the NPM publish command

### Local Publishing

- **local_publish_mini_state.ps1** - PowerShell script to build and package locally
- **local_publish_mini_state.bat** - Batch launcher for the local publish script
- **local_publish_mini_state_command.txt** - Quick reference for the local publish command
- **local_install_command_local.txt** - Command to install the locally published package

## Usage

### Publishing to NPM

To publish a new version to NPM:

1. Update the version number in `package.json`
2. Add a new entry to `CHANGELOG.md`
3. Run either:
   - Double-click the `npm_publish_mini_state.bat` file
   - OR use PowerShell: `powershell -ExecutionPolicy Bypass -File ".\npm_publish_mini_state.ps1"`

### Publishing Locally (for testing)

To create a local package without publishing to NPM:

1. Run either:
   - Double-click the `local_publish_mini_state.bat` file
   - OR use PowerShell: `powershell -ExecutionPolicy Bypass -File ".\local_publish_mini_state.ps1"`

2. Install the local package in your test project:
   - Use the command in `local_install_command_local.txt`

## Script Dependencies

These scripts rely on shared utilities in the repository:

- `scripts/shared/npm/npm-publish-package.ps1` - Generic NPM publishing script
- `scripts/shared/npm/local-npm-publish-package.ps1` - Generic local publishing script
- `scripts/shared/npm/find-repository-root.ps1` - Repository root detection

## Version Compatibility

The current version (1.1.0) is compatible with Angular 18.0.0 and higher.