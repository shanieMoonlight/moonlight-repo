# Build & Publish Helpers for @spider-baby/material-theming

This folder contains scripts to build, locally publish, and publish to NPM.

## Scripts

- **local_publish_material_theming.ps1**: Build and publish to local npm dir (C:/Users/Shaneyboy/my-npm)
- **npm_publish_material_theming.ps1**: Build and publish to NPM registry

## Usage

```sh
# Local publish (PowerShell)
powershell -ExecutionPolicy Bypass -File build-helpers/local_publish_material_theming.ps1

# NPM publish (PowerShell)
powershell -ExecutionPolicy Bypass -File build-helpers/npm_publish_material_theming.ps1
```

## Local Install

```sh
npm install --registry file:///C:/Users/Shaneyboy/my-npm/@spider-baby/material-theming
```
