import * as path from 'path';
import { LibraryData } from '../../../shared/library-data/models';
import { CommandUtils } from '../../../shared/utils/cmd/command-utils';
import { FsUtils } from '../../../shared/utils/fs/fs-utils';
import { BuildUtils } from '../utils/build-utils';
import { localNpmPublishPackage } from './local-npm-publisher';

// Mock dependencies
jest.mock('../../../shared/utils/cmd/command-utils', () => ({
  CommandUtils: {
    run: jest.fn(),
    npmPack: jest.fn(),
  }
}));

jest.mock('../../../shared/utils/fs/fs-utils', () => ({
  FsUtils: {
    createDirIfNotExists: jest.fn(),
    dirExists: jest.fn(),
    getFilesInDirectoryByExtensionAsync: jest.fn(),
    moveFilesToDirectoryAsync: jest.fn(),
    getFilesInformationDirectoryAsync: jest.fn(),
  }
}));

jest.mock('../utils/build-utils', () => ({
  BuildUtils: {
    buildLibraryForProduction: jest.fn()
  }
}));

// Mock process.chdir
const originalChdir = process.chdir;
const mockChdir = jest.fn();
process.chdir = mockChdir;

// Mock process.cwd
const originalCwd = process.cwd;
const mockCwd = jest.fn();
process.cwd = mockCwd;

