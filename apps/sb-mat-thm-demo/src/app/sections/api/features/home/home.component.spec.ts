import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ApiHomeComponent } from './home.component';
import { RouterModule } from '@angular/router';
import { SeoService, UrlUtilsService } from '@spider-baby/utils-seo';
import { SeoConfig, SeoConfigService } from '@spider-baby/utils-seo/config';

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

describe('HomeComponent', () => {
  let component: ApiHomeComponent;
  let fixture: ComponentFixture<ApiHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ApiHomeComponent,
        RouterModule.forRoot([])
      ],
      providers: [
        { provide: SeoConfigService, useValue: mockSeoConfig },
        { provide: SeoService, useValue: mockSeoService },
        UrlUtilsService,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ApiHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
