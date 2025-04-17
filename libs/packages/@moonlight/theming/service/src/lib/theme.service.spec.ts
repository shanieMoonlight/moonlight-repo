import { DOCUMENT } from '@angular/common';
import { DestroyRef, RendererFactory2 } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { SsrLocalStorage } from '../../../../ssr/storage/src/lib/ssr-local-storage.service';
import { ThemeOption } from '../../../config/src/lib/theme-option.model';
import { ThemeConfig, ThemeConfigService } from '../../../config/src/lib/theme-picker-menu-config';
import { ThemeData, ThemeDataUtils } from './theme-data';
import { ThemeService } from './theme.service';

//##################################################//

// Mock implementations
class MockRenderer {
  addClass = jest.fn();
  removeClass = jest.fn();
}

class MockRendererFactory {
  createRenderer = jest.fn().mockReturnValue(new MockRenderer());
}

class MockSsrLocalStorage {
  getItemObject = jest.fn();
  setItemObject = jest.fn();
}

class MockDestroyRef {
  onDestroy = jest.fn().mockImplementation(callback => callback());
}

const THEME_KEY = 'moonlight_theme_key';

//##################################################//

describe('ThemeService', () => {
  let service: ThemeService;
  let localStorage: MockSsrLocalStorage;
  let renderer: MockRenderer;
  let themeConfig: ThemeConfig;

  const defaultThemeOptions: ThemeOption[] = [
    { label: 'Default', value: 0 , fallbackIsDarkMode: false},
    { label: 'Blue', value: 1  , fallbackIsDarkMode: true},
    { label: 'Green', value: 2  , fallbackIsDarkMode: false},
  ];

  const defaultLightClass = 'ml-mode-light';
  const defaultDarkClass = 'dark-mode';
  const defaultThemePrefix = 'theme';

  //-----------------------------//

  beforeEach(() => {
    // Setup fake timers for all tests
    jest.useFakeTimers();

    // Your existing setup code
    jest.clearAllMocks();
    // ...rest of setup

    // Setup mock window.matchMedia
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation(query => ({
        matches: false, // Default to light mode
        media: query,
      })),
    });

    localStorage = new MockSsrLocalStorage();
    const rendererFactory = new MockRendererFactory();
    themeConfig = ThemeConfig.Create(
      defaultThemeOptions,
      defaultDarkClass,
      defaultLightClass,
      defaultThemePrefix,
      'light' // default mode
    );

    TestBed.configureTestingModule({
      providers: [
        ThemeService,
        { provide: DOCUMENT, useValue: { body: {} } },
        { provide: RendererFactory2, useValue: rendererFactory },
        { provide: SsrLocalStorage, useValue: localStorage },
        { provide: ThemeConfigService, useValue: themeConfig },
        { provide: DestroyRef, useClass: MockDestroyRef },
      ],
    });

    service = TestBed.inject(ThemeService);
    renderer = rendererFactory.createRenderer() as unknown as MockRenderer;
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  //-----------------------------//

  describe('Initialization', () => {
    it('should initialize with default theme if no stored theme exists', () => {
      localStorage.getItemObject.mockReturnValue(null);

      // Re-initialize service to trigger initialization
      service = TestBed.inject(ThemeService);

      expect(localStorage.getItemObject).toHaveBeenCalledWith(THEME_KEY);
      expect(renderer.addClass).toHaveBeenCalledWith(expect.anything(), defaultLightClass);
      expect(renderer.addClass).toHaveBeenCalledWith(expect.anything(), `${defaultThemePrefix}-0`);
    });

    //- - - - - - - - - - - - - - -//

    it('should use stored theme data if available', () => {
      // First, configure the mock
      const storedTheme: ThemeData = { suffix: 2, isDarkMode: true };
      localStorage.getItemObject.mockReturnValue(storedTheme);

      // Then reset the testing module to force a new service instance
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        providers: [
          ThemeService,
          { provide: DOCUMENT, useValue: { body: {} } },
          { provide: RendererFactory2, useValue: new MockRendererFactory() },
          { provide: SsrLocalStorage, useValue: localStorage }, // Use the configured mock
          { provide: ThemeConfigService, useValue: themeConfig },
          { provide: DestroyRef, useClass: MockDestroyRef },
        ],
      });

      // Now get a fresh instance of the service
      service = TestBed.inject(ThemeService);
      renderer = TestBed.inject(RendererFactory2).createRenderer(null, null) as unknown as MockRenderer;

      // Assertions should now work correctly
      expect(renderer.addClass).toHaveBeenCalledWith(expect.anything(), defaultDarkClass);
      expect(renderer.addClass).toHaveBeenCalledWith(expect.anything(), `${defaultThemePrefix}-2`);
    });

    //- - - - - - - - - - - - - - -//

    it('should use system preference if no stored theme but system preference exists', () => {
      localStorage.getItemObject.mockReturnValue(null);

      // Mock system dark mode preference
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: jest.fn().mockImplementation(query => ({
          matches: query.includes('dark'), // Match dark mode query
          media: query,
        })),
      });

      // Reset TestBed to force a new service instance
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        providers: [
          ThemeService,
          { provide: DOCUMENT, useValue: { body: {} } },
          { provide: RendererFactory2, useValue: new MockRendererFactory() },
          { provide: SsrLocalStorage, useValue: localStorage },
          { provide: ThemeConfigService, useValue: themeConfig },
          { provide: DestroyRef, useClass: MockDestroyRef },
        ],
      });

      // Get a fresh instance of the service
      service = TestBed.inject(ThemeService);
      renderer = TestBed.inject(RendererFactory2).createRenderer(null, null) as unknown as MockRenderer;

      expect(renderer.addClass).toHaveBeenCalledWith(expect.anything(), defaultDarkClass);
    });

    it('should use default theme if initialization fails', () => {
      localStorage.getItemObject.mockImplementation(() => {
        throw new Error('Storage error');
      });

      // Re-initialize service to trigger initialization
      service = TestBed.inject(ThemeService);

      const defaultTheme = ThemeDataUtils.default();
      expect(renderer.addClass).toHaveBeenCalledWith(expect.anything(), defaultLightClass);
      expect(renderer.addClass).toHaveBeenCalledWith(expect.anything(), `${defaultThemePrefix}-${defaultTheme.suffix}`);
    });
  });

  //-----------------------------//

  describe('Dark mode handling', () => {
    it('should set dark mode correctly', () => {
      service.setDarkMode(true);

      expect(renderer.removeClass).toHaveBeenCalledWith(expect.anything(), defaultLightClass);
      expect(renderer.addClass).toHaveBeenCalledWith(expect.anything(), defaultDarkClass);
    });

    //- - - - - - - - - - - - - - -//

    it('should set light mode correctly', () => {
      // First set to dark mode
      service.setDarkMode(true);
      jest.clearAllMocks();

      // Then switch to light mode
      service.setDarkMode(false);

      expect(renderer.removeClass).toHaveBeenCalledWith(expect.anything(), defaultDarkClass);
      expect(renderer.addClass).toHaveBeenCalledWith(expect.anything(), defaultLightClass);
    });

    //- - - - - - - - - - - - - - -//

    it('should update isDarkMode observable', async () => {
      service.setDarkMode(true);
      const isDarkMode = await firstValueFrom(service.isDarkMode$);
      expect(isDarkMode).toBe(true);
    });
  });

  //-----------------------------//

  describe('Theme suffix handling', () => {
    it('should set theme suffix correctly', () => {
      const themeSuffix = 2;
      service.setThemeSuffix(themeSuffix);

      expect(renderer.removeClass).toHaveBeenCalled();
      expect(renderer.addClass).toHaveBeenCalledWith(
        expect.anything(),
        `${defaultThemePrefix}-${themeSuffix}`
      );
    });

    //- - - - - - - - - - - - - - -//

    it('should update themeIdx observable', async () => {
      const themeSuffix = 2;
      service.setThemeSuffix(themeSuffix);
      const currentThemeSuffix = await firstValueFrom(service.themeSuffix$);
      expect(currentThemeSuffix).toBe(themeSuffix);
    });
  });

  //-----------------------------//

  describe('Theme persistence', () => {
    it('should store theme when settings change', () => {
      const themeSuffix = 2;
      service.setThemeSuffix(themeSuffix);
      service.setDarkMode(true);

      // Execute callbacks immediately rather than waiting for debounceTime
      jest.runAllTimers();

      expect(localStorage.setItemObject).toHaveBeenCalledWith(
        THEME_KEY,
        expect.objectContaining({
          suffix: themeSuffix,
          isDarkMode: true
        })
      );
    });

    //- - - - - - - - - - - - - - -//

    it('should retrieve theme from storage', () => {
      const mockTheme: ThemeData = { suffix: 2, isDarkMode: true };
      localStorage.getItemObject.mockReturnValue(mockTheme);

      const retrievedTheme = service.retrieveTheme();

      expect(localStorage.getItemObject).toHaveBeenCalledWith(THEME_KEY);
      expect(retrievedTheme).toEqual(mockTheme);
    });
  });

  //-----------------------------//

  describe('Config handling', () => {

    it('should use provided config', () => {
      const customConfig = ThemeConfig.Create(
        [{ label: 'Custom', classSuffix: 'custom' }],
        'custom-dark',
        'custom-light',
        'custom-theme',
        'dark'
      );

      // Create a shared renderer that we can reference
      const sharedRenderer = new MockRenderer();
      const rendererFactoryMock = new MockRendererFactory();
      rendererFactoryMock.createRenderer.mockReturnValue(sharedRenderer);

      const localStorageMock = new MockSsrLocalStorage();
      localStorageMock.getItemObject.mockReturnValue(null);

      // Reset and reconfigure TestBed
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        providers: [
          ThemeService,
          { provide: DOCUMENT, useValue: { body: {} } },
          { provide: RendererFactory2, useValue: rendererFactoryMock },
          { provide: SsrLocalStorage, useValue: localStorageMock },
          { provide: ThemeConfigService, useValue: customConfig },
          { provide: DestroyRef, useClass: MockDestroyRef },
        ],
      });

      // Get the service instance but don't use it yet
      const service = TestBed.inject(ThemeService);

      // Spy on isSystemDarkModeEnabled and make it return undefined
      jest.spyOn(service as any, 'isSystemDarkModeEnabled').mockReturnValue(undefined);

      // Manually trigger initialization again
      (service as any).initializeTheme();

      // Now we can check what was called on our shared renderer instance
      expect(sharedRenderer.addClass).toHaveBeenCalledWith(expect.anything(), 'custom-dark');
    });


    it('should generate correct theme class name', () => {
      // Access the private method using type assertion to any
      const generateThemeClass = (service as any).generateThemeClass;
      const className = generateThemeClass('blue');

      expect(className).toBe(`${defaultThemePrefix}-blue`);
    });
  });
});