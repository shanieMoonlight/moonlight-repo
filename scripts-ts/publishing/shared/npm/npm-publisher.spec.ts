import prompts from 'prompts';
import { LibraryData } from '../../../shared/library-data/models';
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

// Helper to reset and configure mocks for CommandUtils.run
const mockCommandUtilsRun = (implementations: Record<string, { status: number; stdout: string; stderr: string }>) => {
  (CommandUtils.run as jest.Mock).mockImplementation((cmd: string) => { // REMOVED async
    for (const key in implementations) {
      if (cmd.includes(key)) {
        return implementations[key];
      }
    }
    // Default for unhandled npm view calls, simulating "not found" to avoid unexpected passes
    if (cmd.includes('npm view')) {
      return { status: 1, stdout: '', stderr: 'Generic mock: Not found' };
    }
    return { status: 0, stdout: '', stderr: '' }; // Default for non-npm view commands
  });
};

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
    jest.useFakeTimers();

    // Default mock implementation for successful build
    (BuildUtils.buildLibraryForProduction as jest.Mock).mockReturnValue({
      status: 0,
      stdout: 'build successful',
      stderr: ''
    });

    // Default mock for CommandUtils.run - IMPORTANT FIX: Make dependency found by default
    mockCommandUtilsRun({
      '"dependency-1@^1.0.0" version --json': { status: 0, stdout: '1.0.0', stderr: '' },
      '"test-package@1.0.0" version --json': { status: 1, stdout: '', stderr: 'Not found' }
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

  afterEach(() => {
    jest.useRealTimers(); // Cleanup fake timers
  });

  test('should successfully build and publish package', async () => {
    const publishPromise = publishToNpmAsync(mockLibraryData, true);

    // Advance each timer individually for more precise control
    await jest.advanceTimersByTimeAsync(5000); // First retry delay
    await jest.advanceTimersByTimeAsync(5000); // Second retry delay
    await jest.advanceTimersByTimeAsync(5000); // Third retry delay

    await publishPromise;

    // Verify build was called
    expect(BuildUtils.buildLibraryForProduction).toHaveBeenCalledWith(mockLibraryData.nxBuildTarget);

    // Verify dependencies were checked (dependency-1 found on first try)
    const dep1Calls = (CommandUtils.run as jest.Mock).mock.calls.filter(
      c => c[0] === 'npm view "dependency-1@^1.0.0" version --json'
    );
    expect(dep1Calls.length).toBe(1);

    // Verify version check was performed for main package (retried)
    const mainPackageCalls = (CommandUtils.run as jest.Mock).mock.calls.filter(
      c => c[0] === 'npm view "test-package@1.0.0" version --json'
    );
    expect(mainPackageCalls.length).toBe(4); // 1 initial + 3 retries

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
  }, 60000); // Increased timeout to 60 seconds


  test('should skip prompt if confirmBeforePublish is false', async () => {
    const publishPromise = publishToNpmAsync(mockLibraryData, false);
    await jest.advanceTimersByTimeAsync(5000); // First retry delay
    await jest.advanceTimersByTimeAsync(5000); // Second retry delay
    await jest.advanceTimersByTimeAsync(5000); // Third retry delay

    await publishPromise;

    // Should not prompt
    expect(prompts).not.toHaveBeenCalled();

    // Should publish
    expect(CommandUtils.npmPublishPublic).toHaveBeenCalledWith(
      mockLibraryData.packageDistPathAbsolute,
      false,
      true
    );
    // Verify main package was checked and retried
    const mainPackageCalls = (CommandUtils.run as jest.Mock).mock.calls.filter(
      c => c[0] === 'npm view "test-package@1.0.0" version --json'
    );
    expect(mainPackageCalls.length).toBe(4);
  }, 30000);

  test('should skip publishing if the package version is already published', async () => {
    // Mock version already exists for the main package AND dependency
    // This ensures no retries are triggered for this specific test.
    mockCommandUtilsRun({
      '"dependency-1@^1.0.0" version --json': { status: 0, stdout: '1.0.0', stderr: '' }, // Dep found
      '"test-package@1.0.0" version --json': { status: 0, stdout: '1.0.0', stderr: '' }  // Main package found
    });

    await publishToNpmAsync(mockLibraryData, true); // No need for jest.runOnlyPendingTimersAsync here

    // Should check if version exists for main package (found on first try)
    const mainPackageCalls = (CommandUtils.run as jest.Mock).mock.calls.filter(
      c => c[0].includes('npm view "test-package@1.0.0" version --json')
    );
    expect(mainPackageCalls.length).toBe(1);

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
    // Mock dependency not found (will retry)
    mockCommandUtilsRun({
      '"dependency-1@^1.0.0" version --json': { status: 1, stdout: '', stderr: 'Not found' }, // Dependency not found
      // main package mock doesn't matter as it fails before that
    });

    const publishPromise = publishToNpmAsync(mockLibraryData, true);
    await jest.advanceTimersByTimeAsync(5000); // First retry delay
    await jest.advanceTimersByTimeAsync(5000); // Second retry delay
    await jest.advanceTimersByTimeAsync(5000); // Third retry delay

    await expect(publishPromise).rejects.toThrow(
      'Dependency check failed'
    );

    // Verify dependency was checked and retried
    const dep1Calls = (CommandUtils.run as jest.Mock).mock.calls.filter(
      c => c[0].includes('npm view "dependency-1@^1.0.0" version --json')
    );
    expect(dep1Calls.length).toBe(4); // 1 initial + 3 retries

    // Should not proceed to version check or publishing
    expect(CommandUtils.npmPublishPublic).not.toHaveBeenCalled();
  }, 45000);

  test('should throw an error if dry run fails', async () => {
    // Mock dry run failure
    (CommandUtils.npmPublishPublic as jest.Mock).mockImplementation((_, isDryRun) => {
      if (isDryRun) {
        return { status: 1, stdout: '', stderr: 'Dry run failed' };
      }
      return { status: 0, stdout: 'published successfully', stderr: '' };
    });

    const publishPromise = publishToNpmAsync(mockLibraryData, true);
    await jest.advanceTimersByTimeAsync(5000); // First retry delay
    await jest.advanceTimersByTimeAsync(5000); // Second retry delay
    await jest.advanceTimersByTimeAsync(5000); // Third retry delay

    await expect(publishPromise).rejects.toThrow(
      'npm publish dry run failed'
    );

    // Should not proceed to actual publish
    expect(CommandUtils.npmPublishPublic).toHaveBeenCalledTimes(1);
    expect(CommandUtils.npmPublishPublic).not.toHaveBeenCalledWith(
      mockLibraryData.packageDistPathAbsolute,
      false,
      true
    );
  }, 60000);

  test('should cancel publishing if user rejects prompt', async () => {
    // Mock user cancellation
    (prompts as unknown as jest.Mock).mockResolvedValue({ value: false });

    const publishPromise = publishToNpmAsync(mockLibraryData, true);
    await jest.advanceTimersByTimeAsync(5000); // First retry delay
    await jest.advanceTimersByTimeAsync(5000); // Second retry delay
    await jest.advanceTimersByTimeAsync(5000); // Third retry delay
    await publishPromise; // Should resolve, not reject, after cancellation

    // Should prompt but not publish
    expect(prompts).toHaveBeenCalled();
    expect(CommandUtils.npmPublishPublic).toHaveBeenCalledTimes(1); // Only dry run
    expect(CommandUtils.npmPublishPublic).not.toHaveBeenCalledWith(
      mockLibraryData.packageDistPathAbsolute,
      false,
      true
    );
  }, 60000);

  test('should throw an error if actual publish fails', async () => {
    // Mock actual publish failure
    (CommandUtils.npmPublishPublic as jest.Mock).mockImplementation((_, isDryRun) => {
      if (!isDryRun) {
        return { status: 1, stdout: '', stderr: 'Publish failed' };
      }
      return { status: 0, stdout: 'dry run successful', stderr: '' };
    });

    const publishPromise = publishToNpmAsync(mockLibraryData, true);
    // Advance each timer individually for more precise control
    await jest.advanceTimersByTimeAsync(5000); // First retry delay
    await jest.advanceTimersByTimeAsync(5000); // Second retry delay
    await jest.advanceTimersByTimeAsync(5000); // Third retry delay


    await expect(publishPromise).rejects.toThrow(
      'npm publish failed'
    );
  }, 60000); //

  test('should handle package with no dependencies correctly', async () => {

    const dataWithNoDeps = {
      ...mockLibraryData,
      dependencies: [] // No dependencies
    };

    // Default mock from beforeEach for "test-package@1.0.0" is "not found", so it will retry
    const publishPromise = publishToNpmAsync(dataWithNoDeps, true);

    // Advance each timer individually by using advanceTimersByTime instead of runOnlyPendingTimers
    await jest.advanceTimersByTimeAsync(5000); // First retry delay
    await jest.advanceTimersByTimeAsync(5000); // Second retry delay
    await jest.advanceTimersByTimeAsync(5000); // Third retry delay

    await publishPromise;

    // Should still check version and publish
    // Verify version check was performed for the main package and retried
    const mainPackageViewCalls = (CommandUtils.run as jest.Mock).mock.calls.filter(
      call => call[0].includes('npm view "test-package@1.0.0" version --json')
    );
    expect(mainPackageViewCalls.length).toBe(4); // 1 initial + 3 retries

    expect(CommandUtils.npmPublishPublic).toHaveBeenCalledTimes(2);
    expect(CommandUtils.npmPublishPublic).toHaveBeenCalledWith(
      dataWithNoDeps.packageDistPathAbsolute,
      true
    );
    expect(CommandUtils.npmPublishPublic).toHaveBeenCalledWith(
      dataWithNoDeps.packageDistPathAbsolute,
      false,
      true
    );
  }, 60000); // Increased timeout to 20 seconds
});