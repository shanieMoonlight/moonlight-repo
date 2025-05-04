import { TestBed } from '@angular/core/testing';
import { UrlUtilsService } from './url.service';
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

describe('UrlService', () => {
  let service: UrlUtilsService;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [
      UrlUtilsService,
      { provide: SeoConfig, useValue: mockSeoConfig },
      { provide: SeoConfigService, useValue: mockSeoConfig }
    ],}); // Basic setup, service is root provided
    service = TestBed.inject(UrlUtilsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('combine', () => {
    it('should combine base and path correctly', () => {
      expect(service.combine('http://base.com', 'path')).toBe('http://base.com/path');
    });

    it('should handle base ending with slash', () => {
      expect(service.combine('http://base.com/', 'path')).toBe('http://base.com/path');
    });

    it('should handle path starting with slash', () => {
      expect(service.combine('http://base.com', '/path')).toBe('http://base.com/path');
    });

    it('should handle both base ending and path starting with slash (avoid double slash)', () => {
      expect(service.combine('http://base.com/', '/path')).toBe('http://base.com/path');
    });

    it('should return only base if path is undefined', () => {
      expect(service.combine('http://base.com')).toBe('http://base.com');
    });

    it('should return only base if path is null', () => {
      // eslint-disable-next-line unicorn/no-null
      expect(service.combine('http://base.com', null as any)).toBe('http://base.com');
    });

    it('should return only base if path is an empty string', () => {
      expect(service.combine('http://base.com', '')).toBe('http://base.com');
    });

    it('should handle empty base', () => {
      expect(service.combine('', 'path')).toBe('/path');
      expect(service.combine('', '/path')).toBe('/path');
    });

     it('should handle empty base and empty path', () => {
      expect(service.combine('', '')).toBe('');
    });

    it('should handle base being just a slash', () => {
      expect(service.combine('/', 'path')).toBe('/path');
      expect(service.combine('/', '/path')).toBe('/path');
    });

     it('should handle path being just a slash', () => {
      expect(service.combine('http://base.com', '/')).toBe('http://base.com/');
    });

     it('should combine with multi-segment paths', () => {
      expect(service.combine('http://base.com', 'section/subsection/page')).toBe('http://base.com/section/subsection/page');
      expect(service.combine('http://base.com/', '/section/subsection/page')).toBe('http://base.com/section/subsection/page');
    });
  });
});