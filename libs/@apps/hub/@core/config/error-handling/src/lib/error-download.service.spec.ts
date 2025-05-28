import { TestBed } from '@angular/core/testing';
import { ErrorDownloadService } from './error-download.service';
import { FileDownloadService } from '@spider-baby/utils-file-saver';
import { ErrorHelpers } from './error-helpers';
import { devConsole } from '@spider-baby/dev-console';

// Mock the devConsole
jest.mock('@spider-baby/dev-console', () => ({
  devConsole: {
    log: jest.fn()
  }
}));

describe('ErrorDownloadService', () => {
  let service: ErrorDownloadService;
  let fileDownloadServiceMock: jest.Mocked<Partial<FileDownloadService>>;
  let errorHelpersMock: jest.Mocked<Partial<ErrorHelpers>>;

  // Use Jest fake timers
  beforeEach(() => {
    jest.useFakeTimers();
    
    // Create mock objects
    fileDownloadServiceMock = {
      downloadText: jest.fn()
    };

    errorHelpersMock = {
      createErrorInfoObject: jest.fn().mockReturnValue({
        name: 'MockError',
        message: 'Mock error message',
        // Add other required properties
        constructor: {},
        statusCode: 500,
        originalError: '',
        window: 'http://localhost',
        browser: 'Mock Browser',
        device: 'Mock Device',
        stack: 'Mock stack trace'
      })
    };

    TestBed.configureTestingModule({
      providers: [
        ErrorDownloadService,
        { provide: FileDownloadService, useValue: fileDownloadServiceMock },
        { provide: ErrorHelpers, useValue: errorHelpersMock }
      ]
    });

    service = TestBed.inject(ErrorDownloadService);
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.useRealTimers();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('bufferErrorForDownload', () => {
    it('should add error to buffer and schedule processing', () => {
      // Act
      service.bufferErrorForDownload(new Error('Test error'));
      
      // Assert - error should be in buffer but not processed yet
      expect(fileDownloadServiceMock.downloadText).not.toHaveBeenCalled();
      
      // Fast forward to trigger the timeout
      jest.advanceTimersByTime(3000);
      
      // Now the file download should have been triggered
      expect(fileDownloadServiceMock.downloadText).toHaveBeenCalledTimes(1);
      expect(errorHelpersMock.createErrorInfoObject).toHaveBeenCalledTimes(1);
    });

    it('should clear existing timeout when adding new error', () => {
      // Arrange
      const clearTimeoutSpy = jest.spyOn(global, 'clearTimeout');
      
      // Act - add first error
      service.bufferErrorForDownload(new Error('First error'));
      
      // Fast forward halfway through timeout
      jest.advanceTimersByTime(1500);
      
      // Add second error
      service.bufferErrorForDownload(new Error('Second error'));
      
      // Assert
      expect(clearTimeoutSpy).toHaveBeenCalledTimes(1);
      
      // Fast forward to trigger the new timeout
      jest.advanceTimersByTime(3000);
      
      // Both errors should have been processed in batch
      expect(fileDownloadServiceMock.downloadText).toHaveBeenCalledTimes(1);
      // The error mapping happens for all errors in the buffer
      expect(errorHelpersMock.createErrorInfoObject).toHaveBeenCalledTimes(2);
    });
  });

  describe('formatYearMonthDay', () => {
    it('should format date as YYYY-MM-DD by default', () => {
      // Arrange
      const testDate = new Date(2025, 4, 28); // May 28, 2025
      
      // Act
      const result = (service as any).formatYearMonthDay(testDate);
      
      // Assert
      expect(result).toBe('2025-05-28');
    });

    it('should use custom separator when provided', () => {
      // Arrange
      const testDate = new Date(2025, 4, 28); // May 28, 2025
      
      // Act
      const result = (service as any).formatYearMonthDay(testDate, '/');
      
      // Assert
      expect(result).toBe('2025/05/28');
    });

    it('should pad single-digit month and day with leading zero', () => {
      // Arrange
      const testDate = new Date(2025, 0, 1); // Jan 1, 2025
      
      // Act
      const result = (service as any).formatYearMonthDay(testDate);
      
      // Assert
      expect(result).toBe('2025-01-01');
    });
  });

  describe('processErrorBuffer', () => {
    it('should not process empty buffer', () => {
      // Act - manually call the private method
      (service as any).processErrorBuffer();
      
      // Assert
      expect(fileDownloadServiceMock.downloadText).not.toHaveBeenCalled();
    });

    it('should respect cooldown period', () => {
      // Arrange
      // Set last download time to recent past
      (service as any)._lastDownloadTime = Date.now();
      service.bufferErrorForDownload(new Error('Test error'));
      
      // Act
      jest.advanceTimersByTime(3000); // Trigger timeout
      
      // Assert
      expect(fileDownloadServiceMock.downloadText).not.toHaveBeenCalled();
      expect(devConsole.log).toHaveBeenCalledWith(expect.stringContaining('cooldown active'));
    });

    it('should use single error format for one error', () => {
      // Arrange
      (service as any)._lastDownloadTime = 0; // Reset cooldown
      service.bufferErrorForDownload(new Error('Single error'));
      
      // Act
      jest.advanceTimersByTime(3000); // Trigger timeout
      
      // Assert
      expect(fileDownloadServiceMock.downloadText).toHaveBeenCalledWith(
        expect.any(String),
        expect.stringMatching(/^Error_\d{4}-\d{2}-\d{2}\.txt$/)
      );
    });

    it('should use batch format for multiple errors', () => {
      // Arrange
      (service as any)._lastDownloadTime = 0; // Reset cooldown
      service.bufferErrorForDownload(new Error('First error'));
      service.bufferErrorForDownload(new Error('Second error'));
      
      // Act
      jest.advanceTimersByTime(3000); // Trigger timeout
      
      // Assert
      expect(fileDownloadServiceMock.downloadText).toHaveBeenCalledWith(
        expect.any(String),
        expect.stringMatching(/^Errors_Batch_\d{4}-\d{2}-\d{2}_Count_2\.txt$/)
      );
    });
  });

  describe('downloadErrorAsTxtFile', () => {
    it('should create error info object and download as text file', () => {
      // Arrange
      const testError = new Error('Test error');
        // Act
      (service as any).downloadErrorAsTxtFile(testError);
      
      // Assert
      expect(errorHelpersMock.createErrorInfoObject).toHaveBeenCalledWith(testError);
      
      // Check that downloadText was called with the correct filename pattern
      const downloadCall = fileDownloadServiceMock.downloadText.mock.calls[0];
      expect(downloadCall[1]).toMatch(/^Error_\d{4}-\d{2}-\d{2}\.txt$/);
    });

    it('should replace escaped newlines in JSON output', () => {
      // Arrange
      const testError = new Error('Test\nError\nWith\nNewlines');
      errorHelpersMock?.createErrorInfoObject?.mockReturnValueOnce({
        message: 'Test\nError\nWith\nNewlines',
        name: 'Error',
        constructor: {},
        statusCode: 500,
        originalError: '',
        window: 'http://localhost',
        browser: 'Mock Browser',
        device: 'Mock Device',
        stack: 'Line1\nLine2\nLine3'
      });
      
      // Mock the JSON.stringify call
      const originalStringify = JSON.stringify;
      JSON.stringify = jest.fn().mockReturnValue('{"message":"Test\\nError\\nWith\\nNewlines"}');
      
      // Act
      (service as any).downloadErrorAsTxtFile(testError);
      
      // Assert
      expect(fileDownloadServiceMock.downloadText).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(String)
      );
      
      // Restore original stringify
      JSON.stringify = originalStringify;
    });
  });

  describe('downloadErrorBatchAsTxtFile', () => {
    it('should create batch object with multiple errors', () => {
      // Arrange
      const errors = [
        new Error('First error'),
        new Error('Second error')
      ];
      
      // Mock the Date.toISOString method
      const originalToISOString = Date.prototype.toISOString;
      Date.prototype.toISOString = jest.fn().mockReturnValue('2025-05-28T12:00:00.000Z');
      
      // Act
      (service as any).downloadErrorBatchAsTxtFile(errors);
        // Assert
      expect(errorHelpersMock.createErrorInfoObject).toHaveBeenCalledTimes(2);
      
      // Check that downloadText was called
      expect(fileDownloadServiceMock.downloadText).toHaveBeenCalled();
      
      // Verify the content contains the expected errorCount
      const downloadCall = fileDownloadServiceMock.downloadText.mock.calls[0];
      expect(downloadCall[0]).toContain('"errorCount": 2');
      
      // Verify filename format is correct
      expect(downloadCall[1]).toMatch(/^Errors_Batch_\d{4}-\d{2}-\d{2}_Count_2\.txt$/);
      
      // Restore original toISOString
      Date.prototype.toISOString = originalToISOString;
    });
  });
});
