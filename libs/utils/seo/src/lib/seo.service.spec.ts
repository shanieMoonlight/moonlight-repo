import { TestBed } from '@angular/core/testing';
import { SeoService } from './seo.service';
import { Meta, Title } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';
import { SeoConfig, SeoConfigService } from '@spider-baby/utils-seo/config';

// Create a mock SeoConfig object
const mockSeoConfig: SeoConfig = SeoConfig.create({
  appName: 'Test App',
  appDescription: 'Test Description',
  organization: 'Test Org',
  baseUrl: 'http://localhost',
  defaultLogoFilePath: 'http://localhost:4666//logo.png',
  publishedDate: '2025-01-01',
  keywords: ['test', 'seo'],
  socialLinks: [],
  defaultOgImageUrl: '/assets/og-image.png',
  twitterHandle: '@test',
  titleSuffix: ' | Test App',
});

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
    // Create fresh mocks for each test
    metaMock = {
      updateTag: jest.fn(),
      removeTag: jest.fn(),
      getTag: jest.fn(),
      addTag: jest.fn(),
      addTags: jest.fn(),
      getTags: jest.fn(),
    } as unknown as jest.Mocked<Meta>;
  
    titleMock = {
      setTitle: jest.fn(),
      getTitle: jest.fn(),
    } as unknown as jest.Mocked<Title>;
  
    documentMock = {
      querySelector: jest.fn((selector: string) => {
        if (selector === 'head') {
          return { ...mockHeadElement }; // Return a fresh copy of mockHeadElement
        }
        return null;
      }),
      createElement: jest.fn().mockReturnValue({
        setAttribute: jest.fn(),
      }),
      head: { ...mockHeadElement } as unknown as HTMLElement, // Return a fresh copy of mockHeadElement
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
      titleSuffix: ' | Test App',
    } as SeoConfig;
  
    TestBed.configureTestingModule({
      providers: [
        SeoService,
        { provide: Meta, useValue: metaMock },
        { provide: Title, useValue: titleMock },
        { provide: DOCUMENT, useValue: documentMock },
        { provide: SeoConfigService, useValue: mockSeoConfig }
      ],
    });
  
    service = TestBed.inject(SeoService);
  
    // Clear all mocks before each test
    jest.clearAllMocks();
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
      (mockHeadElement.querySelector as jest.Mock).mockReturnValue(null);

      service.addCanonicalLink('https://test.com/page');

      expect(documentMock.createElement).toHaveBeenCalledWith('link');
      expect(mockLink.setAttribute).toHaveBeenCalledWith('rel', 'canonical');
      expect(mockLink.setAttribute).toHaveBeenCalledWith('href', 'https://test.com/page');
      expect(mockHeadElement.appendChild).toHaveBeenCalledWith(mockLink);
    });

    it('should update existing canonical link if one exists', () => {
      const existingLink = { setAttribute: jest.fn(), remove: jest.fn() };
      const newLink = { setAttribute: jest.fn() };

      (mockHeadElement.querySelector as jest.Mock).mockReturnValue(existingLink);
      (documentMock.createElement as jest.Mock).mockReturnValue(newLink);

      service.addCanonicalLink('https://test.com/updated-page');

      expect(existingLink.remove).toHaveBeenCalled();
      expect(newLink.setAttribute).toHaveBeenCalledWith('rel', 'canonical');
      expect(newLink.setAttribute).toHaveBeenCalledWith('href', 'https://test.com/updated-page');
      expect(mockHeadElement.appendChild).toHaveBeenCalledWith(newLink);
    });

    it('should do nothing if document head is not available', () => {
      const documentWithoutHead = {
        ...documentMock,
        querySelector: jest.fn((selector: string) => {
          if (selector === 'head') {
            return null; // Simulate no head element
          }
          return null;
        }),
      };
      
      const mockLink = { setAttribute: jest.fn() };

      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        providers: [
          SeoService,
          { provide: Meta, useValue: metaMock },
          { provide: Title, useValue: titleMock },
          { provide: DOCUMENT, useValue: documentWithoutHead },
          { provide: SeoConfig, useValue: seoConfigMock },
        ],
      });

      const serviceWithoutHead = TestBed.inject(SeoService);
      (documentWithoutHead.createElement as jest.Mock).mockReturnValue(mockLink);

      serviceWithoutHead.addCanonicalLink('https://test.com/page');
      
      console.log('documentWithoutHead', documentWithoutHead.head,  documentWithoutHead);

      expect(documentWithoutHead.createElement).toHaveBeenCalledWith('link');
      expect(mockLink.setAttribute).toHaveBeenCalledWith('rel', 'canonical');
      expect(mockLink.setAttribute).toHaveBeenCalledWith('href', 'https://test.com/page');
      expect(mockHeadElement.appendChild).not.toHaveBeenCalled();
    });
  });
});