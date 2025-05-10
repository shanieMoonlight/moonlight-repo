import * as fs from 'fs';
import * as path from 'path';
import { CommandUtils } from '../utils/command-utils';
import { CommandResult } from '../utils/command-models';

export async function localNpmPublishPackage(
  packageName: string,
  packageDistPath: string,
  nxBuildTarget: string,
  localNpmDir: string = "C:\\Users\\Shaneyboy\\my-npm"
): Promise<void> {
  console.log('==================================================');
  console.log(`Publishing ${packageName} to Local NPM (Node.js/TS)`);
  console.log('==================================================');
  console.log(`Package Dist Path: ${packageDistPath}`);
  console.log(`Nx Build Target: ${nxBuildTarget}`);
  console.log(`Local NPM Directory: ${localNpmDir}`);
  console.log('==================================================\n');

  // Ensure the local npm directory exists
  if (!fs.existsSync(localNpmDir)) {
    console.log(`Creating local npm directory at ${localNpmDir}...`);
    fs.mkdirSync(localNpmDir, { recursive: true });
  }

  // --- Build Step ---
  console.log(`INFO: Building ${packageName} library for production...`);
  const buildResult = CommandUtils.run(`npx nx run ${nxBuildTarget}`);
  if (buildResult.status !== 0) {
    throw new Error(`Build failed for ${packageName}.\n${buildResult.stderr}`);
  }
  console.log('INFO: Build successful.\n');

  // --- Packaging and Moving ---
  if (!fs.existsSync(packageDistPath) || !fs.lstatSync(packageDistPath).isDirectory()) {
    throw new Error(`Distribution directory '${packageDistPath}' does not exist or is not accessible.`);
  }

  console.log(`INFO: Navigating to ${packageDistPath}`);
  // Save current working directory to restore later
  const originalCwd = process.cwd();
  process.chdir(packageDistPath);

  try {
    console.log(`INFO: Packing ${packageName}...`);
    const npmPackResult = CommandUtils.run('npm pack --verbose');
    console.log(`DEBUG: npm pack output: ${npmPackResult.stdout}`);

    if (npmPackResult.status !== 0) {
      throw new Error(`npm pack failed with exit code ${npmPackResult.status}\n${npmPackResult.stderr}`);
    }

    // Find .tgz files in the dist directory
    const tgzFiles = fs.readdirSync('.').filter(f => f.endsWith('.tgz'));
    if (!tgzFiles.length) {
      throw new Error('npm pack did not create any .tgz files.');
    }
    console.log(`INFO: Found .tgz files: ${tgzFiles.join(', ')}`);

    // Move all .tgz files to the local npm directory
    for (const tgzFile of tgzFiles) {
      const src = path.resolve(tgzFile);
      const dest = path.join(localNpmDir, path.basename(tgzFile));
      fs.renameSync(src, dest);
    }

    // Find the latest tarball for this package
    const packageNameClean = packageName.replace('@', '').replace('/', '-');
    const tarballs = fs.readdirSync(localNpmDir)
      .filter(f => f.startsWith(packageNameClean) && f.endsWith('.tgz'))
      .map(f => ({
        name: f,
        time: fs.statSync(path.join(localNpmDir, f)).mtime.getTime(),
        fullPath: path.join(localNpmDir, f)
      }))
      .sort((a, b) => b.time - a.time);

    const tarballPath = tarballs.length ? tarballs[0].fullPath : null;
    if (!tarballPath) {
      throw new Error(`Could not find the moved tarball in ${localNpmDir}`);
    }

    console.log(`INFO: Successfully packed ${packageName} to ${tarballPath}\n`);
    console.log('To install this package in a project, run:');
    console.log(`npm install ${tarballPath}\n`);
  } finally {
    // Restore original working directory
    process.chdir(originalCwd);
  }

  console.log('INFO: Local publish script finished.');
}