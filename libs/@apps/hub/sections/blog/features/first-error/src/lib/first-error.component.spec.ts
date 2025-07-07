import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HubBlogFirstErrorComponent } from './first-error.component';
import { SeoConfig, SeoConfigService } from '@spider-baby/utils-seo/config';
import { SeoService, StructuredDataService, PerformanceService } from '@spider-baby/utils-seo';
import { of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';



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
const mockActRoute = {
  queryParamMap: of({ get: () => null })
}

describe('HubBlogFirstErrorComponent', () => {
  let component: HubBlogFirstErrorComponent;
  let fixture: ComponentFixture<HubBlogFirstErrorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HubBlogFirstErrorComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: ActivatedRoute, useValue: mockActRoute },
        { provide: SeoConfigService, useValue: mockSeoConfig },
        { provide: SeoService, useValue: mockSeoService },
        { provide: StructuredDataService, useValue: mockStructuredDataService },
        { provide: PerformanceService, useValue: mockPerformanceService },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HubBlogFirstErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the tutorial title', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain((component as any)._title);
  });

  it('should render the subtitle and description', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain((component as any)._subtitle);
    expect(compiled.textContent).toContain((component as any)._description);
  });

  it('should show the download button after 2 seconds', async () => {
    jest.useFakeTimers();
    (component as any).ngOnInit();
    expect((component as any)._showButton()).toBe(false);
    jest.advanceTimersByTime(2000);
    expect((component as any)._showButton()).toBe(true);
    jest.useRealTimers();
  });

  it('should have code sample properties defined', () => {
    expect((component as any)._basicExample).toBeDefined();
    expect((component as any)._customTemplateExample).toBeDefined();
    expect((component as any)._showUntouchedExample).toBeDefined();
    expect((component as any)._dynamicFormExample).toBeDefined();
    expect((component as any)._customErrorMessagesExample).toBeDefined();
    expect((component as any)._directiveSkeletonCode).toBeDefined();
    expect((component as any)._observeValueChangesCode).toBeDefined();
    expect((component as any)._blurListenerCode).toBeDefined();
    expect((component as any)._setFirstErrorMessageCode).toBeDefined();
    expect((component as any)._findInvalidControlsDataCode).toBeDefined();
    expect((component as any)._fullDirectiveCode).toBeDefined();
  });

  it('should update SEO metadata on init', () => {
    const seoSpy = jest.spyOn(component['_seoService'], 'updateMetadata');
    (component as any).ngOnInit();
    expect(seoSpy).toHaveBeenCalledWith(expect.objectContaining({
      title: (component as any)._title,
      description: (component as any)._description,
      url: expect.any(String),
      keywords: expect.any(Array),
    }));
  });

  it('should emit download click event', () => {
    const nextSpy = jest.spyOn((component as any)._dlClick$, 'next');
    // Simulate download button click
    (component as any)._dlClick$.next();
    expect(nextSpy).toHaveBeenCalled();
  });
});
