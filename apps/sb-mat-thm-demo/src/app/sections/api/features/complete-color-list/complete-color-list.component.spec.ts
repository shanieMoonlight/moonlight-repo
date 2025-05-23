import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CompleteColorListComponent } from './complete-color-list.component';
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
  addCanonicalLinkRelative: jest.fn(),
};

describe('CompleteColorListComponent', () => {
  let component: CompleteColorListComponent;
  let fixture: ComponentFixture<CompleteColorListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompleteColorListComponent],
      providers: [
        { provide: SeoConfigService, useValue: mockSeoConfig },
        { provide: SeoService, useValue: mockSeoService },
        UrlUtilsService,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CompleteColorListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  })

  it('should create', () => {
    expect(component).toBeTruthy();
  })

});
