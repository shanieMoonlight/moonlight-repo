import { DOCUMENT } from '@angular/common';
import { PLATFORM_ID, RendererFactory2 } from '@angular/core';
import { COLOR_VAR_PREFIX, DARK_MODE_CLASS, THEME_CLASS_PREFIX, ThemeOption } from "@spider-baby/material-theming/config";
import { ColorUtilsService } from '@spider-baby/material-theming/utils';
import { AnimationFrameService } from '@spider-baby/utils-testing';
import { GeneratedPalettes } from './models/theme-palletes';
import { PaletteGeneratorService } from './utils/palettes/palette-generator.service';
import { ScssPaletteGeneratorService } from './utils/scss/scss-palette-generator.service';
import { SystemPrefsService } from './utils/sytem-prefs/sytem-prefs.service';

import { fakeAsync, flush, TestBed, tick } from '@angular/core/testing'; // Import fakeAsync and tick/flush
import { ThemeGeneratorService } from './theme-generator.service';

describe('ThemeGeneratorService', () => {
  let service: ThemeGeneratorService;
  let rendererFactoryMock: { createRenderer: jest.Mock };
  let rendererMock: { addClass: jest.Mock; removeClass: jest.Mock };
  let colorUtilsMock: { setRGBVariable: jest.Mock };
  let paletteGeneratorMock: { generatePalettes: jest.Mock };
  let scssGeneratorMock: { exportThemeAsScss: jest.Mock };
  let systemPrefsMock: { prefersDarkMode: jest.Mock }; // Mock for SystemPrefsService
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
     darkMode: 'light' // Explicitly set darkMode
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
        contains: jest.fn(),
        // Add a proper forEach implementation
        forEach: jest.fn().mockImplementation(callback => {
          // Just implement it as empty by default (no classes)
          // Individual tests can override this behavior if needed
        })
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
    systemPrefsMock = { // Mock for SystemPrefsService
      prefersDarkMode: jest.fn().mockReturnValue(false) // Default to light mode
    };

    TestBed.configureTestingModule({
      providers: [
        ThemeGeneratorService,
        { provide: RendererFactory2, useValue: rendererFactoryMock },
        { provide: ColorUtilsService, useValue: colorUtilsMock },
        { provide: PaletteGeneratorService, useValue: paletteGeneratorMock },
        { provide: ScssPaletteGeneratorService, useValue: scssGeneratorMock },
        { provide: SystemPrefsService, useValue: systemPrefsMock }, // Provide mock
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
         darkMode: 'light'
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
         darkMode: 'light'
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

    it('should remove old theme classes when applying a new theme', fakeAsync(() => {
      // Setup mock element with existing theme classes
      const mockElementWithClasses = {
        style: {
          setProperty: jest.fn(),
          getPropertyValue: jest.fn()
        },
        classList: {
          forEach: jest.fn().mockImplementation(callback => {
            // Simulate existing classes including one matching the theme prefix
            callback(`${THEME_CLASS_PREFIX}-old-theme`);
            callback('other-class');
          }),
          add: jest.fn(),
          remove: jest.fn(),
          contains: jest.fn()
        }
      } as unknown as HTMLElement;
      
      // Spy on our renderer methods since we'll be using those to add/remove classes
      // (We assume applyThemeAndModeClassess might not exist, so let's fix that too)
      
      // Apply a new theme
      service.applyTheme(mockThemeOption, undefined, mockElementWithClasses);
      flush();
      
      // The renderer should remove the old theme class
      expect(rendererMock.removeClass).toHaveBeenCalledWith(
        mockElementWithClasses,
        `${THEME_CLASS_PREFIX}-old-theme`
      );
      
      // And add the new theme class
      expect(rendererMock.addClass).toHaveBeenCalledWith(
        mockElementWithClasses,
        `${THEME_CLASS_PREFIX}-${mockThemeOption.value}`
      );
    }));

    //- - - - - - - - - - - - - - -//

    it('should call applySystemVariables with the correct parameters (light mode)', fakeAsync(() => {
      const systemSpy = jest.spyOn(service as any, 'applySystemVariables');
      systemPrefsMock.prefersDarkMode.mockReturnValue(false); // Ensure system is light
      const theme = ThemeOption.create({ ...mockThemeOption,  darkMode: 'light' }); // Explicit light

      service.applyTheme(theme, undefined, mockElement);
      flush(); // Process requestAnimationFrame

      expect(systemSpy).toHaveBeenCalledWith(theme, false, mockPalettes, mockElement); // Corrected parameter order
    }));

    it('should call applySystemVariables with the correct parameters (dark mode)', fakeAsync(() => {
      const systemSpy = jest.spyOn(service as any, 'applySystemVariables');
      systemPrefsMock.prefersDarkMode.mockReturnValue(true); // Ensure system is dark
      const theme = ThemeOption.create({ ...mockThemeOption,  darkMode: 'dark' }); // Explicit dark

      service.applyTheme(theme, undefined, mockElement);
      flush(); // Process requestAnimationFrame

      expect(systemSpy).toHaveBeenCalledWith(theme, true, mockPalettes, mockElement); // Corrected parameter order
    }));

    it('should call applySystemVariables with the correct parameters (system mode - dark)', fakeAsync(() => {
      const systemSpy = jest.spyOn(service as any, 'applySystemVariables');
      systemPrefsMock.prefersDarkMode.mockReturnValue(true); // System prefers dark

      service.applyTheme(mockThemeOptionSystemDark, undefined, mockElement);
      flush(); // Process requestAnimationFrame

      expect(systemSpy).toHaveBeenCalledWith(mockThemeOptionSystemDark, true, mockPalettes, mockElement); // Corrected parameter order
    }));

    it('should call applySystemVariables with the correct parameters (system mode - light)', fakeAsync(() => {
      const systemSpy = jest.spyOn(service as any, 'applySystemVariables');
      systemPrefsMock.prefersDarkMode.mockReturnValue(false); // System prefers light

      service.applyTheme(mockThemeOptionSystemDark, undefined, mockElement);
      flush(); // Process requestAnimationFrame

      expect(systemSpy).toHaveBeenCalledWith(mockThemeOptionSystemDark, false, mockPalettes, mockElement); // Corrected parameter order
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
      const darkTheme = ThemeOption.create({ ...mockThemeOption,  darkMode: 'dark' });
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
      const lightTheme = ThemeOption.create({ ...mockThemeOption,  darkMode: 'light' });
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
         darkMode: 'light'
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

  describe('applySystemVariables behaviors', () => {
    // Replace direct invocation of private method with public API
    
    it('should set primary color variables based on dark mode setting (light)', fakeAsync(() => {
      // Set up light mode theme
      const lightTheme = ThemeOption.create({ 
        ...mockThemeOption, 
         darkMode: 'light' 
      });
      
      // Call the public method instead of directly testing the private method
      service.applyTheme(lightTheme, undefined, mockElement);
      flush(); // Process requestAnimationFrame
      
      // Verify CSS variables were properly set with expected values
      expect(mockElement.style.setProperty).toHaveBeenCalledWith('--mat-sys-primary', mockPalettes.primary['40']);
      expect(mockElement.style.setProperty).toHaveBeenCalledWith('--mat-sys-on-primary', mockPalettes.primary['100']);
      expect(mockElement.style.setProperty).toHaveBeenCalledWith('--mat-sys-surface', mockPalettes.neutral['99']);
      expect(mockElement.style.setProperty).toHaveBeenCalledWith('--mat-sys-on-surface', mockPalettes.neutral['10']);
    }));
  
    it('should set primary color variables based on dark mode setting (dark)', fakeAsync(() => {
      // Set up dark mode theme
      const darkTheme = ThemeOption.create({ 
        ...mockThemeOption, 
         darkMode: 'dark' 
      });
      
      // Call the public method
      service.applyTheme(darkTheme, undefined, mockElement);
      flush();
      
      // Verify expected CSS variables
      expect(mockElement.style.setProperty).toHaveBeenCalledWith('--mat-sys-primary', mockPalettes.primary['80']);
      expect(mockElement.style.setProperty).toHaveBeenCalledWith('--mat-sys-on-primary', mockPalettes.primary['20']);
      expect(mockElement.style.setProperty).toHaveBeenCalledWith('--mat-sys-surface', mockPalettes.neutral['6']);
      expect(mockElement.style.setProperty).toHaveBeenCalledWith('--mat-sys-on-surface', mockPalettes.neutral['90']);
    }));
  
    it('should set original seed color variables', fakeAsync(() => {
      const theme = ThemeOption.create({ 
        ...mockThemeOption
      });
      
      service.applyTheme(theme, undefined, mockElement);
      flush();
      
      // Verify the original seed colors are set as CSS variables
      expect(mockElement.style.setProperty).toHaveBeenCalledWith('--mat-seed-primary', theme.primaryColor);
      expect(mockElement.style.setProperty).toHaveBeenCalledWith('--mat-seed-secondary', theme.secondaryColor);
      expect(mockElement.style.setProperty).toHaveBeenCalledWith('--mat-seed-tertiary', theme.tertiaryColor);
      expect(mockElement.style.setProperty).toHaveBeenCalledWith('--mat-seed-error', theme.errorColor);
    }));
  
    it('should set RGB color variables for transparency support', fakeAsync(() => {
      service.applyTheme(mockThemeOption, undefined, mockElement);
      flush();
      
      // Verify RGB variables
      expect(colorUtilsMock.setRGBVariable).toHaveBeenCalledWith(
        mockElement, 
        '--mat-sys-surface-rgb', 
        mockPalettes.neutral['99']
      );
      // Check other key RGB variables as needed
    }));
  });

  //-----------------------------//

  describe('addRGBVariables', () => {
    it('should call colorUtils.setRGBVariable for RGB variables (light)', () => {
      (service as any).addRGBVariables(mockPalettes, mockElement, false); // isDark = false

      expect(colorUtilsMock.setRGBVariable).toHaveBeenCalledWith(mockElement, '--mat-sys-primary-rgb', mockPalettes.primary['40']);
      expect(colorUtilsMock.setRGBVariable).toHaveBeenCalledWith(mockElement, '--mat-sys-on-primary-rgb', mockPalettes.primary['100']);
      expect(colorUtilsMock.setRGBVariable).toHaveBeenCalledWith(mockElement, '--mat-sys-surface-rgb', mockPalettes.neutral['99']);
      expect(colorUtilsMock.setRGBVariable).toHaveBeenCalledWith(mockElement, '--mat-sys-on-surface-rgb', mockPalettes.neutral['10']);
      expect(colorUtilsMock.setRGBVariable).toHaveBeenCalledTimes(17); // 9 RGB variables are set
    });

    it('should call colorUtils.setRGBVariable for RGB variables (dark)', () => {
      (service as any).addRGBVariables(mockPalettes, mockElement, true); // isDark = true

      expect(colorUtilsMock.setRGBVariable).toHaveBeenCalledWith(mockElement, '--mat-sys-primary-rgb', mockPalettes.primary['80']);
      expect(colorUtilsMock.setRGBVariable).toHaveBeenCalledWith(mockElement, '--mat-sys-on-primary-rgb', mockPalettes.primary['20']);
      expect(colorUtilsMock.setRGBVariable).toHaveBeenCalledWith(mockElement, '--mat-sys-surface-rgb', mockPalettes.neutral['6']);
      expect(colorUtilsMock.setRGBVariable).toHaveBeenCalledWith(mockElement, '--mat-sys-on-surface-rgb', mockPalettes.neutral['90']);
      expect(colorUtilsMock.setRGBVariable).toHaveBeenCalledTimes(17); // 9 RGB variables are set
    });
  });

  //-----------------------------//

  describe('exportThemeAsScss', () => {
    // Now takes theme as argument
    it('should call scssGenerator exportThemeAsScss  with the provided theme', () => {
      const result = service['exportThemeAsScss'](mockThemeOption); // Pass theme directly

      expect(scssGeneratorMock['exportThemeAsScss']).toHaveBeenCalledWith(mockThemeOption);
      expect(result).toBe('// SCSS mock content');
    });

    //- - - - - - - - - - - - - - -//

    // Test case for null/undefined theme
    it('should return empty string if theme is null or undefined', () => {
      expect(service['exportThemeAsScss'](null as any)).toBe('');
      expect(service['exportThemeAsScss'](undefined as any)).toBe('');
      expect(scssGeneratorMock['exportThemeAsScss']).not.toHaveBeenCalled();
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
      const theme = ThemeOption.create({ ...mockThemeOption,  darkMode: 'dark' });
      expect((service as any).shouldUseDarkMode(theme)).toBe(true);
    });

    it('should return false if theme.darkMode is false', () => {
      const theme = ThemeOption.create({ ...mockThemeOption,  darkMode: 'light' });
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

  //-----------------------------//

  describe('Memoization', () => {
    it('should use cached palettes for identical themes', fakeAsync(() => {
      // Call the first time - should generate new palettes
      service.applyTheme(mockThemeOption);
      flush();
      
      // Reset call count
      paletteGeneratorMock.generatePalettes.mockClear();
      
      // Call again with same theme - should use cache
      service.applyTheme(mockThemeOption);
      flush();
      
      // Verify the palette generator wasn't called again
      expect(paletteGeneratorMock.generatePalettes).not.toHaveBeenCalled();
    }));
    
    it('should generate new palettes for different themes', fakeAsync(() => {
      // First call with original theme
      service.applyTheme(mockThemeOption);
      flush();
      
      // Reset call count
      paletteGeneratorMock.generatePalettes.mockClear();
      
      // Call with different theme
      const differentTheme = ThemeOption.create({
        primaryColor: '#0000FF', // Different from mockThemeOption
        secondaryColor: '#00FF00',
        value: 'different-theme',
        label: 'Different Theme'
      });
      
      service.applyTheme(differentTheme);
      flush();
      
      // Should have generated new palettes
      expect(paletteGeneratorMock.generatePalettes).toHaveBeenCalledWith(differentTheme);
    }));
    
    it('should use cache based on color values, not theme names', fakeAsync(() => {
      // First call with original theme
      service.applyTheme(mockThemeOption);
      flush();
      
      // Reset call count
      paletteGeneratorMock.generatePalettes.mockClear();
      
      // Same colors but different name
      const sameColorsTheme = ThemeOption.create({
        ...mockThemeOption,
        value: 'different-name',
        label: 'Different Name than value'
      });
      
      service.applyTheme(sameColorsTheme);
      flush();
      
      // Should use cache since colors are the same
      expect(paletteGeneratorMock.generatePalettes).not.toHaveBeenCalled();
    }));
    
    it('should generate new palettes when color values change', fakeAsync(() => {
      // First call with original theme
      service.applyTheme(mockThemeOption);
      flush();
      
      // Reset call count
      paletteGeneratorMock.generatePalettes.mockClear();
      
      // Same name but different colors
      const differentColorsTheme = ThemeOption.create({
        ...mockThemeOption,
        primaryColor: '#0000FF' // Different primary color
      });
      
      service.applyTheme(differentColorsTheme);
      flush();
      
      // Should generate new palettes due to color change
      expect(paletteGeneratorMock.generatePalettes).toHaveBeenCalledWith(differentColorsTheme);
    }));
  });

});