describe('localNpmPublishPackage', () => {
  const mockLibraryData: LibraryData = {
    packageName: '@test/my-package',
    pkgVersion: '1.0.0',
    nxBuildTarget: 'test-lib:build',
    packageDistPathRelative: 'dist/test-lib',
    packageDistPathAbsolute: '/path/to/dist/test-lib',
    libraryRootAbsolute: '/path/to/test-lib',
    repoRoot: '/path/to',
    dependencies: [],
    peerDependencies: []
  };

  const defaultLocalNpmDir = "C:/Users/Shaneyboy/my-npm";
  const customLocalNpmDir = "D:/custom-npm-dir";
  
  const tgzFileName = 'test-my-package-1.0.0.tgz';
  const tgzFilePath = path.join(mockLibraryData.packageDistPathAbsolute, tgzFileName);
  const finalTgzPath = path.join(defaultLocalNpmDir, tgzFileName);

  beforeEach(() => {
    // Clear all mock implementations
    jest.clearAllMocks();
    
    // Default mock implementation for successful build
    (BuildUtils.buildLibraryForProduction as jest.Mock).mockReturnValue({
      status: 0,
      stdout: 'build successful',
      stderr: ''
    });
    
    // Default mock for npm pack (success)
    (CommandUtils.npmPack as jest.Mock).mockReturnValue({
      status: 0,
      stdout: `${tgzFileName}`,
      stderr: ''
    });
    
    // Default mock for directory exists
    (FsUtils.dirExists as jest.Mock).mockReturnValue(true);
    
    // Default mock for finding .tgz files
    (FsUtils.getFilesInDirectoryByExtensionAsync as jest.Mock).mockResolvedValue([tgzFilePath]);
    
    // Default mock for moving files
    (FsUtils.moveFilesToDirectoryAsync as jest.Mock).mockResolvedValue(undefined);
    
    // Default mock for finding the tarball in the local npm directory
    (FsUtils.getFilesInformationDirectoryAsync as jest.Mock).mockResolvedValue([
      {
        name: tgzFileName,
        fullPath: finalTgzPath,
        isDirectory: false
      }
    ]);
    
    // Mock process.cwd and chdir
    mockCwd.mockReturnValue('/original/cwd');
    mockChdir.mockImplementation((dir) => {
      // Just track the call, don't actually change directories in tests
    });
  });

  afterAll(() => {
    // Restore original process functions
    process.chdir = originalChdir;
    process.cwd = originalCwd;
  });

  test('should successfully build, pack and publish package to default local npm directory', async () => {
    const result = await localNpmPublishPackage(mockLibraryData);
    
    // Verify directory checks/creation
    expect(FsUtils.createDirIfNotExists).toHaveBeenCalledWith(defaultLocalNpmDir);
    expect(FsUtils.dirExists).toHaveBeenCalledWith(mockLibraryData.packageDistPathAbsolute);
    
    // Verify build was called
    expect(BuildUtils.buildLibraryForProduction).toHaveBeenCalledWith(mockLibraryData.nxBuildTarget);
    
    // Verify we changed directory
    expect(mockChdir).toHaveBeenCalledWith(mockLibraryData.packageDistPathAbsolute);
    
    // Verify npm pack was called
    expect(CommandUtils.npmPack).toHaveBeenCalledWith(true);
    
    // Verify we found .tgz files
    expect(FsUtils.getFilesInDirectoryByExtensionAsync).toHaveBeenCalledWith(
      '.tgz', 
      mockLibraryData.packageDistPathAbsolute
    );
    
    // Verify we moved the files
    expect(FsUtils.moveFilesToDirectoryAsync).toHaveBeenCalledWith(
      [tgzFilePath], 
      defaultLocalNpmDir
    );
    
    // Verify we found the tarball in the npm directory
    expect(FsUtils.getFilesInformationDirectoryAsync).toHaveBeenCalledWith(
      defaultLocalNpmDir,
      expect.any(Function)
    );
    
    // Verify we returned to original directory
    expect(mockChdir).toHaveBeenCalledWith('/original/cwd');
    
    // Verify the function returned the expected tarball path
    expect(result).toBe(finalTgzPath);
  });

  test('should use custom local npm directory when provided', async () => {
    await localNpmPublishPackage(mockLibraryData, customLocalNpmDir);
    
    // Verify custom directory was used
    expect(FsUtils.createDirIfNotExists).toHaveBeenCalledWith(customLocalNpmDir);
    
    // Verify we moved the files to the custom directory
    expect(FsUtils.moveFilesToDirectoryAsync).toHaveBeenCalledWith(
      [tgzFilePath], 
      customLocalNpmDir
    );
    
    // Verify we searched for the tarball in the custom directory
    expect(FsUtils.getFilesInformationDirectoryAsync).toHaveBeenCalledWith(
      customLocalNpmDir,
      expect.any(Function)
    );
  });

  test('should throw an error if build fails', async () => {
    // Mock build failure
    (BuildUtils.buildLibraryForProduction as jest.Mock).mockReturnValue({
      status: 1,
      stdout: '',
      stderr: 'Build error'
    });
    
    await expect(localNpmPublishPackage(mockLibraryData)).rejects.toThrow(
      'Build failed for @test/my-package'
    );
    
    // Should not proceed to directory check
    expect(FsUtils.dirExists).not.toHaveBeenCalled();
    expect(CommandUtils.npmPack).not.toHaveBeenCalled();
  });

  test('should throw an error if distribution directory does not exist', async () => {
    // Mock dist directory not existing
    (FsUtils.dirExists as jest.Mock).mockReturnValue(false);
    
    await expect(localNpmPublishPackage(mockLibraryData)).rejects.toThrow(
      'Distribution directory'
    );
    
    // Should not proceed to npm pack
    expect(CommandUtils.npmPack).not.toHaveBeenCalled();
  });

  test('should throw an error if npm pack fails', async () => {
    // Mock npm pack failure
    (CommandUtils.npmPack as jest.Mock).mockReturnValue({
      status: 1,
      stdout: '',
      stderr: 'npm pack error'
    });
    
    await expect(localNpmPublishPackage(mockLibraryData)).rejects.toThrow(
      'npm pack failed'
    );
    
    // Should not proceed to finding tgz files
    expect(FsUtils.getFilesInDirectoryByExtensionAsync).not.toHaveBeenCalled();
  });

  test('should throw an error if no .tgz files are found', async () => {
    // Mock no tgz files found
    (FsUtils.getFilesInDirectoryByExtensionAsync as jest.Mock).mockResolvedValue([]);
    
    await expect(localNpmPublishPackage(mockLibraryData)).rejects.toThrow(
      'npm pack did not create any .tgz files'
    );
    
    // Should not proceed to moving files
    expect(FsUtils.moveFilesToDirectoryAsync).not.toHaveBeenCalled();
  });

  test('should throw an error if tarball is not found in npm directory', async () => {
    // Mock no tarball found in npm directory
    (FsUtils.getFilesInformationDirectoryAsync as jest.Mock).mockResolvedValue([]);
    
    await expect(localNpmPublishPackage(mockLibraryData)).rejects.toThrow(
      'Could not find the moved tarball'
    );
  });

  test('should handle packages with special characters in name', async () => {
    const specialNameLibraryData = {
      ...mockLibraryData,
      packageName: '@complex/name-with_special.chars'
    };
    
    // Should still work despite the complex name
    await localNpmPublishPackage(specialNameLibraryData);
    
    // Verify the filter function was called with the correct pattern
    const filterFnCall = (FsUtils.getFilesInformationDirectoryAsync as jest.Mock).mock.calls[0][1];
    
    // Test the filter function
    expect(filterFnCall('complex-name-with_special.chars-1.0.0.tgz')).toBe(true);
    expect(filterFnCall('wrong-package-1.0.0.tgz')).toBe(false);
  });

  test('should restore original working directory even if an error occurs', async () => {
    // Mock npm pack to throw an error
    (CommandUtils.npmPack as jest.Mock).mockImplementation(() => {
      throw new Error('Unexpected error');
    });
    
    // Expect the function to throw
    await expect(localNpmPublishPackage(mockLibraryData)).rejects.toThrow('Unexpected error');
    
    // But still restore the original directory
    expect(mockChdir).toHaveBeenCalledWith('/original/cwd');
  });
  
  test('should handle multiple .tgz files if present', async () => {
    const multipleTgzFiles = [
      path.join(mockLibraryData.packageDistPathAbsolute, 'test-my-package-1.0.0.tgz'),
      path.join(mockLibraryData.packageDistPathAbsolute, 'test-my-package-1.0.0-alpha.1.tgz')
    ];
    
    // Mock multiple tgz files
    (FsUtils.getFilesInDirectoryByExtensionAsync as jest.Mock).mockResolvedValue(multipleTgzFiles);
    
    await localNpmPublishPackage(mockLibraryData);
    
    // Should move all files
    expect(FsUtils.moveFilesToDirectoryAsync).toHaveBeenCalledWith(
      multipleTgzFiles, 
      defaultLocalNpmDir
    );
  });
});



//= = = = = = = = = = = = = = = = = = = = = = = = = = //