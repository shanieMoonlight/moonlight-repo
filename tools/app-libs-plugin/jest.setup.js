// tools/app-libs-plugin/jest.setup.js
jest.mock('@nx/devkit', () => {
  const originalModule = jest.requireActual('@nx/devkit');
  return {
    ...originalModule,
    // Mock methods that use setTimeout.unref()
    createProjectGraphAsync: jest.fn().mockResolvedValue({ nodes: {}, dependencies: {} }),
    // Add other methods your generators use that might cause issues
  };
});

// Mock other Nx services as needed
jest.mock('nx/src/daemon/client/client', () => {
  return {
    DaemonClient: jest.fn().mockImplementation(() => ({
      getProjectGraphAndSourceMaps: jest.fn().mockResolvedValue({
        projectGraph: { nodes: {}, dependencies: {} },
        sourceMap: new Map()
      })
    }))
  };
});