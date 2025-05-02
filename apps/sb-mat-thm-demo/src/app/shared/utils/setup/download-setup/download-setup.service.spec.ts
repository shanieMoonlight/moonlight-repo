import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing'; // Use this for standalone
import { provideHttpClient } from '@angular/common/http'; // Use this for standalone

import { DownloadSetupFilesService, SetupFile } from './download-setup.service';
import { BlobDownloadService } from '@spider-baby/utils-download';
import { firstValueFrom, lastValueFrom, skip } from 'rxjs';
import { signal } from '@angular/core';

// Mock BlobDownloadService
class MockBlobDownloadService {
  downloadBlob = jest.fn();
}

const MOCK_SETUP_FILES: SetupFile[] = [
  { filename: 'file1.ts', title: 'File 1', description: 'Desc 1' },
  { filename: 'file2.zip', title: 'File 2', description: 'Desc 2', isBinary: true, displayName: 'archive.zip' },
];

describe('DownloadSetupFilesService', () => {
  let service: DownloadSetupFilesService;
  let httpMock: HttpTestingController;
  let blobDownloadServiceMock: MockBlobDownloadService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      // Use providers for standalone approach
      providers: [
        DownloadSetupFilesService,
        provideHttpClient(), // Provide HttpClient
        provideHttpClientTesting(), // Provide testing support
        { provide: BlobDownloadService, useClass: MockBlobDownloadService },
      ],
    });

    service = TestBed.inject(DownloadSetupFilesService);
    httpMock = TestBed.inject(HttpTestingController);
    // Cast to the mock type to access the jest mock function
    blobDownloadServiceMock = TestBed.inject(BlobDownloadService) as unknown as MockBlobDownloadService;

    // Override the initial signal value for predictable tests if needed,
    // or rely on the actual constant if it's stable.
    // Here we assume the service initializes itself with SETUP_FILES constant.
    // If SETUP_FILES could change, mock it: service.setupFiles.set(MOCK_SETUP_FILES);
  });

  afterEach(() => {
    httpMock.verify(); // Make sure that there are no outstanding requests
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize with default setup files', () => {
    // Access the signal's value
    const files = service.setupFiles();
    expect(files).toBeDefined();
    expect(files.length).toBeGreaterThan(0); // Check based on the actual SETUP_FILES constant
    // Example check for a specific file from the actual constant
    expect(files.some(f => f.filename === 'theme.config.ts')).toBe(true);
  });

  it('should initialize activeDownload signal/observable with null', async () => {
    expect(service.activeDownload()).toBeNull();
    const initialValue = await firstValueFrom(service.activeDownload$);
    expect(initialValue).toBeNull();
  });

  describe('downloadSetupFile', () => {
    it('should download a text file correctly', fakeAsync(() => {
      const filename = 'test.ts';
      const mockContent = 'console.log("hello");';
      const expectedMime = 'application/typescript';
      let lastActiveDownloadValue: string | null = 'initial'; // Track observable emission

      service.activeDownload$.subscribe(val => lastActiveDownloadValue = val);
      service.downloadSetupFile(filename, undefined, false);
      tick(); // Allow microtasks like BehaviorSubject.next() to run

      // Check active download state
      expect(service.activeDownload()).toBe(filename);
      expect(lastActiveDownloadValue).toBe(filename);

      // Expect HTTP request
      const req = httpMock.expectOne(`/setup-files/${filename}`);
      expect(req.request.method).toBe('GET');
      expect(req.request.responseType).toBe('text');
      req.flush(mockContent); // Respond with mock data
      tick(); // Allow subscribe callbacks to run

      // Check blob download call
      expect(blobDownloadServiceMock.downloadBlob).toHaveBeenCalledTimes(1);
      expect(blobDownloadServiceMock.downloadBlob).toHaveBeenCalledWith(mockContent, {
        filename: filename,
        mimeType: expectedMime,
      });

      // Check active download state reset
      expect(service.activeDownload()).toBeNull();
      expect(lastActiveDownloadValue).toBeNull();
    }));

    it('should download a binary file correctly', fakeAsync(() => {
        const filename = 'test.zip';
        const mockBlob = new Blob(['binary data']);
        const expectedMime = 'application/zip';
        let lastActiveDownloadValue: string | null = 'initial';

        service.activeDownload$.subscribe(val => lastActiveDownloadValue = val);
        service.downloadSetupFile(filename, undefined, true); // isBinary = true
        tick();

        expect(service.activeDownload()).toBe(filename);
        expect(lastActiveDownloadValue).toBe(filename);

        const req = httpMock.expectOne(`/setup-files/${filename}`);
        expect(req.request.method).toBe('GET');
        expect(req.request.responseType).toBe('blob'); // Check responseType
        req.flush(mockBlob);
        tick();

        expect(blobDownloadServiceMock.downloadBlob).toHaveBeenCalledTimes(1);
        expect(blobDownloadServiceMock.downloadBlob).toHaveBeenCalledWith(mockBlob, {
          filename: filename,
          mimeType: expectedMime,
        });

        expect(service.activeDownload()).toBeNull();
        expect(lastActiveDownloadValue).toBeNull();
    }));

    it('should use displayName when provided', fakeAsync(() => {
        const filename = 'actual-file.txt';
        const displayName = 'user-friendly-name.txt';
        const mockContent = 'text content';

        service.downloadSetupFile(filename, displayName, false);
        tick();

        const req = httpMock.expectOne(`/setup-files/${filename}`);
        req.flush(mockContent);
        tick();

        expect(blobDownloadServiceMock.downloadBlob).toHaveBeenCalledWith(mockContent, {
          filename: displayName, // Check that displayName is used
          mimeType: 'text/plain',
        });
    }));

    it('should handle HTTP errors gracefully for text files', fakeAsync(() => {
        const filename = 'error.txt';
        const consoleSpy = jest.spyOn(console, 'error').mockImplementation(); // Suppress console error during test
        let lastActiveDownloadValue: string | null = 'initial';

        service.activeDownload$.subscribe(val => lastActiveDownloadValue = val);
        service.downloadSetupFile(filename, undefined, false);
        tick();

        expect(service.activeDownload()).toBe(filename);
        expect(lastActiveDownloadValue).toBe(filename);

        const req = httpMock.expectOne(`/setup-files/${filename}`);
        req.error(new ProgressEvent('error'), { status: 404, statusText: 'Not Found' });
        tick();

        expect(blobDownloadServiceMock.downloadBlob).not.toHaveBeenCalled();
        expect(consoleSpy).toHaveBeenCalled();
        expect(service.activeDownload()).toBeNull();
        expect(lastActiveDownloadValue).toBeNull();

        consoleSpy.mockRestore();
    }));

     it('should handle HTTP errors gracefully for binary files', fakeAsync(() => {
        const filename = 'error.zip';
        const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
        let lastActiveDownloadValue: string | null = 'initial';

        service.activeDownload$.subscribe(val => lastActiveDownloadValue = val);
        service.downloadSetupFile(filename, undefined, true); // isBinary = true
        tick();

        expect(service.activeDownload()).toBe(filename);
        expect(lastActiveDownloadValue).toBe(filename);

        const req = httpMock.expectOne(`/setup-files/${filename}`);
        req.error(new ProgressEvent('error'), { status: 500, statusText: 'Server Error' });
        tick();

        expect(blobDownloadServiceMock.downloadBlob).not.toHaveBeenCalled();
        expect(consoleSpy).toHaveBeenCalled();
        expect(service.activeDownload()).toBeNull();
        expect(lastActiveDownloadValue).toBeNull();

        consoleSpy.mockRestore();
    }));
  });

  describe('downloadPredefinedFile', () => {
    // Use fakeAsync for these tests since downloadSetupFile is async
    it('should call downloadSetupFile with correct arguments from SetupFile object', fakeAsync(() => {
      const downloadSetupFileSpy = jest.spyOn(service, 'downloadSetupFile');
      const fileToDownload: SetupFile = {
        filename: 'predefined.scss',
        title: 'Predefined SCSS',
        description: 'Desc',
        icon: 'style',
        displayName: 'my-styles.scss',
        isBinary: false // Explicitly false
      };

      service.downloadPredefinedFile(fileToDownload);
      tick(); // Allow async operations in downloadSetupFile to start

      // Verify the spy call first
      expect(downloadSetupFileSpy).toHaveBeenCalledTimes(1);
      expect(downloadSetupFileSpy).toHaveBeenCalledWith(
        fileToDownload.filename,
        fileToDownload.displayName,
        false // Expecting false as isBinary was false
      );

      // Now, handle the HTTP request made by the actual downloadSetupFile call
      const req = httpMock.expectOne(`/setup-files/${fileToDownload.filename}`);
      expect(req.request.method).toBe('GET');
      req.flush('mock scss content'); // Flush with some mock data
      tick(); // Allow the rest of downloadSetupFile to complete

      // Optional: Verify blob download was called if needed, though the spy check might be sufficient
      // expect(blobDownloadServiceMock.downloadBlob).toHaveBeenCalled();
    }));


    it('should call downloadSetupFile handling undefined isBinary as false', fakeAsync(() => {
      const downloadSetupFileSpy = jest.spyOn(service, 'downloadSetupFile');
      const fileToDownload: SetupFile = {
        filename: 'predefined.ts',
        title: 'Predefined TS',
        description: 'Desc',
        // isBinary is undefined
      };

      service.downloadPredefinedFile(fileToDownload);
      tick();

      expect(downloadSetupFileSpy).toHaveBeenCalledTimes(1);
      expect(downloadSetupFileSpy).toHaveBeenCalledWith(
        fileToDownload.filename,
        fileToDownload.displayName, // undefined in this case
        false // Expecting false as isBinary was undefined
      );

      // Handle the HTTP request
      const req = httpMock.expectOne(`/setup-files/${fileToDownload.filename}`);
      expect(req.request.method).toBe('GET');
      req.flush('mock ts content');
      tick();
    }));

     it('should call downloadSetupFile with isBinary true when set in SetupFile object', fakeAsync(() => {
      const downloadSetupFileSpy = jest.spyOn(service, 'downloadSetupFile');
      const fileToDownload: SetupFile = {
        filename: 'predefined.zip',
        title: 'Predefined Zip',
        description: 'Desc',
        isBinary: true // Explicitly true
      };

      service.downloadPredefinedFile(fileToDownload);
      tick();

      expect(downloadSetupFileSpy).toHaveBeenCalledTimes(1);
      expect(downloadSetupFileSpy).toHaveBeenCalledWith(
        fileToDownload.filename,
        fileToDownload.displayName, // undefined in this case
        true // Expecting true as isBinary was true
      );

      // Handle the HTTP request
      const req = httpMock.expectOne(`/setup-files/${fileToDownload.filename}`);
      expect(req.request.method).toBe('GET');
      expect(req.request.responseType).toBe('blob'); // Check response type for binary
      req.flush(new Blob(['mock zip data'])); // Flush with a Blob for binary
      tick();
    }));
  });
});