import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MainComponent } from './main.component';
import { RouterModule } from '@angular/router';
import { IconsService } from '../../shared/utils/icons/icons.service';
import { SwUpdate } from '@angular/service-worker';
import { SeoService, StructuredDataService, PerformanceService, UrlUtilsService } from '@spider-baby/utils-seo';
import { SeoConfig, SeoConfigService } from '@spider-baby/utils-seo/config';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { LoginService } from '@spider-baby/myid-auth/services';
import { ComponentRef, signal } from '@angular/core';
import { ScrollListenerService } from '../../shared/utils/scroll/scroll-listener.service';

// Create a mock SwUpdate service
const mockSwUpdate = {
  isEnabled: false,
  versionUpdates: {
    pipe: () => ({
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      subscribe: () => { }
    })
  },
  checkForUpdate: () => Promise.resolve(false),
  activateUpdate: () => Promise.resolve(true)
};
// Create a mock ScrollListenerService
const mockScrollListener = {
  getScrollPosition: jest.fn(),
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
  addOrganizationStructuredData: jest.fn()
};

const mockPerformanceService = {
  measureCoreWebVitals: jest.fn()
};

describe('MainComponent', () => {
  let component: MainComponent;
  let fixture: ComponentFixture<MainComponent>;
  let componentRef: ComponentRef<MainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MainComponent, RouterModule.forRoot([])],
      providers: [IconsService,
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: SeoConfigService, useValue: mockSeoConfig },
        { provide: SeoService, useValue: mockSeoService },
        { provide: SwUpdate, useValue: mockSwUpdate },
        { provide: StructuredDataService, useValue: mockStructuredDataService },
        { provide: PerformanceService, useValue: mockPerformanceService },
        { provide: ScrollListenerService, useValue: mockScrollListener },
        UrlUtilsService,], // Provide the IconsService
    }).compileComponents();

    fixture = TestBed.createComponent(MainComponent);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;
  });

  it('should add the scrolled class', () => {

    mockScrollListener.getScrollPosition.mockReturnValue(signal(200));
    fixture = TestBed.createComponent(MainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    const containsClass = fixture.nativeElement.classList.contains('scrolled');
    expect(containsClass).toBeTruthy();

  });

  it('should inject IconsService', () => {
    expect(component['_iconsService']).toBeInstanceOf(IconsService);
  });

  it('should inject LoginService', () => {
    expect(component['_login']).toBeInstanceOf(LoginService);
  });
});
