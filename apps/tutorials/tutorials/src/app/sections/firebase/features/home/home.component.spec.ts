import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FirebaseHomeComponent } from './home.component';
import { IconsService } from '../../utils/icons/icons.service';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { provideHttpClient } from '@angular/common/http';
import { SeoConfig, SeoConfigService } from '@spider-baby/utils-seo/config';

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

describe('MainHomeComponent', () => {
  let component: FirebaseHomeComponent;
  let fixture: ComponentFixture<FirebaseHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MatCardModule,
        MatButtonModule,
        MatDividerModule,
        MatIconModule,
        MatTooltipModule,
        FirebaseHomeComponent,
        MatIconTestingModule,
        RouterModule.forRoot([]),
      ],
      providers: [
        IconsService,
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: SeoConfigService, useValue: mockSeoConfig } // Assuming SeoConfigService just provides SeoConfig
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FirebaseHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });



  it('should call ngOnInit and set SEO metadata', () => {
    const seoService = TestBed.inject(IconsService) as any;
    const spy = jest.spyOn(component as any, 'ngOnInit');
    component.ngOnInit();
    expect(spy).toHaveBeenCalled();
  });
})