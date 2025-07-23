/* eslint-disable @typescript-eslint/no-empty-function */
import { TestBed } from '@angular/core/testing';
import { AppErrorHandler } from './app-error-handler';
import { SbToastService, ToastData } from '@spider-baby/ui-toast';
import { ErrorDownloadService } from './error-download.service';
import { DOCUMENT } from '@angular/core';
import { PLATFORM_ID, ErrorHandler } from '@angular/core';
import { devConsole } from '@spider-baby/dev-console';

// Mock console methods
const originalConsoleLog = console.log;
const originalConsoleTrace = console.trace;

beforeAll(() => {
  console.log = jest.fn();
  console.trace = jest.fn();
});

afterAll(() => {
  console.log = originalConsoleLog;
  console.trace = originalConsoleTrace;
});

// Mock the console methods
jest.spyOn(console, 'log').mockImplementation(() => {});
jest.spyOn(console, 'trace').mockImplementation(() => {});

// Mock the devConsole
jest.mock('@spider-baby/dev-console', () => ({
  devConsole: {
    log: jest.fn(),
    trace: jest.fn()
  }
}));

// Mock isDevMode
const isDevModeDefault = true;
let isDevModeValue = isDevModeDefault;
jest.mock('@angular/core', () => {
  const originalModule = jest.requireActual('@angular/core');
  return {
    ...originalModule,
    isDevMode: jest.fn().mockImplementation(() => isDevModeValue),
    isPlatformServer: originalModule.isPlatformServer,
    ErrorHandler: originalModule.ErrorHandler,
    PLATFORM_ID: originalModule.PLATFORM_ID
  };
});

