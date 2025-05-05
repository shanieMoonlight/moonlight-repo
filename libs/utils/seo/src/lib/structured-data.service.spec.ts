import { DOCUMENT } from '@angular/common';
import { TestBed } from '@angular/core/testing';
import { SeoConfig, SeoConfigService } from '@spider-baby/utils-seo/config';
import {
  ArticleSchema,
  CodeSchema,
  FAQPageSchema,
  OrganizationSchema,
  SoftwareApplicationSchema, StructuredDataSchema, StructuredDataService
} from './structured-data.service';

// --- Use this single mock config object ---
const mockSeoConfig: SeoConfig = SeoConfig.create({
  appName: 'Test App',
  appDescription: 'Test Description',
  organization: 'Test Org',
  baseUrl: 'http://localhost', // Will become http://localhost/ after validation
  defaultLogoFilePath: 'http://localhost:4666//logo.png',
  publishedDate: '2025-01-01',
  keywords: ['test', 'seo'],
  socialLinks: ['https://example.com/social'], // Added an example social link
  defaultOgImageUrl: '/assets/og-image.png',
  twitterHandle: '@test',
});

describe('StructuredDataService', () => {
  let service: StructuredDataService;
  let documentMock: Document;
  // Removed seoConfigMock variable

  // Mock document elements and methods
  const mockHeadElement = {
    appendChild: jest.fn(),
    querySelectorAll: jest.fn().mockReturnValue([]),
    querySelector: jest.fn() // Added mock for querySelector on head
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
        // Allow querySelector for script ID check
        if (selector.startsWith('script[data-schema-id=')) {
           return mockHeadElement.querySelector(selector); // Delegate to head mock
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

    // --- Removed local seoConfigMock definition ---

    TestBed.configureTestingModule({
      providers: [
        StructuredDataService,
        { provide: DOCUMENT, useValue: documentMock },
        // --- Use the global mockSeoConfig consistently ---
        { provide: SeoConfig, useValue: mockSeoConfig },
        { provide: SeoConfigService, useValue: mockSeoConfig } // Assuming SeoConfigService just provides SeoConfig
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
        // name: 'Test Page' // Added name for completeness
      };

      service.addStructuredData(testSchema);

      expect(documentMock.createElement).toHaveBeenCalledWith('script');
      const scriptElement = (documentMock.createElement as jest.Mock).mock.results[0].value;
      expect(scriptElement.type).toBe('application/ld+json');
      expect(scriptElement.text).toBe(JSON.stringify(testSchema));
      expect(mockHeadElement.appendChild).toHaveBeenCalledWith(scriptElement);
    });

    it('should remove existing script with same ID if provided', () => {
      const existingScript = { remove: jest.fn(), setAttribute: jest.fn(), type: '', text: '' };
      // Mock querySelector on document *and* head to find the script by ID
      (documentMock.querySelector as jest.Mock).mockImplementation((selector: string) => {
         if (selector === 'script[data-schema-id="unique-id"]') return existingScript;
         return null;
      });
       (mockHeadElement.querySelector as jest.Mock).mockImplementation((selector: string) => {
         if (selector === 'script[data-schema-id="unique-id"]') return existingScript;
         return null;
      });


      const testSchema: StructuredDataSchema = {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        // name: 'Test Page'
      };
      const scriptId = 'unique-id';

      service.addStructuredData(testSchema, scriptId);

      // Check if existing script was queried and removed
      // Note: The service might query document or document.head
      expect(documentMock.querySelector).toHaveBeenCalledWith(`script[data-schema-id="${scriptId}"]`);
      // Or potentially: expect(mockHeadElement.querySelector).toHaveBeenCalledWith(`script[data-schema-id="${scriptId}"]`);
      expect(existingScript.remove).toHaveBeenCalled();

      // Check if new script was created and added
      expect(documentMock.createElement).toHaveBeenCalledWith('script');
      expect(mockHeadElement.appendChild).toHaveBeenCalled();
      const scriptElement = (documentMock.createElement as jest.Mock).mock.results[0].value;
      expect(scriptElement.setAttribute).toHaveBeenCalledWith('data-schema-id', scriptId);
    });
  });

  describe('addLibraryStructuredData', () => {
    it('should add SoftwareApplication schema with config values', () => {
      const addStructuredDataSpy = jest.spyOn(service, 'addStructuredData');
      service.addLibraryStructuredData();
      expect(addStructuredDataSpy).toHaveBeenCalled();
      const schema = addStructuredDataSpy.mock.calls[0][0] as SoftwareApplicationSchema;
      const id = addStructuredDataSpy.mock.calls[0][1];

      expect(schema['@type']).toBe('SoftwareApplication');
      // --- Use mockSeoConfig properties ---
      expect(schema.name).toBe(mockSeoConfig.appName);
      expect(schema.applicationCategory).toBe('DeveloperApplication');
      expect(schema.description).toBe(mockSeoConfig.appDescription);
      expect(schema.author?.name).toBe(mockSeoConfig.organization);
      expect(id).toBe('library-app');
    });
  });

  describe('addDocumentationStructuredData', () => {
    it('should add TechArticle schema with provided values and config defaults', () => {
      const addStructuredDataSpy = jest.spyOn(service, 'addStructuredData');
      const articleTitle = 'Test Title';
      const articleDesc = 'Test Article Description';
      const articleUrl = 'https://test.com/article'; // Example URL

      service.addDocumentationStructuredData(articleTitle, articleDesc, articleUrl);
      expect(addStructuredDataSpy).toHaveBeenCalled();
      const schema = addStructuredDataSpy.mock.calls[0][0] as ArticleSchema;
      const id = addStructuredDataSpy.mock.calls[0][1];

      expect(schema['@type']).toBe('TechArticle');
      expect(schema.headline).toBe(articleTitle);
      expect(schema.description).toBe(articleDesc);
      // --- Use mockSeoConfig properties ---
      expect(schema.author.name).toBe(`${mockSeoConfig.organization} Team`); // Assuming service adds " Team"
      expect(schema.datePublished).toBe(mockSeoConfig.publishedDate);
      expect(schema.mainEntityOfPage).toBe(articleUrl);
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
      expect(addStructuredDataSpy).toHaveBeenCalled();
      const schema = addStructuredDataSpy.mock.calls[0][0] as FAQPageSchema;
      const id = addStructuredDataSpy.mock.calls[0][1];

      expect(schema['@type']).toBe('FAQPage');
      expect(schema.mainEntity.length).toBe(faqs.length);
      expect(schema.mainEntity[0]['@type']).toBe('Question');
      expect(schema.mainEntity[0].name).toBe(faqs[0].question);
      expect(schema.mainEntity[0].acceptedAnswer.text).toBe(faqs[0].answer);
      expect(id).toBe('faqs');
    });
  });

  describe('addCodeRepositoryStructuredData', () => {
    it('should add SoftwareSourceCode schema with repo URL and config defaults', () => {
      const addStructuredDataSpy = jest.spyOn(service, 'addStructuredData');
      const repoUrl = 'https://github.com/test/repo';
      service.addCodeRepositoryStructuredData(repoUrl);
      expect(addStructuredDataSpy).toHaveBeenCalled();
      const schema = addStructuredDataSpy.mock.calls[0][0] as CodeSchema;
      const id = addStructuredDataSpy.mock.calls[0][1];

      expect(schema['@type']).toBe('SoftwareSourceCode');
      expect(schema.codeRepository).toBe(repoUrl);
      expect(schema.programmingLanguage.name).toBe('TypeScript'); // Assuming service defaults this
      // --- Use mockSeoConfig properties ---
      expect(schema.description).toBe(mockSeoConfig.appDescription);
      expect(id).toBe('code-repo');
    });
  });

  describe('addOrganizationStructuredData', () => {
    it('should add Organization schema with config values', () => {
      const addStructuredDataSpy = jest.spyOn(service, 'addStructuredData');
      service.addOrganizationStructuredData();
      expect(addStructuredDataSpy).toHaveBeenCalled();
      const schema = addStructuredDataSpy.mock.calls[0][0] as OrganizationSchema;
      const id = addStructuredDataSpy.mock.calls[0][1];

      expect(schema['@type']).toBe('Organization');
      // --- Use mockSeoConfig properties ---
      expect(schema.name).toBe(mockSeoConfig.organization);
      expect(schema.url).toBe(mockSeoConfig.baseUrl); // Uses validated baseUrl
      expect(schema.sameAs).toEqual(mockSeoConfig.socialLinks);
      expect(id).toBe('organization');
    });
  });

  describe('removeAllStructuredData', () => {
    it('should remove all JSON-LD script tags', () => {
      const scriptElements = [ { remove: jest.fn() }, { remove: jest.fn() } ];
      mockHeadElement.querySelectorAll.mockReturnValueOnce(scriptElements);
      service.removeAllStructuredData();
      expect(mockHeadElement.querySelectorAll).toHaveBeenCalledWith('script[type="application/ld+json"]');
      expect(scriptElements[0].remove).toHaveBeenCalled();
      expect(scriptElements[1].remove).toHaveBeenCalled();
    });

    it('should handle case when no scripts exist', () => {
      mockHeadElement.querySelectorAll.mockReturnValueOnce([]);
      expect(() => { service.removeAllStructuredData(); }).not.toThrow();
      expect(mockHeadElement.querySelectorAll).toHaveBeenCalled();
    });
  });
});