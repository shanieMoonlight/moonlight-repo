import { TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { SwUpdate } from '@angular/service-worker';
import { PerformanceService, StructuredDataService, UrlUtilsService } from '@spider-baby/utils-seo';
import { IconsService } from '../../shared/utils/icons/icons.service';
import { MainComponent } from './main.component';

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



const mockStructuredDataService = {
  addLibraryStructuredData: jest.fn(),
  addOrganizationStructuredData: jest.fn(),
};

const mockPerformanceService = {
  measureCoreWebVitals: jest.fn(),
};

describe('MainComponent', () => {
  let component: MainComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MainComponent, RouterModule.forRoot([])],
      providers: [
        IconsService,
        { provide: SwUpdate, useValue: mockSwUpdate },
        { provide: StructuredDataService, useValue: mockStructuredDataService },
        { provide: PerformanceService, useValue: mockPerformanceService },
        UrlUtilsService,
      ], // Provide the IconsService
    }).compileComponents();

    const fixture = TestBed.createComponent(MainComponent);
    component = fixture.componentInstance;
  });

  it('should inject IconsService', () => {
    expect(component.iconsService).toBeInstanceOf(IconsService);
  });
});
