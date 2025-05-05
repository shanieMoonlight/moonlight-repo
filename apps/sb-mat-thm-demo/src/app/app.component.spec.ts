import { TestBed } from '@angular/core/testing';
import { NavigationEnd, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { PerformanceService, SeoService, StructuredDataService, UrlUtilsService } from '@spider-baby/utils-seo';
import { of } from 'rxjs';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  let component: AppComponent;
  let seoService: SeoService;
  let structuredDataService: StructuredDataService;
  let performanceService: PerformanceService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent, RouterTestingModule],
      providers: [
        {
          provide: SeoService,
          useValue: {
            addCanonicalLink: jest.fn(),
            addCanonicalLinkRelative: jest.fn(),
          },
        },
        {
          provide: StructuredDataService,
          useValue: {
            addLibraryStructuredData: jest.fn(),
            addOrganizationStructuredData: jest.fn(),
          },
        },
        {
          provide: PerformanceService,
          useValue: {
            measureCoreWebVitals: jest.fn(),
          },
        },
        {
          provide: UrlUtilsService,
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
    Object.defineProperty(router, 'url', { get: () => '/current' });
    component.ngOnInit()

    expect(seoService.addCanonicalLinkRelative).toHaveBeenCalledWith('/current');
  });

});