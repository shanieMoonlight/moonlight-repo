import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { Router, NavigationEnd } from '@angular/router';
import { SeoService } from './shared/services/seo.service';
import { StructuredDataService } from './shared/services/structured-data.service';
import { PerformanceService } from './shared/services/performance.service';
import { UrlService } from './shared/utils/urls/url.service';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

describe('AppComponent', () => {
  let component: AppComponent;
  let seoService: SeoService;
  let structuredDataService: StructuredDataService;
  let performanceService: PerformanceService;
  let urlService: UrlService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent, RouterTestingModule],
      providers: [
        {
          provide: SeoService,
          useValue: {
            addCanonicalLink: jest.fn(),
          },
        },
        {
          provide: StructuredDataService,
          useValue: {
            addLibraryStructuredData: jest.fn(),
          },
        },
        {
          provide: PerformanceService,
          useValue: {
            measureCoreWebVitals: jest.fn(),
          },
        },
        {
          provide: UrlService,
          useValue: {
            combineWithBase: jest.fn((url: string) => {
              console.log('combineWithBase called with:', url);
              return `https://example.com${url}`;
            }),
          },
        }
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;

    seoService = TestBed.inject(SeoService);
    structuredDataService = TestBed.inject(StructuredDataService);
    performanceService = TestBed.inject(PerformanceService);
    urlService = TestBed.inject(UrlService);
    router = TestBed.inject(Router);

    jest.spyOn(router.events, 'pipe').mockReturnValue(of(new NavigationEnd(1, '/previous', '/current')));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should add base structured data on initialization', () => {
    component.ngOnInit();

    expect(structuredDataService.addLibraryStructuredData).toHaveBeenCalled();
  });

  it('should initialize performance monitoring on initialization', () => {
    component.ngOnInit();

    expect(performanceService.measureCoreWebVitals).toHaveBeenCalled();
  });

  it('should update canonical URL on route change', () => {
    component.ngOnInit()

    expect(seoService.addCanonicalLink).toHaveBeenCalledWith('https://example.com/current');
  });

  it('should call UrlService to combine the base URL with the current route', () => {
    component.ngOnInit();

    expect(urlService.combineWithBase).toHaveBeenCalledWith('/current');
  });
});