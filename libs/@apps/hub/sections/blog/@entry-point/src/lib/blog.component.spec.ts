import { TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { SwUpdate } from '@angular/service-worker';
import { IconsService } from '@sb-hub/shared-utils/icons';
import { PerformanceService, SeoService, StructuredDataService, UrlUtilsService, } from '@spider-baby/utils-seo';
import { SeoConfig, SeoConfigService } from '@spider-baby/utils-seo/config';
import { HubBlogComponent } from './blog.component';

// Create a mock SwUpdate service
const mockSwUpdate = {
  isEnabled: false,
  versionUpdates: {
    pipe: () => ({
      subscribe: () => { },
    }),
  },
  checkForUpdate: () => Promise.resolve(false),
  activateUpdate: () => Promise.resolve(true),
};

// Create a mock SeoConfig object
const mockSeoConfig: SeoConfig = SeoConfig.create({
  appName: 'Test App',
  appDescription: 'Test Description',
  organization: 'Test Org',
  baseUrl: 'http://localhost/',
  defaultLogoFilePath: 'assets/logo.png',
  publishedDate: '2025-01-01',
  keywords: ['test', 'seo'],
  socialLinks: ['https://example.com/social'],
  defaultOgImageUrl: 'assets/og-image.png',
  twitterHandle: '@test',
});

// Create Mocks for the SEO Services
const mockSeoService = {
  updateMetadata: jest.fn(),
  addCanonicalLink: jest.fn(),
  addCanonicalLinkRelative: jest.fn(),
};

const mockStructuredDataService = {
  addLibraryStructuredData: jest.fn(),
  addOrganizationStructuredData: jest.fn(),
};

const mockPerformanceService = {
  measureCoreWebVitals: jest.fn(),
};

describe('HubBlogComponent', () => {
  let component: HubBlogComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HubBlogComponent, RouterModule.forRoot([])],
      providers: [
        IconsService,
        { provide: SeoConfigService, useValue: mockSeoConfig },
        { provide: SeoService, useValue: mockSeoService },
        { provide: SwUpdate, useValue: mockSwUpdate },
        { provide: StructuredDataService, useValue: mockStructuredDataService },
        { provide: PerformanceService, useValue: mockPerformanceService },
        UrlUtilsService,
      ], // Provide the IconsService
    }).compileComponents();

    const fixture = TestBed.createComponent(HubBlogComponent);
    component = fixture.componentInstance;
  });

    it('should inject IconsService', () => {
    expect(component['_iconsService']).toBeInstanceOf(IconsService);
  })

});
