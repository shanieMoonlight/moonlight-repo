import { provideHttpClient } from '@angular/common/http'; // Use this for standalone
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { MyFirebaseService } from '../../firebase/my-firebase/my-firebase.service';
import { MainComponent } from './main.component';
import { IconsService } from './utils/icons/icons.service';
import { Analytics } from '@angular/fire/analytics';
import { PLATFORM_ID } from '@angular/core';

// --- Mock @firebase/app ---
jest.mock('@firebase/app', () => ({
  __esModule: true,
  ...jest.requireActual('@firebase/app'),
  getApp: jest.fn(() => ({ name: '[DEFAULT]', options: {} })),
}));

// --- Mock Analytics Service ---
const mockAnalytics = {
  logEvent: jest.fn(),
};

describe('MainComponent', () => {
  let component: MainComponent;
  let fixture: ComponentFixture<MainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MainComponent, RouterModule.forRoot([])],
      providers: [
        IconsService,
        MyFirebaseService,
        provideHttpClient(), // Provide HttpClient
        provideHttpClientTesting(), // Provide testing support
        // Provide the mock Analytics service
        { provide: Analytics, useValue: mockAnalytics },
        // Provide PLATFORM_ID
        { provide: PLATFORM_ID, useValue: 'browser' },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should inject IconsService', () => {
    expect(component.iconsService).toBeInstanceOf(IconsService);
  });

  // Add other tests for MainComponent...
});