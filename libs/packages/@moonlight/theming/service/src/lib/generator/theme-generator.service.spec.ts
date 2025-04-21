import { TestBed, fakeAsync, tick, flush } from '@angular/core/testing'; // Import fakeAsync and tick/flush
import { ThemeGeneratorService } from './theme-generator.service';
import { PLATFORM_ID, RendererFactory2 } from '@angular/core';
import { COLOR_VAR_PREFIX, DARK_MODE_CLASS, DEFAULT_COLOR_ERROR, DEFAULT_COLOR_TERTIARY, THEME_CLASS_PREFIX, ThemeOption } from '../../../../config/src/index';
import { ColorUtilsService } from '../../../../utils/src/index';
import { PaletteGeneratorService } from './utils/palettes/palette-generator.service';
import { ScssPaletteGeneratorService } from './utils/scss/scss-palette-generator.service';
import { GeneratedPalettes } from './models/theme-palletes';
import { SytemPrefsService } from './utils/sytem-prefs/sytem-prefs.service'; // Import SytemPrefsService
import { DOCUMENT } from '@angular/common';
import { AnimationFrameService } from '../../../../../../../utils/testing/src/index';

describe('ThemeGeneratorService', () => {
  let service: ThemeGeneratorService;
  let rendererFactoryMock: { createRenderer: jest.Mock };
  let rendererMock: { addClass: jest.Mock; removeClass: jest.Mock };
  let colorUtilsMock: { setRGBVariable: jest.Mock };
  let paletteGeneratorMock: { generatePalettes: jest.Mock };
  let scssGeneratorMock: { exportThemeAsScss: jest.Mock };
  let systemPrefsMock: { prefersDarkMode: jest.Mock }; // Mock for SytemPrefsService
  let mockDocument: Document; // Mock for Document

  let mockElement: HTMLElement;


  // Mock theme options
  const mockThemeOption: ThemeOption = ThemeOption.create({
    primaryColor: '#FF0000',
    secondaryColor: '#00FF00',
    tertiaryColor: '#0000FF',
    errorColor: '#FF00FF',
    value: 'test-theme',
    label: 'Test Theme',
    darkMode: false // Explicitly set darkMode
  });

  const mockThemeOptionSystemDark: ThemeOption = ThemeOption.create({
    primaryColor: '#FFA500',
    secondaryColor: '#008000',
    value: 'system-theme',
    label: 'System Theme',
    darkMode: 'system' // Use system preference
  });

  // Mock generated palettes (ensure keys match what PaletteGeneratorService produces)
  const mockPalettes: GeneratedPalettes = {
    primary: { '10': '#ffebee', '20': '#ffcdd2', '30': '#e57373', '40': '#ef5350', '80': '#c62828', '90': '#b71c1c', '100': '#ffebee' },
    secondary: { '10': '#e8f5e9', '20': '#c8e6c9', '30': '#a5d6a7', '40': '#66bb6a', '80': '#2e7d32', '90': '#1b5e20', '100': '#e8f5e9' },
    tertiary: { '10': '#e3f2fd', '20': '#bbdefb', '30': '#90caf9', '40': '#42a5f5', '80': '#0d47a1', '90': '#082e7b', '100': '#e3f2fd' },
    neutral: { '0': '#000000', '4': '#121212', '6': '#1e1e1e', '10': '#f5f5f5', '12': '#1f1f1f', '17': '#2a2a2a', '20': '#303030', '22': '#383838', '24': '#3d3d3d', '87': '#dfdfdf', '90': '#e0e0e0', '92': '#ebebeb', '94': '#f3f3f3', '95': '#f5f5f5', '96': '#f8f8f8', '98': '#fafafa', '99': '#fcfcfc', '100': '#ffffff' },
    neutralVariant: { '20': '#4f4f4f', '30': '#686868', '50': '#808080', '60': '#989898', '80': '#c6c6c6', '90': '#e0e0e0' },
    error: { '10': '#ffebee', '20': '#ffcdd2', '30': '#e57373', '40': '#ef5350', '80': '#c62828', '90': '#b71c1c', '100': '#ffebee' }
  };

  //-----------------------------//

  beforeEach(() => {
    // Create mocks
    mockElement = {
      style: {
        setProperty: jest.fn(),
        getPropertyValue: jest.fn()
      },
      classList: {
        add: jest.fn(),
        remove: jest.fn(),
        contains: jest.fn()
      }
    } as unknown as HTMLElement;

    // Mock Document
    mockDocument = {
      documentElement: mockElement
    } as unknown as Document;


    const animationFrameMock = {
      request: jest.fn((callback) => {
        // Make sure to EXECUTE the callback, not just store it
        callback(0);
        return 0;
      })
    };
    rendererMock = { addClass: jest.fn(), removeClass: jest.fn() };
    rendererFactoryMock = {
      createRenderer: jest.fn().mockReturnValue(rendererMock)
    };
    colorUtilsMock = { setRGBVariable: jest.fn() };
    paletteGeneratorMock = {
      generatePalettes: jest.fn().mockReturnValue(mockPalettes)
    };
    scssGeneratorMock = {
      exportThemeAsScss: jest.fn().mockReturnValue('// SCSS mock content')
    };
    systemPrefsMock = { // Mock for SytemPrefsService
      prefersDarkMode: jest.fn().mockReturnValue(false) // Default to light mode
    };

    TestBed.configureTestingModule({
      providers: [
        ThemeGeneratorService,
        { provide: RendererFactory2, useValue: rendererFactoryMock },
        { provide: ColorUtilsService, useValue: colorUtilsMock },
        { provide: PaletteGeneratorService, useValue: paletteGeneratorMock },
        { provide: ScssPaletteGeneratorService, useValue: scssGeneratorMock },
        { provide: SytemPrefsService, useValue: systemPrefsMock }, // Provide mock
        { provide: DOCUMENT, useValue: mockDocument }, // Provide mock Document
        { provide: AnimationFrameService, useValue: animationFrameMock },
        { provide: PLATFORM_ID, useValue: 'browser' } // Ensure browser platform
      ]
    });

    service = TestBed.inject(ThemeGeneratorService);
  });

  //-----------------------------//

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  //- - - - - - - - - - - - - - -//

  it('should create a renderer on initialization', () => {
    expect(rendererFactoryMock.createRenderer).toHaveBeenCalledWith(null, null);
  });

  //-----------------------------//

  describe('applyTheme', () => {

    // Use fakeAsync for tests involving requestAnimationFrame
    it('should call paletteGenerator.generatePalettes with the theme option', fakeAsync(() => {
      service.applyTheme(mockThemeOption);
      flush(); // Process requestAnimationFrame

      expect(paletteGeneratorMock.generatePalettes).toHaveBeenCalledWith(mockThemeOption);
    }));

    //- - - - - - - - - - - - - - -//

    it('should apply palette variables to the target element', fakeAsync(() => {

      // Arrange
      const mockTheme: ThemeOption = ThemeOption.create({
        value: 'test-theme',
        label: 'Test Theme',
        primaryColor: '#b12d00',
        secondaryColor: '#705d00',
        tertiaryColor: '#ac2471',
        darkMode: false
      });

      // Act
      service.applyTheme(mockTheme, undefined, mockElement);
      tick(); // Process the animation frame

      // Assert - check palette variables dynamically based on mockPalettes
      // Test for each palette type
      ['primary', 'secondary', 'tertiary'].forEach(paletteType => {
        // Get available tones for this palette
        const availableTones = Object.keys(mockPalettes[paletteType]);

        // Take the first 3 tones (or all if fewer than 3)
        const tonesToTest = availableTones.slice(0, 3);

        // Verify each tone was set as a CSS property
        tonesToTest.forEach(tone => {
          expect(mockElement.style.setProperty).toHaveBeenCalledWith(
            `--${COLOR_VAR_PREFIX}-${paletteType}-${tone}`,
            mockPalettes[paletteType][tone]
          );
        });
      });
    }));

    //- - - - - - - - - - - - - - -//


    // Add a new test:
    it('should apply theme class to the target element', fakeAsync(() => {
      // Arrange
      const mockTheme: ThemeOption = ThemeOption.create({
        value: 'test-theme',
        label: 'Test Theme',
        primaryColor: '#b12d00',
        secondaryColor: '#705d00',
        tertiaryColor: '#ac2471',
        darkMode: false
      });

      // Act
      service.applyTheme(mockTheme, undefined, mockElement);
      tick(); // Process the animation frame

      // Assert - check theme class was added
      console.log(`Adding class: ${THEME_CLASS_PREFIX}-${mockTheme.value}`);      
      expect(rendererMock.addClass).toHaveBeenCalledWith(
        mockElement, 
        `${THEME_CLASS_PREFIX}-${mockTheme.value}`
      );
    }));

    //- - - - - - - - - - - - - - -//

    it('should call applySystemVariables with the correct parameters (light mode)', fakeAsync(() => {
      const systemSpy = jest.spyOn(service as any, 'applySystemVariables');
      systemPrefsMock.prefersDarkMode.mockReturnValue(false); // Ensure system is light
      const theme = ThemeOption.create({ ...mockThemeOption, darkMode: false }); // Explicit light

      service.applyTheme(theme, undefined, mockElement);
      flush(); // Process requestAnimationFrame

      expect(systemSpy).toHaveBeenCalledWith(theme, mockPalettes, mockElement, false); // isDark should be false
    }));

    it('should call applySystemVariables with the correct parameters (dark mode)', fakeAsync(() => {
      const systemSpy = jest.spyOn(service as any, 'applySystemVariables');
      systemPrefsMock.prefersDarkMode.mockReturnValue(true); // Ensure system is dark
      const theme = ThemeOption.create({ ...mockThemeOption, darkMode: true }); // Explicit dark

      service.applyTheme(theme, undefined, mockElement);
      flush(); // Process requestAnimationFrame

      expect(systemSpy).toHaveBeenCalledWith(theme, mockPalettes, mockElement, true); // isDark should be true
    }));

    it('should call applySystemVariables with the correct parameters (system mode - dark)', fakeAsync(() => {
      const systemSpy = jest.spyOn(service as any, 'applySystemVariables');
      systemPrefsMock.prefersDarkMode.mockReturnValue(true); // System prefers dark

      service.applyTheme(mockThemeOptionSystemDark, undefined, mockElement);
      flush(); // Process requestAnimationFrame

      expect(systemSpy).toHaveBeenCalledWith(mockThemeOptionSystemDark, mockPalettes, mockElement, true); // isDark should be true
    }));

    it('should call applySystemVariables with the correct parameters (system mode - light)', fakeAsync(() => {
      const systemSpy = jest.spyOn(service as any, 'applySystemVariables');
      systemPrefsMock.prefersDarkMode.mockReturnValue(false); // System prefers light

      service.applyTheme(mockThemeOptionSystemDark, undefined, mockElement);
      flush(); // Process requestAnimationFrame

      expect(systemSpy).toHaveBeenCalledWith(mockThemeOptionSystemDark, mockPalettes, mockElement, false); // isDark should be false
    }));


    //- - - - - - - - - - - - - - -//

    it('should add theme class using theme value if override not provided', fakeAsync(() => {
      service.applyTheme(mockThemeOption, undefined, mockElement);
      flush(); // Process requestAnimationFrame

      expect(rendererMock.addClass).toHaveBeenCalledWith(
        mockElement,
        `${THEME_CLASS_PREFIX}-${mockThemeOption.value}` // Use theme's value
      );
    }));

    it('should add theme class using override if provided', fakeAsync(() => {
      const themeClassOverride = 'custom-class';
      service.applyTheme(mockThemeOption, themeClassOverride, mockElement);
      flush(); // Process requestAnimationFrame

      expect(rendererMock.addClass).toHaveBeenCalledWith(
        mockElement,
        `${THEME_CLASS_PREFIX}-${themeClassOverride}` // Use override
      );
    }));

    //- - - - - - - - - - - - - - -//

    it('should add dark mode class if theme forces dark', fakeAsync(() => {
      const darkTheme = ThemeOption.create({ ...mockThemeOption, darkMode: true });
      service.applyTheme(darkTheme, undefined, mockElement);
      flush(); // Process requestAnimationFrame

      expect(rendererMock.addClass).toHaveBeenCalledWith(
        mockElement,
        DARK_MODE_CLASS
      );
      expect(rendererMock.removeClass).not.toHaveBeenCalledWith(mockElement, DARK_MODE_CLASS);
    }));

    it('should add dark mode class if theme uses system and system is dark', fakeAsync(() => {
      systemPrefsMock.prefersDarkMode.mockReturnValue(true); // System prefers dark
      service.applyTheme(mockThemeOptionSystemDark, undefined, mockElement);
      flush(); // Process requestAnimationFrame

      expect(rendererMock.addClass).toHaveBeenCalledWith(
        mockElement,
        DARK_MODE_CLASS
      );
      expect(rendererMock.removeClass).not.toHaveBeenCalledWith(mockElement, DARK_MODE_CLASS);
    }));

    //- - - - - - - - - - - - - - -//

    it('should remove dark mode class if theme forces light', fakeAsync(() => {
      const lightTheme = ThemeOption.create({ ...mockThemeOption, darkMode: false });
      service.applyTheme(lightTheme, undefined, mockElement);
      flush(); // Process requestAnimationFrame

      expect(rendererMock.removeClass).toHaveBeenCalledWith(
        mockElement,
        DARK_MODE_CLASS
      );
      expect(rendererMock.addClass).not.toHaveBeenCalledWith(mockElement, DARK_MODE_CLASS);
    }));

    it('should remove dark mode class if theme uses system and system is light', fakeAsync(() => {
      systemPrefsMock.prefersDarkMode.mockReturnValue(false); // System prefers light
      service.applyTheme(mockThemeOptionSystemDark, undefined, mockElement);
      flush(); // Process requestAnimationFrame

      expect(rendererMock.removeClass).toHaveBeenCalledWith(
        mockElement,
        DARK_MODE_CLASS
      );
      expect(rendererMock.addClass).not.toHaveBeenCalledWith(mockElement, DARK_MODE_CLASS);
    }));

    //- - - - - - - - - - - - - - -//
    
    it('should use documentElement if targetElement is not provided', fakeAsync(() => {
      const paletteSpy = jest.spyOn(service as any, 'applyPaletteVariables');
      service.applyTheme(mockThemeOption); // No targetElement
      flush();
      
      expect(paletteSpy).toHaveBeenCalledWith(mockPalettes, mockDocument.documentElement);
    }));
    
    //- - - - - - - - - - - - - - -//

    it('should set RGB color variables for transparency support', fakeAsync(() => {
      // Arrange
      const theme = ThemeOption.create({
        value: 'test-theme',
        label: 'Test Theme',
        primaryColor: '#b12d00',
        secondaryColor: '#b18800',
        darkMode: false
      });
      
      // Act
      service.applyTheme(theme, undefined, mockElement);
      tick();
      
      // Assert - verify RGB variables were set using ColorUtilsService
      expect(colorUtilsMock.setRGBVariable).toHaveBeenCalledWith(
        mockElement, 
        '--mat-sys-primary-rgb', 
        mockPalettes.primary['40']
      );
      
      expect(colorUtilsMock.setRGBVariable).toHaveBeenCalledWith(
        mockElement, 
        '--mat-sys-surface-rgb', 
        mockPalettes.neutral['99']
      );
    }));


  });

  //-----------------------------//

  describe('applyPaletteVariables', () => {
    it('should set CSS properties for each palette shade', () => {
      // Call the private method directly
      (service as any).applyPaletteVariables(mockPalettes, mockElement);

      // Check a few color variables were set
      expect(mockElement.style.setProperty).toHaveBeenCalledWith(
        `--${COLOR_VAR_PREFIX}-primary-40`,
        mockPalettes.primary['40']
      );
      expect(mockElement.style.setProperty).toHaveBeenCalledWith(
        `--${COLOR_VAR_PREFIX}-secondary-80`,
        mockPalettes.secondary['80']
      );
      expect(mockElement.style.setProperty).toHaveBeenCalledWith(
        `--${COLOR_VAR_PREFIX}-error-90`,
        mockPalettes.error['90']
      );
      expect(mockElement.style.setProperty).toHaveBeenCalledWith(
        `--${COLOR_VAR_PREFIX}-neutral-10`,
        mockPalettes.neutral['10']
      );

      // The total number of calls should match the total number of shades
      const totalShades = Object.values(mockPalettes)
        .reduce((acc, palette) => acc + Object.keys(palette).length, 0);
      expect(mockElement.style.setProperty).toHaveBeenCalledTimes(totalShades);
    });
  });

  //-----------------------------//

  describe('applySystemVariables', () => {
    // Need to pass the theme object now
    it('should set primary color variables based on isDark flag (light)', () => {
      const setVariableSpy = jest.spyOn(service as any, 'setVariable');
      const theme = ThemeOption.create({ ...mockThemeOption, darkMode: false });

      (service as any).applySystemVariables(theme, mockPalettes, mockElement, false); // isDark = false

      expect(setVariableSpy).toHaveBeenCalledWith(mockElement, '--mat-sys-primary', mockPalettes.primary['40']);
      expect(setVariableSpy).toHaveBeenCalledWith(mockElement, '--mat-sys-on-primary', mockPalettes.primary['100']);
      // Check a few others
      expect(setVariableSpy).toHaveBeenCalledWith(mockElement, '--mat-sys-surface', mockPalettes.neutral['99']);
      expect(setVariableSpy).toHaveBeenCalledWith(mockElement, '--mat-sys-on-surface', mockPalettes.neutral['10']);
    });

    it('should set primary color variables based on isDark flag (dark)', () => {
      const setVariableSpy = jest.spyOn(service as any, 'setVariable');
      const theme = ThemeOption.create({ ...mockThemeOption, darkMode: true });

      (service as any).applySystemVariables(theme, mockPalettes, mockElement, true); // isDark = true

      expect(setVariableSpy).toHaveBeenCalledWith(mockElement, '--mat-sys-primary', mockPalettes.primary['80']);
      expect(setVariableSpy).toHaveBeenCalledWith(mockElement, '--mat-sys-on-primary', mockPalettes.primary['20']);
      // Check a few others
      expect(setVariableSpy).toHaveBeenCalledWith(mockElement, '--mat-sys-surface', mockPalettes.neutral['6']);
      expect(setVariableSpy).toHaveBeenCalledWith(mockElement, '--mat-sys-on-surface', mockPalettes.neutral['90']);
    });

    //- - - - - - - - - - - - - - -//

    it('should call addRGBVariables with the palettes and isDark flag', () => {
      const addRGBSpy = jest.spyOn(service as any, 'addRGBVariables');
      const theme = ThemeOption.create({ ...mockThemeOption, darkMode: false });

      (service as any).applySystemVariables(theme, mockPalettes, mockElement, false);
      expect(addRGBSpy).toHaveBeenCalledWith(mockPalettes, mockElement, false);

      addRGBSpy.mockClear();
      const darkTheme = ThemeOption.create({ ...mockThemeOption, darkMode: true });
      (service as any).applySystemVariables(darkTheme, mockPalettes, mockElement, true);
      expect(addRGBSpy).toHaveBeenCalledWith(mockPalettes, mockElement, true);
    });

    //- - - - - - - - - - - - - - -//

    it('should set seed color variables', () => {
      const setVariableSpy = jest.spyOn(service as any, 'setVariable');
      const theme = ThemeOption.create({ ...mockThemeOption });

      (service as any).applySystemVariables(theme, mockPalettes, mockElement, false);

      expect(setVariableSpy).toHaveBeenCalledWith(mockElement, '--mat-seed-primary', theme.primaryColor);
      expect(setVariableSpy).toHaveBeenCalledWith(mockElement, '--mat-seed-secondary', theme.secondaryColor);
      expect(setVariableSpy).toHaveBeenCalledWith(mockElement, '--mat-seed-tertiary', theme.tertiaryColor);
      expect(setVariableSpy).toHaveBeenCalledWith(mockElement, '--mat-seed-error', theme.errorColor);
    });

    it('should set seed color variables with defaults for missing optional colors', () => {
      const setVariableSpy = jest.spyOn(service as any, 'setVariable');
      const theme = ThemeOption.create({ // Use create to get defaults
        primaryColor: '#FF0000',
        secondaryColor: '#00FF00',
        value: 'minimal',
        label: 'Minimal'
      });

      (service as any).applySystemVariables(theme, mockPalettes, mockElement, false);

      expect(setVariableSpy).toHaveBeenCalledWith(mockElement, '--mat-seed-primary', theme.primaryColor);
      expect(setVariableSpy).toHaveBeenCalledWith(mockElement, '--mat-seed-secondary', theme.secondaryColor);
      // Check that defaults from ThemeOption.create are used
      expect(setVariableSpy).toHaveBeenCalledWith(mockElement, '--mat-seed-tertiary', DEFAULT_COLOR_TERTIARY);
      expect(setVariableSpy).toHaveBeenCalledWith(mockElement, '--mat-seed-error', DEFAULT_COLOR_ERROR);
    });
  });

  //-----------------------------//

  describe('addRGBVariables', () => {
    it('should call colorUtils.setRGBVariable for RGB variables (light)', () => {
      (service as any).addRGBVariables(mockPalettes, mockElement, false); // isDark = false

      expect(colorUtilsMock.setRGBVariable).toHaveBeenCalledWith(mockElement, '--mat-sys-primary-rgb', mockPalettes.primary['40']);
      expect(colorUtilsMock.setRGBVariable).toHaveBeenCalledWith(mockElement, '--mat-sys-on-primary-rgb', mockPalettes.primary['100']);
      expect(colorUtilsMock.setRGBVariable).toHaveBeenCalledWith(mockElement, '--mat-sys-surface-rgb', mockPalettes.neutral['99']);
      expect(colorUtilsMock.setRGBVariable).toHaveBeenCalledWith(mockElement, '--mat-sys-on-surface-rgb', mockPalettes.neutral['10']);
      expect(colorUtilsMock.setRGBVariable).toHaveBeenCalledTimes(9); // 9 RGB variables are set
    });

    it('should call colorUtils.setRGBVariable for RGB variables (dark)', () => {
      (service as any).addRGBVariables(mockPalettes, mockElement, true); // isDark = true

      expect(colorUtilsMock.setRGBVariable).toHaveBeenCalledWith(mockElement, '--mat-sys-primary-rgb', mockPalettes.primary['80']);
      expect(colorUtilsMock.setRGBVariable).toHaveBeenCalledWith(mockElement, '--mat-sys-on-primary-rgb', mockPalettes.primary['20']);
      expect(colorUtilsMock.setRGBVariable).toHaveBeenCalledWith(mockElement, '--mat-sys-surface-rgb', mockPalettes.neutral['6']);
      expect(colorUtilsMock.setRGBVariable).toHaveBeenCalledWith(mockElement, '--mat-sys-on-surface-rgb', mockPalettes.neutral['90']);
      expect(colorUtilsMock.setRGBVariable).toHaveBeenCalledTimes(9); // 9 RGB variables are set
    });
  });

  //-----------------------------//

  describe('exportThemeAsScss', () => {
    // Now takes theme as argument
    it('should call scssGenerator.exportThemeAsScss with the provided theme', () => {
      const result = service.exportThemeAsScss(mockThemeOption); // Pass theme directly

      expect(scssGeneratorMock.exportThemeAsScss).toHaveBeenCalledWith(mockThemeOption);
      expect(result).toBe('// SCSS mock content');
    });

    //- - - - - - - - - - - - - - -//

    // Test case for null/undefined theme
    it('should return empty string if theme is null or undefined', () => {
      expect(service.exportThemeAsScss(null as any)).toBe('');
      expect(service.exportThemeAsScss(undefined as any)).toBe('');
      expect(scssGeneratorMock.exportThemeAsScss).not.toHaveBeenCalled();
    });
  });

  //-----------------------------//

  describe('setVariable', () => {
    it('should call element.style.setProperty with the name and value', () => {
      (service as any).setVariable(mockElement, '--test-var', '#ff0000');
      expect(mockElement.style.setProperty).toHaveBeenCalledWith('--test-var', '#ff0000');
    });
  });

  //-----------------------------//

  describe('shouldUseDarkMode', () => {
    it('should return true if theme.darkMode is true', () => {
      const theme = ThemeOption.create({ ...mockThemeOption, darkMode: true });
      expect((service as any).shouldUseDarkMode(theme)).toBe(true);
    });

    it('should return false if theme.darkMode is false', () => {
      const theme = ThemeOption.create({ ...mockThemeOption, darkMode: false });
      expect((service as any).shouldUseDarkMode(theme)).toBe(false);
    });

    it('should return system preference if theme.darkMode is "system" (dark)', () => {
      systemPrefsMock.prefersDarkMode.mockReturnValue(true);
      const theme = ThemeOption.create({ ...mockThemeOption, darkMode: 'system' });
      expect((service as any).shouldUseDarkMode(theme)).toBe(true);
      expect(systemPrefsMock.prefersDarkMode).toHaveBeenCalled();
    });

    it('should return system preference if theme.darkMode is "system" (light)', () => {
      systemPrefsMock.prefersDarkMode.mockReturnValue(false);
      const theme = ThemeOption.create({ ...mockThemeOption, darkMode: 'system' });
      expect((service as any).shouldUseDarkMode(theme)).toBe(false);
      expect(systemPrefsMock.prefersDarkMode).toHaveBeenCalled();
    });

    it('should default to system preference if theme.darkMode is undefined (dark)', () => {
      systemPrefsMock.prefersDarkMode.mockReturnValue(true);
      // Create theme without explicitly setting darkMode, relying on ThemeOption.create default
      const theme = ThemeOption.create({
        primaryColor: '#FF0000',
        secondaryColor: '#00FF00',
        value: 'default-dark',
        label: 'Default Dark'
      });
      expect(theme.darkMode).toBe('system'); // Verify default
      expect((service as any).shouldUseDarkMode(theme)).toBe(true);
      expect(systemPrefsMock.prefersDarkMode).toHaveBeenCalled();
    });

    it('should default to system preference if theme.darkMode is undefined (light)', () => {
      systemPrefsMock.prefersDarkMode.mockReturnValue(false);
      const theme = ThemeOption.create({
        primaryColor: '#FF0000',
        secondaryColor: '#00FF00',
        value: 'default-light',
        label: 'Default Light'
      });
      expect(theme.darkMode).toBe('system'); // Verify default
      expect((service as any).shouldUseDarkMode(theme)).toBe(false);
      expect(systemPrefsMock.prefersDarkMode).toHaveBeenCalled();
    });
  });

});