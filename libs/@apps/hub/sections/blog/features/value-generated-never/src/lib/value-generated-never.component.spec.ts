import { TestBed, ComponentFixture } from '@angular/core/testing';
import {HubBlogValueGeneratedNeverComponent } from './value-generated-never.component';
import { RouterModule } from '@angular/router';
import { By } from '@angular/platform-browser';
import { BlogConstants } from './config/constants';
import { HubHeroBanner2Component } from '@sb-hub/shared-ui/hero-banner/banner-2';
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

describe('HubBlogValueGeneratedNeverComponent', () => {
  let component: HubBlogValueGeneratedNeverComponent;
  let fixture: ComponentFixture<HubBlogValueGeneratedNeverComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HubBlogValueGeneratedNeverComponent, RouterModule.forRoot([])],
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

    fixture = TestBed.createComponent(HubBlogValueGeneratedNeverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('calls SeoService.updateMetadata with expected title and keywords', () => {
    expect(mockSeoService.updateMetadata).toHaveBeenCalled();
    const callArg = (mockSeoService.updateMetadata as jest.Mock).mock.calls[0][0];
    expect(callArg.title).toBe(BlogConstants.ValueGeneratedNever.Title);
    expect(callArg.keywords).toBe(BlogConstants.ValueGeneratedNever.Keywords);
  });

  it('binds hero banner inputs', () => {
    const heroDe = fixture.debugElement.query(By.css('sb-hub-hero-banner-2'));
    expect(heroDe).toBeTruthy();
    const heroComp = heroDe.componentInstance as HubHeroBanner2Component;
    expect(heroComp.title()).toBe(component['_title']);
    expect(heroComp.subtitle()).toBe(component['_subtitle']);
  });

  it('renders intro header text', () => {
    const header = fixture.debugElement.query(By.css('.intro-section h2'));
    expect(header.nativeElement.textContent).toContain('EF Core, DDD, and Client-Side ID issues');
  });

  it('does not render download button by default (commented out in template)', () => {
    const downloadBtn = fixture.debugElement.query(By.css('#btn-download'));
    expect(downloadBtn).toBeNull();
  });

});
