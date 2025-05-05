import { TestBed } from '@angular/core/testing';
import { Router, RouterModule } from '@angular/router';
import { SeoService, StructuredDataService, UrlUtilsService } from '@spider-baby/utils-seo';
import { ApiComponent } from './api.component';

describe('ApiComponent', () => {
  let component: ApiComponent;
  let seoService: SeoService;
  let structuredDataService: StructuredDataService;
  let urlService: UrlUtilsService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApiComponent, RouterModule.forRoot([])],
      providers: [
        {
          provide: SeoService,
          useValue: {
            updateMetadata: jest.fn(),
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
          provide: UrlUtilsService,
          useValue: {
            combineWithBase: jest.fn((url: string) => `https://example.com${url}`),
          },
        },
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(ApiComponent);
    component = fixture.componentInstance;

    seoService = TestBed.inject(SeoService);
    structuredDataService = TestBed.inject(StructuredDataService);
    urlService = TestBed.inject(UrlUtilsService);
    router = TestBed.inject(Router);

    jest.spyOn(router, 'url', 'get').mockReturnValue('/api');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set SEO metadata on initialization', () => {
    component.ngOnInit();
  
    const metadata = {
      title: expect.any(String),
      description: expect.any(String),
      url: expect.any(String),
    };
  
    expect(seoService.updateMetadata).toHaveBeenCalledWith(metadata);
  
    // Additional checks for truthy strings
    const [args] = (seoService.updateMetadata as jest.Mock).mock.calls[0];
    expect(args.title).toBeTruthy();
    expect(args.description).toBeTruthy();
    expect(args.url).toBeTruthy();
  });

  it('should add a canonical link on initialization', () => {
    component.ngOnInit();

    expect(seoService.addCanonicalLink).toHaveBeenCalledWith('https://example.com/api');
  });

  it('should add structured data on initialization', () => {
    component.ngOnInit();

    expect(structuredDataService.addLibraryStructuredData).toHaveBeenCalled();
  });
});