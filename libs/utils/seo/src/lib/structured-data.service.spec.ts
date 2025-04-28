import { DOCUMENT } from '@angular/common';
import { TestBed } from '@angular/core/testing';
import { SeoConfig } from '@spider-baby/utils-seo/config';
import {  ArticleSchema,
  CodeSchema,
  FAQPageSchema,
  OrganizationSchema,
  SoftwareApplicationSchema, StructuredDataSchema, StructuredDataService
} from './structured-data.service';

describe('StructuredDataService', () => {
  let service: StructuredDataService;
  let documentMock: Document;
  let seoConfigMock: SeoConfig;

  // Mock document elements and methods
  const mockHeadElement = {
    appendChild: jest.fn(),
    querySelectorAll: jest.fn().mockReturnValue([]),
  };

  beforeEach(() => {
    // Reset mock calls
    jest.clearAllMocks();
  
    // Create document mock
    documentMock = {
      head: mockHeadElement as unknown as HTMLElement,
      createElement: jest.fn().mockReturnValue({
        setAttribute: jest.fn(),
        type: null,
        text: null,
      }),
      querySelector: jest.fn((selector: string) => {
        if (selector === 'head') {
          return mockHeadElement;
        }
        return null;
      }),
      querySelectorAll: jest.fn((selector: string) => {
        if (selector === 'script[type="application/ld+json"]') {
          return mockHeadElement.querySelectorAll(selector);
        }
        return [];
      }),
    } as unknown as Document;
  
    // Create SeoConfig mock
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
        StructuredDataService,
        { provide: DOCUMENT, useValue: documentMock },
        { provide: SeoConfig, useValue: seoConfigMock },
      ],
    });
  
    service = TestBed.inject(StructuredDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('addStructuredData', () => {
    it('should add JSON-LD script to document head', () => {
      const testSchema: StructuredDataSchema = {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        // 'name': 'Test Page'
      };

      service.addStructuredData(testSchema);

      // Check if script was created
      expect(documentMock.createElement).toHaveBeenCalledWith('script');

      // Check script properties
      const scriptElement = (documentMock.createElement as jest.Mock).mock.results[0].value;
      expect(scriptElement.type).toBe('application/ld+json');
      expect(scriptElement.text).toBe(JSON.stringify(testSchema));

      // Check if script was added to head
      expect(mockHeadElement.appendChild).toHaveBeenCalledWith(scriptElement);
    });

    it('should remove existing script with same ID if provided', () => {
      // Mock existing script
      const existingScript = { remove: jest.fn() };
      (documentMock.querySelector as jest.Mock).mockReturnValueOnce(existingScript);

      const testSchema = {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        'name': 'Test Page'
      }as StructuredDataSchema;

      service.addStructuredData(testSchema, 'unique-id');

      // Check if existing script was queried and removed
      expect(documentMock.querySelector).toHaveBeenCalledWith('script[data-schema-id="unique-id"]');
      expect(existingScript.remove).toHaveBeenCalled();

      // Check if new script was created and added
      expect(documentMock.createElement).toHaveBeenCalledWith('script');
      expect(mockHeadElement.appendChild).toHaveBeenCalled();

      // Check if ID was set on new script
      const scriptElement = (documentMock.createElement as jest.Mock).mock.results[0].value;
      expect(scriptElement.setAttribute).toHaveBeenCalledWith('data-schema-id', 'unique-id');
    });
  });

  describe('addLibraryStructuredData', () => {
    it('should add SoftwareApplication schema with config values', () => {
      // Spy on addStructuredData method
      const addStructuredDataSpy = jest.spyOn(service, 'addStructuredData');

      service.addLibraryStructuredData();

      // Check if addStructuredData was called with correct schema
      expect(addStructuredDataSpy).toHaveBeenCalled();

      // Get the schema that was passed
      const schema = addStructuredDataSpy.mock.calls[0][0] as SoftwareApplicationSchema;
      const id = addStructuredDataSpy.mock.calls[0][1];

      // Verify schema structure
      expect(schema['@type']).toBe('SoftwareApplication');
      expect(schema.name).toBe('Test App');
      expect(schema.applicationCategory).toBe('DeveloperApplication');
      expect(schema.description).toBe('Test Description');
      expect(schema.author?.name).toBe('Test Org');

      // Verify ID
      expect(id).toBe('library-app');
    });
  });

  describe('addDocumentationStructuredData', () => {
    it('should add TechArticle schema with provided values', () => {
      const addStructuredDataSpy = jest.spyOn(service, 'addStructuredData')

      service.addDocumentationStructuredData(
        'Test Title',
        'Test Article Description',
        'https://test.com/article'
      );

      // Check if addStructuredData was called
      expect(addStructuredDataSpy).toHaveBeenCalled();

      // Get the schema that was passed
      const schema = addStructuredDataSpy.mock.calls[0][0]as ArticleSchema;
      const id = addStructuredDataSpy.mock.calls[0][1];

      // Verify schema structure
      expect(schema['@type']).toBe('TechArticle');
      expect(schema.headline).toBe('Test Title');
      expect(schema.description).toBe('Test Article Description');
      expect(schema.author.name).toBe('Test Org Team');
      expect(schema.datePublished).toBe('2023-01-01');
      expect(schema.mainEntityOfPage).toBe('https://test.com/article');

      // Verify ID
      expect(id).toBe('documentation');
    });
  });

  describe('addFAQStructuredData', () => {
    it('should add FAQPage schema with provided questions and answers', () => {
      const addStructuredDataSpy = jest.spyOn(service, 'addStructuredData');

      const faqs = [
        { question: 'Test Question 1', answer: 'Test Answer 1' },
        { question: 'Test Question 2', answer: 'Test Answer 2' }
      ];

      service.addFAQStructuredData(faqs);

      // Check if addStructuredData was called
      expect(addStructuredDataSpy).toHaveBeenCalled();

      // Get the schema that was passed
      const schema = addStructuredDataSpy.mock.calls[0][0]as FAQPageSchema;
      const id = addStructuredDataSpy.mock.calls[0][1];

      // Verify schema structure
      expect(schema['@type']).toBe('FAQPage');
      expect(schema.mainEntity.length).toBe(2);
      expect(schema.mainEntity[0]['@type']).toBe('Question');
      expect(schema.mainEntity[0].name).toBe('Test Question 1');
      expect(schema.mainEntity[0].acceptedAnswer.text).toBe('Test Answer 1');

      // Verify ID
      expect(id).toBe('faqs');
    });
  });

  describe('addCodeRepositoryStructuredData', () => {
    it('should add SoftwareSourceCode schema with repo URL', () => {
      const addStructuredDataSpy = jest.spyOn(service, 'addStructuredData');

      service.addCodeRepositoryStructuredData('https://github.com/test/repo');

      // Check if addStructuredData was called
      expect(addStructuredDataSpy).toHaveBeenCalled();

      // Get the schema that was passed
      const schema = addStructuredDataSpy.mock.calls[0][0]as CodeSchema;
      const id = addStructuredDataSpy.mock.calls[0][1];

      // Verify schema structure
      expect(schema['@type']).toBe('SoftwareSourceCode');
      expect(schema.codeRepository).toBe('https://github.com/test/repo');
      expect(schema.programmingLanguage.name).toBe('TypeScript');
      expect(schema.description).toBe('Test Description');

      // Verify ID
      expect(id).toBe('code-repo');
    });
  });

  describe('addOrganizationStructuredData', () => {
    it('should add Organization schema with config values', () => {
      const addStructuredDataSpy = jest.spyOn(service, 'addStructuredData');

      service.addOrganizationStructuredData();

      // Check if addStructuredData was called
      expect(addStructuredDataSpy).toHaveBeenCalled();

      // Get the schema that was passed
      const schema = addStructuredDataSpy.mock.calls[0][0] as OrganizationSchema
      const id = addStructuredDataSpy.mock.calls[0][1];

      // Verify schema structure
      expect(schema['@type']).toBe('Organization');
      expect(schema.name).toBe('Test Org');
      expect(schema.url).toBe('https://test.com/');
      expect(schema.sameAs).toEqual(['https://example.com']);

      // Verify ID
      expect(id).toBe('organization');
    });
  });

  describe('removeAllStructuredData', () => {
    it('should remove all JSON-LD script tags', () => {
      // Mock script elements to remove
      const scriptElements = [
        { remove: jest.fn() },
        { remove: jest.fn() }
      ];

      // Mock querySelectorAll to return fake scripts
      mockHeadElement.querySelectorAll.mockReturnValueOnce(scriptElements);

      service.removeAllStructuredData();

      // Check if scripts were queried
      expect(mockHeadElement.querySelectorAll).toHaveBeenCalledWith('script[type="application/ld+json"]');

      // Check if all scripts were removed
      expect(scriptElements[0].remove).toHaveBeenCalled();
      expect(scriptElements[1].remove).toHaveBeenCalled();
    });

    it('should handle case when no scripts exist', () => {
      // Mock empty array of scripts
      mockHeadElement.querySelectorAll.mockReturnValueOnce([]);

      // This should not throw
      expect(() => {
        service.removeAllStructuredData();
      }).not.toThrow();

      expect(mockHeadElement.querySelectorAll).toHaveBeenCalled();
    });
  });
});