describe('AppErrorHandler', () => {
  let errorHandler: AppErrorHandler;
  let toastServiceMock: jest.Mocked<Partial<SbToastService>>;
  let errorDownloadServiceMock: jest.Mocked<Partial<ErrorDownloadService>>;
  let documentMock: Partial<Document>;
  
  // Set up console mocks
  beforeAll(() => {
    jest.spyOn(console, 'log').mockImplementation(jest.fn());
    jest.spyOn(console, 'trace').mockImplementation(jest.fn());
  });
  
  afterAll(() => {
    jest.restoreAllMocks();
  });
  
  // Mock for ToastData
  const mockToastData = {
    positionTopRight: jest.fn().mockReturnThis(),
    withSlide: jest.fn().mockReturnThis()
  };

  // Mock the static ToastData.Error method
  ToastData.Error = jest.fn().mockReturnValue(mockToastData);

  beforeEach(() => {
    // Create mock objects
    toastServiceMock = {
      show: jest.fn()
    };

    errorDownloadServiceMock = {
      bufferErrorForDownload: jest.fn()
    };    documentMock = {
      location: {
        reload: jest.fn(),
        href: 'https://mock-url.com/test',
        // Add missing Location properties with empty implementations
        ancestorOrigins: {} as DOMStringList,
        hash: '',
        host: 'mock-url.com',
        hostname: 'mock-url.com',
        origin: 'https://mock-url.com',
        pathname: '/test',
        port: '',
        protocol: 'https:',
        search: '',
        assign: jest.fn(),
        replace: jest.fn(),
        toString: jest.fn().mockReturnValue('https://mock-url.com/test')
      }
    };

    TestBed.configureTestingModule({
      providers: [
        AppErrorHandler,
        { provide: SbToastService, useValue: toastServiceMock },
        { provide: ErrorDownloadService, useValue: errorDownloadServiceMock },
        { provide: DOCUMENT, useValue: documentMock },
        { provide: PLATFORM_ID, useValue: 'browser' } // Browser platform
      ]
    });

    errorHandler = TestBed.inject(AppErrorHandler);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be created', () => {
    expect(errorHandler).toBeTruthy();
  });

  describe('handleError', () => {    it('should skip processing if on server platform', () => {
      // Arrange - Create a new instance with server platformId
      jest.clearAllMocks(); // Clear any previous mock calls
      
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        providers: [
          AppErrorHandler,
          { provide: SbToastService, useValue: toastServiceMock },
          { provide: ErrorDownloadService, useValue: errorDownloadServiceMock },
          { provide: DOCUMENT, useValue: documentMock },
          { provide: PLATFORM_ID, useValue: 'server' } // Server platform
        ]
      });
      const serverErrorHandler = TestBed.inject(AppErrorHandler);

      // Act
      serverErrorHandler.handleError(new Error('Server error'));      // Assert
      expect(console.log).toHaveBeenCalledWith('SSR-Error', expect.any(Error));
      expect(console.trace).toHaveBeenCalled();
      expect(toastServiceMock.show).not.toHaveBeenCalled();
      expect(errorDownloadServiceMock.bufferErrorForDownload).not.toHaveBeenCalled();
    });

    it('should handle chunk load errors by reloading the page', () => {
      // Arrange
      const chunkError = new Error('Loading chunk failed');
      chunkError.name = 'ChunkLoadError';

      // Act
      errorHandler.handleError(chunkError);

      // Assert
      expect(devConsole.log).toHaveBeenCalledWith('isChunkLoadError', chunkError);
      expect(toastServiceMock.show).toHaveBeenCalled();
      expect(documentMock.location?.reload).toHaveBeenCalled();
      expect(errorDownloadServiceMock.bufferErrorForDownload).not.toHaveBeenCalled();
    });

    it('should handle chunk load errors detected by message', () => {
      // Arrange
      const chunkError = new Error('Loading chunk 123.js failed');

      // Act
      errorHandler.handleError(chunkError);

      // Assert
      expect(devConsole.log).toHaveBeenCalledWith('isChunkLoadError', chunkError);
      expect(toastServiceMock.show).toHaveBeenCalled();
      expect(documentMock.location?.reload).toHaveBeenCalled();
      expect(errorDownloadServiceMock.bufferErrorForDownload).not.toHaveBeenCalled();
    });

    it('should skip 404 errors', () => {
      // Arrange
      const notFoundError = new Error('Not found');
      notFoundError['statusCode'] = 404;

      // Act
      errorHandler.handleError(notFoundError);

      // Assert
      expect(toastServiceMock.show).not.toHaveBeenCalled();
      expect(errorDownloadServiceMock.bufferErrorForDownload).not.toHaveBeenCalled();
    });

    it('should skip 401 unauthorized errors', () => {
      // Arrange
      const unauthorizedError = new Error('Unauthorized');
      unauthorizedError['statusCode'] = 401;

      // Act
      errorHandler.handleError(unauthorizedError);

      // Assert
      expect(toastServiceMock.show).not.toHaveBeenCalled();
      expect(errorDownloadServiceMock.bufferErrorForDownload).not.toHaveBeenCalled();
    });

    it('should process normal errors', () => {
      // Arrange
      const normalError = new Error('Normal error');

      // Act
      errorHandler.handleError(normalError);

      // Assert
      expect(toastServiceMock.show).toHaveBeenCalled();
      expect(ToastData.Error).toHaveBeenCalledWith('Normal error');
      expect(mockToastData.positionTopRight).toHaveBeenCalled();
      expect(mockToastData.withSlide).toHaveBeenCalled();
      expect(errorDownloadServiceMock.bufferErrorForDownload).toHaveBeenCalledWith(normalError);
    });

    it('should process errors with statusCode', () => {
      // Arrange
      const httpError = new Error('Server error');
      httpError['statusCode'] = 500;

      // Act
      errorHandler.handleError(httpError);

      // Assert
      expect(toastServiceMock.show).toHaveBeenCalled();
      expect(ToastData.Error).toHaveBeenCalledWith('Server error');
      expect(errorDownloadServiceMock.bufferErrorForDownload).toHaveBeenCalledWith(httpError);
    });

    it('should truncate long error messages', () => {
      // Arrange
      const longMessage = 'This is a very long error message that should be truncated to 60 characters plus ellipsis';
      const error = new Error(longMessage);

      // Act
      errorHandler.handleError(error);

      // Assert
      expect(ToastData.Error).toHaveBeenCalledWith('This is a very long error message that should be truncate...');
    });

    it('should handle undefined or null error messages', () => {
      // Arrange
      const errorWithoutMessage = { statusCode: 500 };

      // Act
      errorHandler.handleError(errorWithoutMessage);

      // Assert
      expect(ToastData.Error).toHaveBeenCalledWith('An unknown error occurred');
    });    it('should not buffer errors for download in production mode', () => {
      // Set isDevMode to return false for this test
      isDevModeValue = false;
      
      // Arrange
      const error = new Error('Production error');
      
      // Act
      errorHandler.handleError(error);
      
      // Assert
      expect(toastServiceMock.show).toHaveBeenCalled();
      expect(errorDownloadServiceMock.bufferErrorForDownload).not.toHaveBeenCalled();
      
      // Reset to default for other tests
      isDevModeValue = isDevModeDefault;
    });
  });

  describe('isChunkLoadError', () => {    it('should detect errors with ChunkLoadError name', () => {
      // Arrange
      const error = new Error('Some error');
      error.name = 'ChunkLoadError';

      // Act & Assert - using private method via type assertion
      const handler = errorHandler as unknown as { isChunkLoadError(error: Error): boolean };
      expect(handler.isChunkLoadError(error)).toBe(true);
    });    it('should detect errors with chunk load message pattern', () => {
      // Arrange
      const error = new Error('Loading chunk app.js failed');

      // Act & Assert
      const handler = errorHandler as unknown as { isChunkLoadError(error: Error): boolean };
      expect(handler.isChunkLoadError(error)).toBe(true);
    });

    it('should handle case insensitivity for chunk error name', () => {
      // Arrange
      const error = new Error('Some error');
      error.name = 'chunkloaderror';

      // Act & Assert
      const handler = errorHandler as unknown as { isChunkLoadError(error: Error): boolean };
      expect(handler.isChunkLoadError(error)).toBe(true);
    });

    it('should return false for non-chunk errors', () => {
      // Arrange
      const error = new Error('Regular error');

      // Act & Assert
      const handler = errorHandler as unknown as { isChunkLoadError(error: Error): boolean };
      expect(handler.isChunkLoadError(error)).toBe(false);
    });
  });
  describe('showToast', () => {
    it('should use error toast type', () => {
      // Act
      const handler = errorHandler as unknown as { showToast(msg: string): void };
      handler.showToast('Test message');

      // Assert
      expect(ToastData.Error).toHaveBeenCalledWith('Test message');
    });

    it('should position toast at top right', () => {
      // Act
      const handler = errorHandler as unknown as { showToast(msg: string): void };
      handler.showToast('Test message');

      // Assert
      expect(mockToastData.positionTopRight).toHaveBeenCalled();
    });

    it('should use slide animation', () => {
      // Act
      const handler = errorHandler as unknown as { showToast(msg: string): void };
      handler.showToast('Test message');

      // Assert
      expect(mockToastData.withSlide).toHaveBeenCalled();
    });

    it('should use 6 second duration', () => {
      // Act
      const handler = errorHandler as unknown as { showToast(msg: string): void };
      handler.showToast('Test message');

      // Assert
      expect(toastServiceMock.show).toHaveBeenCalledWith(expect.anything(), 6000);
    });
  });

  describe('provideAppErrorHandler', () => {
    it('should provide the correct ErrorHandler', () => {
      // Import the function to test
      const { provideAppErrorHandler } = require('./app-error-handler');

      // Act
      const provider = provideAppErrorHandler();

      // Assert
      expect(provider).toEqual({
        provide: ErrorHandler,
        useClass: AppErrorHandler
      });
    });
  });
});
