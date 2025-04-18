import { TestBed } from '@angular/core/testing';
import { BlobDownloadService, DownloadOptions } from './blob-download.service';

describe('BlobDownloadService', () => {
  let service: BlobDownloadService;
  let createObjectURLSpy: jest.SpyInstance;
  let revokeObjectURLSpy: jest.SpyInstance;
  let appendChildSpy: jest.SpyInstance;
  let removeChildSpy: jest.SpyInstance;
  let clickSpy: jest.Mock;
  let createElementSpy: jest.SpyInstance;


  //----------------------------------//

  beforeAll(() => {
    // Mock the global URL object if it doesn't exist
    if (typeof URL.createObjectURL === 'undefined') {
      global.URL = {
        createObjectURL: jest.fn().mockReturnValue('blob:mock-url'),
        revokeObjectURL: jest.fn()
      } as unknown as typeof URL;
    }
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BlobDownloadService]
    });
    service = TestBed.inject(BlobDownloadService);

    // Reset mocks between tests
    jest.clearAllMocks();
    
    // Setup spies on the now-available methods
    createObjectURLSpy = jest.spyOn(URL, 'createObjectURL');
    revokeObjectURLSpy = jest.spyOn(URL, 'revokeObjectURL');
    appendChildSpy = jest.spyOn(document.body, 'appendChild').mockImplementation(() => document.body);
    removeChildSpy = jest.spyOn(document.body, 'removeChild').mockImplementation(() => document.body);
    clickSpy = jest.fn();

    // Mock createElement to return an element with a click spy
    const mockAnchor = {
      href: '',
      download: '',
      click: clickSpy
    };
    createElementSpy = jest.spyOn(document, 'createElement').mockReturnValue(mockAnchor as any);
  });

  //----------------------------------//

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  //----------------------------------//

  describe('downloadBlob', () => {
    it('should create and trigger download for string content', () => {
      // Arrange
      const content = 'Test content';
      const options: DownloadOptions = {
        filename: 'test.txt',
        mimeType: 'text/plain'
      };

      // Act
      const result = service.downloadBlob(content, options);

      // Assert
      expect(createElementSpy).toHaveBeenCalledWith('a');
      expect(clickSpy).toHaveBeenCalled();
      expect(appendChildSpy).toHaveBeenCalled();
      expect(removeChildSpy).toHaveBeenCalled();
      expect(createObjectURLSpy).toHaveBeenCalled();
      expect(revokeObjectURLSpy).toHaveBeenCalled();
      expect(result).toBe(true);
    });

    //----------------------------------//

    it('should create and trigger download for Blob content', () => {
      // Arrange
      const content = new Blob(['Blob content'], { type: 'text/plain' });
      const options: DownloadOptions = {
        filename: 'blob.txt',
        mimeType: 'text/plain'
      };

      // Act
      const result = service.downloadBlob(content, options);

      // Assert
      expect(createElementSpy).toHaveBeenCalledWith('a');
      expect(clickSpy).toHaveBeenCalled();
      expect(result).toBe(true);
    });

    //- - - - - - - - - - - - - - - - - //

    it('should handle errors gracefully', () => {
      // Arrange
      createObjectURLSpy.mockImplementation(() => {
        throw new Error('Test error');
      });
      const options: DownloadOptions = {
        filename: 'error.txt',
        mimeType: 'text/plain'
      };

      // Act
      const result = service.downloadBlob('content', options);

      // Assert
      expect(result).toBe(false);
    });
  });

  //----------------------------------//

  describe('downloadScss', () => {
    it('should call downloadBlob with correct SCSS mime type', () => {
      // Arrange
      const content = '$primary: #ff0000;';
      const filename = 'theme';
      const spy = jest.spyOn(service, 'downloadBlob').mockReturnValue(true);

      // Act
      const result = service.downloadScss(content, filename);

      // Assert
      expect(spy).toHaveBeenCalledWith(content, {
        filename: 'theme.scss',
        mimeType: 'text/scss'
      });
      expect(result).toBe(true);
    });

    //----------------------------------//

    it('should add .scss extension if missing', () => {
      // Arrange
      const content = '$primary: #ff0000;';
      const spy = jest.spyOn(service, 'downloadBlob').mockReturnValue(true);

      // Act
      service.downloadScss(content, 'theme-file');

      // Assert
      expect(spy).toHaveBeenCalledWith(content, {
        filename: 'theme-file.scss',
        mimeType: 'text/scss'
      });
    });

    //- - - - - - - - - - - - - - - - - //

    it('should not modify filename if it already has .scss extension', () => {
      // Arrange
      const content = '$primary: #ff0000;';
      const spy = jest.spyOn(service, 'downloadBlob').mockReturnValue(true);

      // Act
      service.downloadScss(content, 'theme.scss');

      // Assert
      expect(spy).toHaveBeenCalledWith(content, {
        filename: 'theme.scss',
        mimeType: 'text/scss'
      });
    });

    //- - - - - - - - - - - - - - - - - //

    it('should handle case-insensitive .scss extension check', () => {
      // Arrange
      const content = '$primary: #ff0000;';
      const spy = jest.spyOn(service, 'downloadBlob').mockReturnValue(true);

      // Act
      service.downloadScss(content, 'theme.SCSS');

      // Assert
      expect(spy).toHaveBeenCalledWith(content, {
        filename: 'theme.SCSS',
        mimeType: 'text/scss'
      });
    });
  });
});