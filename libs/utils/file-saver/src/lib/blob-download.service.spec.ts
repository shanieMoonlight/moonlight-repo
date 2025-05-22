import { TestBed } from '@angular/core/testing';
import { FileDownloadService, DownloadOptions } from './blob-download.service';

describe('FileDownloadService', () => {
  let service: FileDownloadService;
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
        revokeObjectURL: jest.fn(),
      } as unknown as typeof URL;
    }
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FileDownloadService],
    });
    service = TestBed.inject(FileDownloadService);

    // Reset mocks between tests
    jest.clearAllMocks();

    // Setup spies on the now-available methods
    createObjectURLSpy = jest.spyOn(URL, 'createObjectURL');
    revokeObjectURLSpy = jest.spyOn(URL, 'revokeObjectURL');
    appendChildSpy = jest
      .spyOn(document.body, 'appendChild')
      .mockImplementation(() => document.body);
    removeChildSpy = jest
      .spyOn(document.body, 'removeChild')
      .mockImplementation(() => document.body);
    clickSpy = jest.fn();

    // Mock createElement to return an element with a click spy
    const mockAnchor = {
      href: '',
      download: '',
      click: clickSpy,
    };
    createElementSpy = jest
      .spyOn(document, 'createElement')
      .mockReturnValue(mockAnchor as any);
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
        mimeType: 'text/plain',
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
        mimeType: 'text/plain',
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
        mimeType: 'text/plain',
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
        mimeType: 'text/scss',
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
        mimeType: 'text/scss',
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
        mimeType: 'text/scss',
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
        mimeType: 'text/scss',
      });
    });
  });

  //----------------------------------//

  describe('downloadJson', () => {
    it('should call downloadBlob with correct JSON mime type', () => {
      // Arrange
      const obj = { name: 'test', value: 123 };
      const spy = jest.spyOn(service, 'downloadBlob').mockReturnValue(true);

      // Act
      const result = service.downloadJson(obj);

      // Assert
      expect(spy).toHaveBeenCalledWith(JSON.stringify(obj, null, 2), {
        filename: 'data.json',
        mimeType: 'application/json',
      });
      expect(result).toBe(true);
    });

    //----------------------------------//

    it('should handle string input', () => {
      // Arrange
      const content = '{"name":"test"}';
      const spy = jest.spyOn(service, 'downloadBlob').mockReturnValue(true);

      // Act
      service.downloadJson(content);

      // Assert
      expect(spy).toHaveBeenCalledWith(content, {
        filename: 'data.json',
        mimeType: 'application/json',
      });
    });

    //- - - - - - - - - - - - - - - - - //

    it('should add .json extension if missing', () => {
      // Arrange
      const obj = { test: true };
      const spy = jest.spyOn(service, 'downloadBlob').mockReturnValue(true);

      // Act
      service.downloadJson(obj, 'data-file');

      // Assert
      expect(spy).toHaveBeenCalledWith(JSON.stringify(obj, null, 2), {
        filename: 'data-file.json',
        mimeType: 'application/json',
      });
    });

    //- - - - - - - - - - - - - - - - - //

    it('should not modify filename if it already has .json extension', () => {
      // Arrange
      const obj = { test: true };
      const spy = jest.spyOn(service, 'downloadBlob').mockReturnValue(true);

      // Act
      service.downloadJson(obj, 'data.json');

      // Assert
      expect(spy).toHaveBeenCalledWith(JSON.stringify(obj, null, 2), {
        filename: 'data.json',
        mimeType: 'application/json',
      });
    });
  });

  //- - - - - - - - - - - - - - - - - //

  describe('downloadCsv', () => {
    it('should call downloadBlob with correct CSV mime type', () => {
      // Arrange
      const content = 'name,age\nJohn,30\nJane,25';
      const spy = jest.spyOn(service, 'downloadBlob').mockReturnValue(true);

      // Act
      const result = service.downloadCsv(content);

      // Assert
      expect(spy).toHaveBeenCalledWith(content, {
        filename: 'data.csv',
        mimeType: 'text/csv',
      });
      expect(result).toBe(true);
    });

    //- - - - - - - - - - - - - - - - - //

    it('should add .csv extension if missing', () => {
      // Arrange
      const content = 'name,age\nJohn,30';
      const spy = jest.spyOn(service, 'downloadBlob').mockReturnValue(true);

      // Act
      service.downloadCsv(content, 'export');

      // Assert
      expect(spy).toHaveBeenCalledWith(content, {
        filename: 'export.csv',
        mimeType: 'text/csv',
      });
    });

    //- - - - - - - - - - - - - - - - - //

    it('should not modify filename if it already has .csv extension', () => {
      // Arrange
      const content = 'name,age\nJohn,30';
      const spy = jest.spyOn(service, 'downloadBlob').mockReturnValue(true);

      // Act
      service.downloadCsv(content, 'export.csv');

      // Assert
      expect(spy).toHaveBeenCalledWith(content, {
        filename: 'export.csv',
        mimeType: 'text/csv',
      });
    });
  });

  //----------------------------------//

  describe('downloadText', () => {
    it('should call downloadBlob with correct text mime type', () => {
      // Arrange
      const content = 'This is a plain text file';
      const spy = jest.spyOn(service, 'downloadBlob').mockReturnValue(true);

      // Act
      const result = service.downloadText(content);

      // Assert
      expect(spy).toHaveBeenCalledWith(content, {
        filename: 'data.txt',
        mimeType: 'text/plain',
      });
      expect(result).toBe(true);
    });

    //- - - - - - - - - - - - - - - - - //

    it('should add .txt extension if missing', () => {
      // Arrange
      const content = 'Simple text content';
      const spy = jest.spyOn(service, 'downloadBlob').mockReturnValue(true);

      // Act
      service.downloadText(content, 'notes');

      // Assert
      expect(spy).toHaveBeenCalledWith(content, {
        filename: 'notes.txt',
        mimeType: 'text/plain',
      });
    });

    //- - - - - - - - - - - - - - - - - //

    it('should not modify filename if it already has .txt extension', () => {
      // Arrange
      const content = 'Simple text content';
      const spy = jest.spyOn(service, 'downloadBlob').mockReturnValue(true);

      // Act
      service.downloadText(content, 'notes.txt');

      // Assert
      expect(spy).toHaveBeenCalledWith(content, {
        filename: 'notes.txt',
        mimeType: 'text/plain',
      });
    });
  });

  //----------------------------------//

  describe('downloadHtml', () => {
    it('should call downloadBlob with correct HTML mime type', () => {
      // Arrange
      const content = '<html><body><h1>Hello</h1></body></html>';
      const spy = jest.spyOn(service, 'downloadBlob').mockReturnValue(true);

      // Act
      const result = service.downloadHtml(content);

      // Assert
      expect(spy).toHaveBeenCalledWith(content, {
        filename: 'page.html',
        mimeType: 'text/html',
      });
      expect(result).toBe(true);
    });

    //- - - - - - - - - - - - - - - - - //

    it('should add .html extension if missing', () => {
      // Arrange
      const content = '<div>Simple HTML</div>';
      const spy = jest.spyOn(service, 'downloadBlob').mockReturnValue(true);

      // Act
      service.downloadHtml(content, 'document');

      // Assert
      expect(spy).toHaveBeenCalledWith(content, {
        filename: 'document.html',
        mimeType: 'text/html',
      });
    });

    //- - - - - - - - - - - - - - - - - //

    it('should not modify filename if it already has .html extension', () => {
      // Arrange
      const content = '<div>Simple HTML</div>';
      const spy = jest.spyOn(service, 'downloadBlob').mockReturnValue(true);

      // Act
      service.downloadHtml(content, 'document.html');

      // Assert
      expect(spy).toHaveBeenCalledWith(content, {
        filename: 'document.html',
        mimeType: 'text/html',
      });
    });

    //- - - - - - - - - - - - - - - - - //

    it('should not modify filename if it already has .htm extension', () => {
      // Arrange
      const content = '<div>Simple HTML</div>';
      const spy = jest.spyOn(service, 'downloadBlob').mockReturnValue(true);

      // Act
      service.downloadHtml(content, 'document.htm');

      // Assert
      expect(spy).toHaveBeenCalledWith(content, {
        filename: 'document.htm',
        mimeType: 'text/html',
      });
    });
  });
});
