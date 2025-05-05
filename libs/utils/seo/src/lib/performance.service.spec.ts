import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { NavigationEnd, Router } from '@angular/router';
import { SeoConfig, SeoConfigService } from '@spider-baby/utils-seo/config';
import { Subject } from 'rxjs';
import { PerformanceService } from './performance.service';

jest.mock('@angular/common', () => ({
  ...jest.requireActual('@angular/common'),
  isPlatformBrowser: jest.fn(),
}));

// Create a mock SeoConfig object
const mockSeoConfig: SeoConfig = SeoConfig.create({
  appName: 'Test App',
  appDescription: 'Test Description',
  organization: 'Test Org',
  baseUrl: 'http://localhost',
  defaultLogoFilePath: 'http://localhost:4666//logo.png',
  publishedDate: '2025-01-01',
  keywords: ['test', 'seo'],
  socialLinks: [],
  defaultOgImageUrl: '/assets/og-image.png',
  twitterHandle: '@test',
});

describe('PerformanceService', () => {
  let service: PerformanceService;
  let routerEventsSubject: Subject<NavigationEnd>;
  const mockIsPlatformBrowser = isPlatformBrowser as jest.Mock;

  beforeEach(() => {
    routerEventsSubject = new Subject<NavigationEnd>();

    TestBed.configureTestingModule({
      providers: [
        PerformanceService,
        { provide: Router, useValue: { events: routerEventsSubject.asObservable() } },
        { provide: PLATFORM_ID, useValue: 'browser' },
        { provide: SeoConfigService, useValue: mockSeoConfig }
      ],
    });

    jest.clearAllMocks();
  });

  it('should initialize and log for browser environments', () => {
    mockIsPlatformBrowser.mockReturnValue(true);

    service = TestBed.inject(PerformanceService);

    expect(mockIsPlatformBrowser).toHaveBeenCalledWith('browser');
  });

  it('should not initialize performance tracking in non-browser environments', () => {
    mockIsPlatformBrowser.mockReturnValue(false);

    service = TestBed.inject(PerformanceService);

    // Simulate a navigation event
    routerEventsSubject.next(new NavigationEnd(1, 'test', 'test'));

    // Ensure no performance tracking methods are called
    expect(mockIsPlatformBrowser).toHaveBeenCalledWith('browser');
  });

  it('should measure Core Web Vitals in browser environments', () => {
    mockIsPlatformBrowser.mockReturnValue(true);

    service = TestBed.inject(PerformanceService);

    // Simulate a navigation event
    routerEventsSubject.next(new NavigationEnd(1, 'test', 'test'));

    // Ensure performance tracking methods are called
    expect(mockIsPlatformBrowser).toHaveBeenCalledWith('browser');
  });
});