import { TestBed } from '@angular/core/testing';
import { SeoService } from './seo.service';
import { Meta, Title } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';
import { SeoConfig } from '@spider-baby/utils-seo/config';

describe('SeoService', () => {
  let service: SeoService;
  let metaMock: jest.Mocked<Meta>;
  let titleMock: jest.Mocked<Title>;
  let documentMock: Document;
  let seoConfigMock: SeoConfig;

  const mockHeadElement = {
    querySelector: jest.fn(),
    appendChild: jest.fn()
  };

  beforeEach(() => {
    // Create mocks
    metaMock = {
      updateTag: jest.fn(),
      removeTag: jest.fn(),
      getTag: jest.fn(),
      addTag: jest.fn(),
      addTags: jest.fn(),
      getTags: jest.fn()
    } as unknown as jest.Mocked<Meta>;

    titleMock = {
      setTitle: jest.fn(),
      getTitle: jest.fn()
    } as unknown as jest.Mocked<Title>;

    documentMock = {
      querySelector: jest.fn().mockReturnValue(null),
      createElement: jest.fn().mockReturnValue({
        setAttribute: jest.fn(),
      }),
      head: mockHeadElement
    } as unknown as Document;

    seoConfigMock = {
      appName: 'Test App',
      appDescription: 'Test Description',
      organization: 'Test Org',
      baseUrl: 'https://test.com/',
      defaultLogoFilePath: 'https://test.com/logo.png',
      publishedDate: '2023-01-01',
      keywords: ['test', 'app'],
      socialLinks: ['https://example.com'],
      defaultOgImageUrl: 'https://test.com/og-image.png',
      twitterHandle: '@testapp',
      titleSuffix: ' | Test App'
    } as SeoConfig;

    TestBed.configureTestingModule({
      providers: [
        SeoService,
        { provide: Meta, useValue: metaMock },
        { provide: Title, useValue: titleMock },
        { provide: DOCUMENT, useValue: documentMock },
        { provide: SeoConfig, useValue: seoConfigMock }
      ]
    });

    service = TestBed.inject(SeoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('updateMetadata', () => {
    it('should set the document title', () => {
      service.updateMetadata({ title: 'Custom Title' });
      expect(titleMock.setTitle).toHaveBeenCalledWith('Custom Title');
    });

    it('should use default title from config when no title provided', () => {
      service.updateMetadata({});
      expect(titleMock.setTitle).toHaveBeenCalledWith('Test App');
    });

    it('should update meta tags with provided values', () => {
      service.updateMetadata({
        title: 'Custom Title',
        description: 'Custom Description',
        image: 'https://test.com/custom-image.jpg',
        url: 'https://test.com/custom-page'
      });

      // Check that name meta tags are updated
      expect(metaMock.updateTag).toHaveBeenCalledWith({
        name: 'description',
        content: 'Custom Description'
      });

      // Check that property meta tags are updated
      expect(metaMock.updateTag).toHaveBeenCalledWith({
        property: 'og:title',
        content: 'Custom Title'
      });

      // Check image was updated
      expect(metaMock.updateTag).toHaveBeenCalledWith({
        property: 'og:image',
        content: 'https://test.com/custom-image.jpg'
      });

      // Check URL was updated
      expect(metaMock.updateTag).toHaveBeenCalledWith({
        property: 'og:url',
        content: 'https://test.com/custom-page'
      });
    });

    it('should use default values from config when not provided', () => {
      service.updateMetadata({});

      // Check description defaults to config value
      expect(metaMock.updateTag).toHaveBeenCalledWith({
        name: 'description', 
        content: 'Test Description'
      });

      // Check image defaults to config value
      expect(metaMock.updateTag).toHaveBeenCalledWith({
        property: 'og:image',
        content: 'https://test.com/logo.png'
      });

      // Check URL defaults to config value
      expect(metaMock.updateTag).toHaveBeenCalledWith({
        property: 'og:url',
        content: 'https://test.com/'
      });
    });

    it('should include keywords from config', () => {
      service.updateMetadata({});
      
      expect(metaMock.updateTag).toHaveBeenCalledWith({
        name: 'keywords',
        content: 'test, app'
      });
    });
  });

  describe('addCanonicalLink', () => {
    it('should create a new canonical link if none exists', () => {
      const mockLink = { setAttribute: jest.fn() };
      (documentMock.createElement as jest.Mock).mockReturnValue(mockLink);
      (documentMock.querySelector as jest.Mock).mockReturnValue(null);

      service.addCanonicalLink('https://test.com/page');

      expect(documentMock.createElement).toHaveBeenCalledWith('link');
      expect(mockLink.setAttribute).toHaveBeenCalledWith('rel', 'canonical');
      expect(mockLink.setAttribute).toHaveBeenCalledWith('href', 'https://test.com/page');
      expect(mockHeadElement.appendChild).toHaveBeenCalledWith(mockLink);
    });

    it('should update existing canonical link if one exists', () => {
      const existingLink = { setAttribute: jest.fn(), remove: jest.fn() };
      const newLink = { setAttribute: jest.fn() };
      
      (documentMock.querySelector as jest.Mock)
        .mockReturnValueOnce(existingLink) // First call for finding existing link
        .mockReturnValueOnce(existingLink); // Second call for head.querySelector
      
      (documentMock.createElement as jest.Mock).mockReturnValue(newLink);
      (mockHeadElement.querySelector as jest.Mock).mockReturnValue(existingLink);

      service.addCanonicalLink('https://test.com/updated-page');

      expect(existingLink.remove).toHaveBeenCalled();
      expect(newLink.setAttribute).toHaveBeenCalledWith('rel', 'canonical');
      expect(newLink.setAttribute).toHaveBeenCalledWith('href', 'https://test.com/updated-page');
      expect(mockHeadElement.appendChild).toHaveBeenCalledWith(newLink);
    });

    it('should do nothing if document head is not available', () => {
      const documentWithoutHead = { ...documentMock, head: null };
      const mockLink = { setAttribute: jest.fn() };
      
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        providers: [
          SeoService,
          { provide: Meta, useValue: metaMock },
          { provide: Title, useValue: titleMock },
          { provide: DOCUMENT, useValue: documentWithoutHead },
          { provide: SeoConfig, useValue: seoConfigMock }
        ]
      });
      
      const serviceWithoutHead = TestBed.inject(SeoService);
      (documentWithoutHead.createElement as jest.Mock).mockReturnValue(mockLink);
      
      serviceWithoutHead.addCanonicalLink('https://test.com/page');
      
      expect(documentWithoutHead.createElement).toHaveBeenCalledWith('link');
      expect(mockLink.setAttribute).toHaveBeenCalledWith('rel', 'canonical');
      expect(mockLink.setAttribute).toHaveBeenCalledWith('href', 'https://test.com/page');
      // It shouldn't try to append to head
      expect(mockHeadElement.appendChild).not.toHaveBeenCalled();
    });
  });
});