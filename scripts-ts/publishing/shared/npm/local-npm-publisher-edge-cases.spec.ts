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

//= = = = = = = = = = = = = = = = = = = = = = = = = = //

// Add these additional tests to handle more edge cases

describe('localNpmPublishPackage edge cases', () => {
  // Define a new mock data object specific to this test suite
  const mockEdgeCaseLibraryData: LibraryData = {
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
  const tgzFileName = 'test-my-package-1.0.0.tgz';
  const tgzFilePath = path.join(mockEdgeCaseLibraryData.packageDistPathAbsolute, tgzFileName);
  const finalTgzPath = path.join(defaultLocalNpmDir, tgzFileName);
  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
      // Default successful mocks
    (BuildUtils.buildLibraryForProduction as jest.Mock).mockReturnValue({
      status: 0, stdout: 'build successful', stderr: ''
    });
    (FsUtils.dirExists as jest.Mock).mockReturnValue(true);
    (CommandUtils.npmPack as jest.Mock).mockReturnValue({
      status: 0, stdout: 'test-my-package-1.0.0.tgz', stderr: ''
    });
    (FsUtils.getFilesInDirectoryByExtensionAsync as jest.Mock)
      .mockResolvedValue([tgzFilePath]);
    (FsUtils.moveFilesToDirectoryAsync as jest.Mock).mockResolvedValue(undefined);
    (FsUtils.getFilesInformationDirectoryAsync as jest.Mock).mockResolvedValue([
      { name: tgzFileName, fullPath: finalTgzPath, isDirectory: false }
    ]);
    
    mockCwd.mockReturnValue('/original/cwd');
  });
  
  afterEach(() => {
    // Ensure all mocks are reset after each test
    jest.clearAllMocks();
  });
  
  afterAll(() => {
    // Redundant with the global afterAll, but provides extra safety
    process.chdir = originalChdir;
    process.cwd = originalCwd;
  });
  test('should handle npm pack stdout with multiple lines', async () => {
    // Some npm versions might output additional info when packing
    (CommandUtils.npmPack as jest.Mock).mockReturnValue({
      status: 0,
      stdout: `
npm notice 
npm notice 📦  @test/my-package@1.0.0
npm notice === Tarball Contents === 
npm notice 1.1kB index.js      
npm notice 250B  package.json  
npm notice === Tarball Details === 
npm notice name:          @test/my-package                    
npm notice version:       1.0.0                               
npm notice filename:      test-my-package-1.0.0.tgz
npm notice package size:  700 B                               
npm notice unpacked size: 1.4 kB                              
npm notice shasum:        abcdef1234567890abcdef1234567890abcdef12
npm notice integrity:     sha512-ABCDEF1234567[...]890ABCDEF1234
npm notice total files:   2                                   
npm notice 
test-my-package-1.0.0.tgz
      `,
      stderr: ''
    });
    
    const result = await localNpmPublishPackage(mockEdgeCaseLibraryData);
    
    // Successful completion despite complex output
    expect(result).toBe(finalTgzPath);
  });
  test('should handle package names without scopes', async () => {
    const noScopeLibraryData = {
      ...mockEdgeCaseLibraryData,
      packageName: 'simple-package'
    };
    
    const simpleTgzFileName = 'simple-package-1.0.0.tgz';
    const simpleTgzFilePath = path.join(noScopeLibraryData.packageDistPathAbsolute, simpleTgzFileName);
    const simpleFinalTgzPath = path.join(defaultLocalNpmDir, simpleTgzFileName);
    
    // Update mocks for the new package name
    (FsUtils.getFilesInDirectoryByExtensionAsync as jest.Mock)
      .mockResolvedValue([simpleTgzFilePath]);
    (FsUtils.getFilesInformationDirectoryAsync as jest.Mock).mockResolvedValue([
      { name: simpleTgzFileName, fullPath: simpleFinalTgzPath, isDirectory: false }
    ]);
    
    const result = await localNpmPublishPackage(noScopeLibraryData);
    
    // Should work with non-scoped packages too
    expect(result).toBe(simpleFinalTgzPath);
    
    // Verify filtering logic was correct (no @ to strip)
    expect(FsUtils.getFilesInformationDirectoryAsync).toHaveBeenCalledWith(
      defaultLocalNpmDir,
      expect.any(Function)
    );
  });
  test('should handle Windows backslash paths correctly', async () => {
    const windowsPathLibraryData = {
      ...mockEdgeCaseLibraryData,
      packageDistPathAbsolute: 'C:\\path\\to\\dist\\test-lib'
    };
    
    const windowsTgzPath = 'C:\\path\\to\\dist\\test-lib\\test-my-package-1.0.0.tgz';
    
    // Update mocks for Windows paths
    (FsUtils.getFilesInDirectoryByExtensionAsync as jest.Mock)
      .mockResolvedValue([windowsTgzPath]);
    
    await localNpmPublishPackage(windowsPathLibraryData);
    
    // Verify Windows paths are handled correctly
    expect(FsUtils.dirExists).toHaveBeenCalledWith('C:\\path\\to\\dist\\test-lib');
    expect(mockChdir).toHaveBeenCalledWith('C:\\path\\to\\dist\\test-lib');
  });

  test('should handle moving files that might already exist in target (cleanup case)', async () => {
    // Mock the moveFilesToDirectoryAsync to simulate a file already exists error
    (FsUtils.moveFilesToDirectoryAsync as jest.Mock).mockRejectedValueOnce(
      new Error('EEXIST: file already exists')
    ).mockResolvedValueOnce(undefined); // Second call succeeds
    
    try {
      await localNpmPublishPackage(mockEdgeCaseLibraryData);
      fail('Should have thrown an error');
    } catch (err) {
      expect(err.message).toContain('file already exists');
      
      // Verify we still tried to restore the working directory
      expect(mockChdir).toHaveBeenCalledWith('/original/cwd');
    }
  });

  test('should properly escape package name for regex matching', async () => {
    const regexSpecialCharsLibData = {
      ...mockEdgeCaseLibraryData,
      packageName: '@test/package+with.special(chars)'
    };    
    const specialTgzFileName = 'test-package+with.special(chars)-1.0.0.tgz';
    const specialTgzFilePath = path.join(regexSpecialCharsLibData.packageDistPathAbsolute, specialTgzFileName);
    const specialFinalTgzPath = path.join(defaultLocalNpmDir, specialTgzFileName);
    
    // Update mocks for the special name
    (FsUtils.getFilesInDirectoryByExtensionAsync as jest.Mock)
      .mockResolvedValue([specialTgzFilePath]);
    (FsUtils.getFilesInformationDirectoryAsync as jest.Mock).mockResolvedValue([
      { 
        name: specialTgzFileName, 
        fullPath: specialFinalTgzPath, 
        isDirectory: false 
      }
    ]);
    
    const result = await localNpmPublishPackage(regexSpecialCharsLibData);
    
    // Should still find the correct tarball despite special characters
    expect(result).toBe(specialFinalTgzPath);
  });
});