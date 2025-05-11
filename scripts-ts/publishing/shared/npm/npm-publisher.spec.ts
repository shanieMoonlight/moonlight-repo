import * as path from 'path';
import prompts from 'prompts';
import chalk from 'chalk';
import { LibraryData, LibraryDependency } from '../../../shared/library-data/models';
import { CommandUtils } from '../../../shared/utils/cmd/command-utils';
import { BuildUtils } from '../utils/build-utils';
import { publishToNpmAsync } from './npm-publisher';

// Mock dependencies
jest.mock('prompts');
jest.mock('chalk', () => ({
  cyan: jest.fn((msg) => msg),
  green: jest.fn((msg) => msg),
  yellow: jest.fn((msg) => msg),
  red: jest.fn((msg) => msg),
  blue: jest.fn((msg) => msg),
  gray: jest.fn((msg) => msg),
  blueBright: jest.fn((msg) => msg),
  bgGreen: {
    black: {
      bold: jest.fn((msg) => msg)
    }
  },
  bold: jest.fn((msg) => msg)
}));

jest.mock('../../../shared/utils/cmd/command-utils', () => ({
  CommandUtils: {
    run: jest.fn(),
    npmPublishPublic: jest.fn()
  }
}));

jest.mock('../utils/build-utils', () => ({
  BuildUtils: {
    buildLibraryForProduction: jest.fn()
  }
}));

