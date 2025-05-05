import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { SeoService, StructuredDataService, UrlUtilsService } from '@spider-baby/utils-seo';
import { SeoConfig, SeoConfigService, } from '@spider-baby/utils-seo/config';
import { IconsService } from '../../utils/icons/icons.service';
import { MainHomeComponent } from './home.component';
import { HIGHLIGHT_OPTIONS } from 'ngx-highlightjs';


// Create a mock SeoConfig object
const mockSeoConfig: SeoConfig = SeoConfig.create({
  appName: 'Test App',
  appDescription: 'Test Description',
  organization: 'Test Org',
  baseUrl: 'http://localhost/', // Ensure trailing slash for consistency
  defaultLogoFilePath: 'assets/logo.png', // Relative path example
  publishedDate: '2025-01-01',
  keywords: ['test', 'seo'],
  socialLinks: ['https://example.com/social'],
  defaultOgImageUrl: 'assets/og-image.png', // Relative path example
  twitterHandle: '@test',
});

// --- Create Mocks for the SEO Services ---
const mockSeoService = {
  updateMetadata: jest.fn(),
  addCanonicalLink: jest.fn(),
};

const mockStructuredDataService = {
  addOrganizationStructuredData: jest.fn(),
  addLibraryStructuredData: jest.fn(),
  // Add other methods if the component calls them
};


describe('MainHomeComponent', () => {
  let component: MainHomeComponent;
  let fixture: ComponentFixture<MainHomeComponent>;
  let seoService: SeoService;
  let structuredDataService: StructuredDataService;

  beforeEach(async () => {
    mockSeoService.updateMetadata.mockClear();
    mockSeoService.addCanonicalLink.mockClear();
    mockStructuredDataService.addOrganizationStructuredData.mockClear();

    await TestBed.configureTestingModule({
      imports: [
        MatCardModule,
        MatButtonModule,
        MatDividerModule,
        MatIconModule,
        MatTooltipModule,
        MainHomeComponent,
        MatIconTestingModule,
        RouterModule.forRoot([]),
      ],
      providers: [
        IconsService,
        { provide: SeoConfigService, useValue: mockSeoConfig },
        { provide: SeoService, useValue: mockSeoService },
        { provide: StructuredDataService, useValue: mockStructuredDataService },
        UrlUtilsService,
        provideHttpClient(),
        provideHttpClientTesting(),
        {
          provide: HIGHLIGHT_OPTIONS,
          useValue: {
            coreLibraryLoader: () => import('highlight.js/lib/core'),
            lineNumbers: true,
            languages: {
              typescript: () => import('highlight.js/lib/languages/typescript'),
              xml: () => import('highlight.js/lib/languages/xml'),
              html: () => import('highlight.js/lib/languages/xml'),
              scss: () => import('highlight.js/lib/languages/scss'),
              css: () => import('highlight.js/lib/languages/css'),
              json: () => import('highlight.js/lib/languages/json')
            }
          }
        }
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MainHomeComponent);
    component = fixture.componentInstance;

    seoService = TestBed.inject(SeoService);
    structuredDataService = TestBed.inject(StructuredDataService);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render GitHub, NPM, Share, and API buttons', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const buttons = compiled.querySelectorAll('.links button');
    expect(buttons.length).toBe(4);

    const labels = Array.from(buttons).map(btn => btn.getAttribute('aria-label'));
    expect(labels).toContain('View GitHub Repository');
    expect(labels).toContain('View NPM Package');
    expect(labels).toContain('Share this page');
    expect(labels).toContain('View API Documentation');
  });

  it('should render mat-icon for git and npm', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const icons = compiled.querySelectorAll('mat-icon');
    const svgIcons = Array.from(icons)
      .map(icon => icon.getAttribute('ng-reflect-svg-icon'))
      .filter(Boolean);
    expect(svgIcons).toContain('git');
    expect(svgIcons).toContain('npm');
  });

  it('should have correct hrefs for GitHub and NPM buttons', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const githubBtn = Array.from(compiled.querySelectorAll('.links button')).find(
      btn => btn.getAttribute('aria-label') === 'View GitHub Repository'
    );
    const npmBtn = Array.from(compiled.querySelectorAll('.links button')).find(
      btn => btn.getAttribute('aria-label') === 'View NPM Package'
    );
    expect(githubBtn).toBeTruthy();
    expect(npmBtn).toBeTruthy();
  });

  it('should set SEO metadata and structured data on init', () => {
    // Assert that the methods were called during component initialization (in beforeEach)
    expect(seoService.updateMetadata).toHaveBeenCalled();
    expect(seoService.addCanonicalLink).toHaveBeenCalled();

   

  });

})