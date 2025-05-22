import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { FileDownloadService } from './blob-download.service';
import { LocalFileDownloadServiceService } from './local-download-service.ts.service';

describe('LocalDownloadServiceTsService', () => {
  let service: LocalFileDownloadServiceService;
  let httpTestingController: HttpTestingController;
  let fileDownloadServiceSpy: jest.SpyInstance;

  const testFilePath = 'http://test.com/file.zip';
  const testFileName = 'test-file.zip';
  const testMimeType = 'application/zip';
  const testBlob = new Blob(['test data'], { type: testMimeType });

  beforeEach(() => {
    // Create a mock for the FileDownloadService
    const mockFileDownloadService = {
      downloadBlob: jest.fn().mockReturnValue(true)
    };

    TestBed.configureTestingModule({
      imports: [
        // HttpClientTestingModule
      ],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        LocalFileDownloadServiceService,
        { provide: FileDownloadService, useValue: mockFileDownloadService }
      ]
    });

    // Get the injected instances
    service = TestBed.inject(LocalFileDownloadServiceService);
    httpTestingController = TestBed.inject(HttpTestingController);

    // Get the spy for the downloadBlob method
    fileDownloadServiceSpy = jest.spyOn(TestBed.inject(FileDownloadService), 'downloadBlob');
  });

  afterEach(() => {
    // After each test, verify that there are no more pending requests
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('download$', () => {
    it('should call HttpClient with correct options', () => {
      // Start the service call
      service.download$(testFilePath, testFileName, testMimeType).subscribe();

      // Expect a single request to the specified URL with the correct options
      const req = httpTestingController.expectOne(testFilePath);

      // Assert that the request was made with the expected method
      expect(req.request.method).toBe('GET');

      // Assert that the request was made with the expected responseType and observe options
      // These options are set in the request options
      expect(req.request.responseType).toBe('blob');

      // Complete the request by returning a mock response
      req.flush(testBlob, {
        headers: { 'Content-Type': testMimeType },
        status: 200,
        statusText: 'OK'
      });
    });

    //- - - - - - - - - - - - - - - - - //

    it('should set activeDownload before the download starts', async () => {
      // Set up a spy to track all emitted values
      const emittedValues: (string | null)[] = [];
      const subscription = service.activeDownload$.subscribe(value => {
        emittedValues.push(value);
      });

      // Start the service call
      service.download$(testFilePath, testFileName, testMimeType).subscribe();

      // Complete the request
      const req = httpTestingController.expectOne(testFilePath);
      req.flush(testBlob, {
        headers: { 'Content-Type': testMimeType },
        status: 200,
        statusText: 'OK'
      });

      // Clean up subscription
      subscription.unsubscribe();

      // The first emitted value should be the file path (null first if it's a new BehaviorSubject)
      // and the last emitted value should be null
      expect(emittedValues).toContain(testFilePath);
      expect(emittedValues[emittedValues.length - 1]).toBeNull();
    });

    //- - - - - - - - - - - - - - - - - //

    it('should handle successful response correctly', async () => {
      // Start the service call
      const resultPromise = firstValueFrom(service.download$(testFilePath, testFileName, testMimeType));

      // Complete the request
      const req = httpTestingController.expectOne(testFilePath);
      req.flush(testBlob, {
        headers: { 'Content-Type': testMimeType },
        status: 200,
        statusText: 'OK'
      });

      // Wait for the result
      const result = await resultPromise;

      // Check that downloadBlob was called with the correct arguments
      expect(fileDownloadServiceSpy).toHaveBeenCalledWith(testBlob, {
        filename: testFileName,
        mimeType: testMimeType
      });

      // Check that the result is true
      expect(result).toBe(true);

      // Check that activeDownload is reset to null
      const activeDownloadValue = await firstValueFrom(service.activeDownload$);
      expect(activeDownloadValue).toBeNull();
    });

    //- - - - - - - - - - - - - - - - - //
    it('should handle error response correctly', async () => {
      // Start the service call
      const resultPromise = firstValueFrom(service.download$(testFilePath, testFileName, testMimeType));

      // Set up spies to verify error handling
      const setErrorSpy = jest.spyOn(service['_errorBs'], 'next');

      // Complete the request with an error status but include a Blob body
      // This ensures the map function gets called and hits your error path
      const req = httpTestingController.expectOne(testFilePath);
      req.flush(new Blob(), { // Using empty Blob to ensure body exists
        status: 200,
        statusText: 'Not Found',
        headers: { 'Content-Type': '' } // Empty content type to ensure error path
      });

      // The promise should be rejected because your code throws an error
      await expect(resultPromise).rejects.toThrow(/Error downloading binary file/);

      // Verify error handling behavior
      expect(setErrorSpy).toHaveBeenCalled();

      // Check that activeDownload is reset to null
      const activeDownloadValue = await firstValueFrom(service.activeDownload$);
      expect(activeDownloadValue).toBeNull();
    });

    //- - - - - - - - - - - - - - - - - //

    it('should handle network errors correctly', async () => {
      // Set up a spy to track all emitted values
      const emittedValues: (string | null)[] = [];
      const subscription = service.activeDownload$.subscribe(value => {
        emittedValues.push(value);
      });

      // Set up spy for error BehaviorSubject
      const setErrorSpy = jest.spyOn(service['_errorBs'], 'next');

      // Start the service call and expect it to fail
      const resultPromise = firstValueFrom(service.download$(testFilePath, testFileName, testMimeType));

      // Simulate a network error
      const req = httpTestingController.expectOne(testFilePath);
      req.error(new ProgressEvent('error'));

      // Clean up subscription
      subscription.unsubscribe();

      // The promise should be rejected
      await expect(resultPromise).rejects.toThrow(/Network error downloading file/);

      // Check that _errorBs.next was called with an error message
      expect(setErrorSpy).toHaveBeenCalled();
      const errorArg = setErrorSpy.mock.calls[0][0];
      expect(errorArg).toContain('Network error downloading file');
      expect(errorArg).toContain(testFilePath);

      // Verify the sequence of activeDownload values
      // Should include the file path initially and null after error
      expect(emittedValues).toContain(testFilePath);
      expect(emittedValues[emittedValues.length - 1]).toBeNull();

      // Check that activeDownload is reset to null
      const activeDownloadValue = await firstValueFrom(service.activeDownload$);
      expect(activeDownloadValue).toBeNull();
    });
  });
});