describe('publishToNpmAsync', () => {
  const mockLibraryData: LibraryData = {
    packageName: 'test-package',
    pkgVersion: '1.0.0',
    nxBuildTarget: 'test-lib:build',
    packageDistPathRelative: 'dist/test-lib',
    packageDistPathAbsolute: '/path/to/dist/test-lib',
    libraryRootAbsolute: '/path/to/test-lib',
    repoRoot: '/path/to',
    dependencies: [
      { name: 'dependency-1', version: '^1.0.0', relativePath: 'libs/dependency-1' }
    ],
    peerDependencies: []
  };

  beforeEach(() => {
    // Clear all mock implementations
    jest.clearAllMocks();
    
    // Default mock implementation for successful build
    (BuildUtils.buildLibraryForProduction as jest.Mock).mockReturnValue({
      status: 0,
      stdout: 'build successful',
      stderr: ''
    });
    
    // Default mock for dependency check (dependency exists)
    (CommandUtils.run as jest.Mock).mockImplementation((cmd) => {
      if (cmd.includes('npm view "dependency-1@^1.0.0"')) {
        return { status: 0, stdout: '1.0.0', stderr: '' };
      }
      if (cmd.includes('npm view "test-package@1.0.0"')) {
        return { status: 1, stdout: '', stderr: 'Not found' };
      }
      return { status: 0, stdout: '', stderr: '' };
    });
    
    // Default mock for npm publish (success)
    (CommandUtils.npmPublishPublic as jest.Mock).mockReturnValue({
      status: 0,
      stdout: 'published successfully',
      stderr: ''
    });
    
    // Default prompt response (user confirms)
    (prompts as unknown as jest.Mock).mockResolvedValue({ value: true });
  });

  test('should successfully build and publish package', async () => {
    await publishToNpmAsync(mockLibraryData, true);
    
    // Verify build was called
    expect(BuildUtils.buildLibraryForProduction).toHaveBeenCalledWith(mockLibraryData.nxBuildTarget);
    
    // Verify dependencies were checked
    expect(CommandUtils.run).toHaveBeenCalledWith('npm view "dependency-1@^1.0.0" version --json');
    
    // Verify version check was performed
    expect(CommandUtils.run).toHaveBeenCalledWith('npm view "test-package@1.0.0" version --json');
    
    // Verify dry run was performed
    expect(CommandUtils.npmPublishPublic).toHaveBeenCalledWith(
      mockLibraryData.packageDistPathAbsolute,
      true
    );
    
    // Verify confirmation prompt
    expect(prompts).toHaveBeenCalled();
    
    // Verify actual publish
    expect(CommandUtils.npmPublishPublic).toHaveBeenCalledWith(
      mockLibraryData.packageDistPathAbsolute,
      false,
      true
    );
  });

  test('should skip prompt if confirmBeforePublish is false', async () => {
    await publishToNpmAsync(mockLibraryData, false);
    
    // Should not prompt
    expect(prompts).not.toHaveBeenCalled();
    
    // Should publish
    expect(CommandUtils.npmPublishPublic).toHaveBeenCalledWith(
      mockLibraryData.packageDistPathAbsolute,
      false,
      true
    );
  });

  test('should skip publishing if the package version is already published', async () => {
    // Mock version already exists
    (CommandUtils.run as jest.Mock).mockImplementation((cmd) => {
      if (cmd.includes('npm view "test-package@1.0.0"')) {
        return { status: 0, stdout: '1.0.0', stderr: '' };
      }
      return { status: 0, stdout: '', stderr: '' };
    });
    
    await publishToNpmAsync(mockLibraryData, true);
    
    // Should check if version exists
    expect(CommandUtils.run).toHaveBeenCalledWith('npm view "test-package@1.0.0" version --json');
    
    // Should not proceed with dry run or publish
    expect(CommandUtils.npmPublishPublic).not.toHaveBeenCalled();
  });

  test('should throw an error if build fails', async () => {
    // Mock build failure
    (BuildUtils.buildLibraryForProduction as jest.Mock).mockReturnValue({
      status: 1,
      stdout: '',
      stderr: 'Build error'
    });
    
    await expect(publishToNpmAsync(mockLibraryData, true)).rejects.toThrow(
      'Build failed for test-package'
    );
    
    // Should not proceed to check dependencies
    expect(CommandUtils.run).not.toHaveBeenCalled();
  });

  test('should throw an error if dependency check fails', async () => {
    // Mock dependency not found
    (CommandUtils.run as jest.Mock).mockImplementation((cmd) => {
      if (cmd.includes('npm view "dependency-1@^1.0.0"')) {
        return { status: 1, stdout: '', stderr: 'Not found' };
      }
      return { status: 0, stdout: '', stderr: '' };
    });
    
    await expect(publishToNpmAsync(mockLibraryData, true)).rejects.toThrow(
      'Dependency check failed'
    );
    
    // Should not proceed to version check or publishing
    expect(CommandUtils.npmPublishPublic).not.toHaveBeenCalled();
  });

  test('should throw an error if dry run fails', async () => {
    // Mock dry run failure
    (CommandUtils.npmPublishPublic as jest.Mock).mockImplementation((_, isDryRun) => {
      if (isDryRun) {
        return { status: 1, stdout: '', stderr: 'Dry run failed' };
      }
      return { status: 0, stdout: 'published successfully', stderr: '' };
    });
    
    await expect(publishToNpmAsync(mockLibraryData, true)).rejects.toThrow(
      'npm publish dry run failed'
    );
    
    // Should not proceed to actual publish
    expect(CommandUtils.npmPublishPublic).toHaveBeenCalledTimes(1);
    expect(CommandUtils.npmPublishPublic).not.toHaveBeenCalledWith(
      mockLibraryData.packageDistPathAbsolute,
      false,
      true
    );
  });

  test('should cancel publishing if user rejects prompt', async () => {
    // Mock user cancellation
    (prompts as unknown as jest.Mock).mockResolvedValue({ value: false });
    
    await publishToNpmAsync(mockLibraryData, true);
    
    // Should prompt but not publish
    expect(prompts).toHaveBeenCalled();
    expect(CommandUtils.npmPublishPublic).toHaveBeenCalledTimes(1); // Only dry run
    expect(CommandUtils.npmPublishPublic).not.toHaveBeenCalledWith(
      mockLibraryData.packageDistPathAbsolute,
      false,
      true
    );
  });

  test('should throw an error if actual publish fails', async () => {
    // Mock actual publish failure
    (CommandUtils.npmPublishPublic as jest.Mock).mockImplementation((_, isDryRun) => {
      if (!isDryRun) {
        return { status: 1, stdout: '', stderr: 'Publish failed' };
      }
      return { status: 0, stdout: 'dry run successful', stderr: '' };
    });
    
    await expect(publishToNpmAsync(mockLibraryData, true)).rejects.toThrow(
      'npm publish failed'
    );
  });

  test('should handle package with no dependencies correctly', async () => {
    const dataWithNoDeps = {
      ...mockLibraryData,
      dependencies: []
    };
    
    await publishToNpmAsync(dataWithNoDeps, true);
    
    // Should still check version and publish
    expect(CommandUtils.run).toHaveBeenCalledWith('npm view "test-package@1.0.0" version --json');
    expect(CommandUtils.npmPublishPublic).toHaveBeenCalledTimes(2);
  });
});