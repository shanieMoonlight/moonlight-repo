/* eslint-disable @typescript-eslint/no-empty-function */
import { TestBed } from '@angular/core/testing';
import {HubBlogAuthServiceComponent } from './auth-service.component';
import { RouterModule } from '@angular/router';
import { IconsService } from '@sb-hub/shared-utils/icons';
import { SwUpdate } from '@angular/service-worker';
import { SeoService, StructuredDataService, PerformanceService, UrlUtilsService, } from '@spider-baby/utils-seo';
import { SeoConfig, SeoConfigService } from '@spider-baby/utils-seo/config';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

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

describe('HubBlogAuthServiceComponent', () => {
  let component:HubBlogAuthServiceComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HubBlogAuthServiceComponent, RouterModule.forRoot([])],
      providers: [
        IconsService,
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: SeoConfigService, useValue: mockSeoConfig },
        { provide: SeoService, useValue: mockSeoService },
        { provide: SwUpdate, useValue: mockSwUpdate },
        { provide: StructuredDataService, useValue: mockStructuredDataService },
        { provide: PerformanceService, useValue: mockPerformanceService },
        UrlUtilsService,
      ], // Provide the IconsService
    }).compileComponents();

    const fixture = TestBed.createComponent(HubBlogAuthServiceComponent);
    component = fixture.componentInstance;
  });

  
  it('should create', () => {
    expect(component).toBeTruthy();
  });

});
