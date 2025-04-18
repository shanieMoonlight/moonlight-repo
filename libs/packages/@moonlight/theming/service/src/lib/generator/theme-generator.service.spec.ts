import { TestBed } from '@angular/core/testing';
import { ThemeGeneratorService } from './theme-generator.service';
import { RendererFactory2, Renderer2 } from '@angular/core';
import { COLOR_VAR_PREFIX, DARK_MODE_CLASS, THEME_CLASS_PREFIX, ThemeOption } from '../../../../config/src/index';
import { ColorUtilsService } from '../../../../utils/src/index';
import { PaletteGeneratorService } from './utils/palettes/palette-generator.service';
import { ScssPaletteGeneratorService } from './utils/scss/scss-palette-generator.service';
import { GeneratedPalettes } from './models/theme-palletes';

describe('ThemeGeneratorService', () => {
  let service: ThemeGeneratorService;
  let rendererFactoryMock: { createRenderer: jest.Mock };
  let rendererMock: { addClass: jest.Mock; removeClass: jest.Mock };
  let colorUtilsMock: { setRGBVariable: jest.Mock };
  let paletteGeneratorMock: { generatePalettes: jest.Mock };
  let scssGeneratorMock: { exportThemeAsScss: jest.Mock };

  // Mock DOM Element
  // let mockElement: Partial<HTMLElement> & {
  //   style: Partial<CSSStyleDeclaration> & {
  //     setProperty: jest.Mock
  //   }
  // };
  let mockElement: HTMLElement;

  // Mock theme options
  const mockThemeOption: ThemeOption = {
    primaryColor: '#FF0000',
    secondaryColor: '#00FF00',
    tertiaryColor: '#0000FF',
    errorColor: '#FF00FF',
    value: 'test-theme',
    label: 'Test Theme',
    fallbackIsDarkMode: false
  };

  // Mock generated palettes
  const mockPalettes: GeneratedPalettes = {
    primary: {
      '10': '#ffebee',
      '20': '#ffcdd2',
      '40': '#ef5350',
      '80': '#c62828',
      '90': '#b71c1c',
      '100': '#ffebee'
    },
    secondary: {
      '10': '#e8f5e9',
      '20': '#c8e6c9',
      '40': '#66bb6a',
      '80': '#2e7d32',
      '90': '#1b5e20',
      '100': '#e8f5e9'
    },
    tertiary: {
      '10': '#e3f2fd',
      '20': '#bbdefb',
      '40': '#42a5f5',
      '80': '#0d47a1',
      '90': '#082e7b',
      '100': '#e3f2fd'
    },
    neutral: {
      '0': '#000000',
      '4': '#121212',
      '6': '#1e1e1e',
      '10': '#f5f5f5',
      '12': '#1f1f1f',
      '17': '#2a2a2a',
      '20': '#303030',
      '22': '#383838',
      '24': '#3d3d3d',
      '87': '#dfdfdf',
      '90': '#e0e0e0',
      '92': '#ebebeb',
      '94': '#f3f3f3',
      '95': '#f5f5f5',
      '96': '#f8f8f8',
      '98': '#fafafa',
      '99': '#fcfcfc',
      '100': '#ffffff'
    },
    neutralVariant: {
      '20': '#4f4f4f',
      '30': '#686868',
      '50': '#808080',
      '60': '#989898',
      '80': '#c6c6c6',
      '90': '#e0e0e0'
    },
    error: {
      '10': '#ffebee',
      '20': '#ffcdd2',
      '40': '#ef5350',
      '80': '#c62828',
      '90': '#b71c1c',
      '100': '#ffebee'
    }
  };

  //-----------------------------//

  beforeEach(() => {
    // Create mocks
    // mockElement = {
    //   style: {
    //     setProperty: jest.fn()
    //   }
    // };
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

    TestBed.configureTestingModule({
      providers: [
        ThemeGeneratorService,
        { provide: RendererFactory2, useValue: rendererFactoryMock },
        { provide: ColorUtilsService, useValue: colorUtilsMock },
        { provide: PaletteGeneratorService, useValue: paletteGeneratorMock },
        { provide: ScssPaletteGeneratorService, useValue: scssGeneratorMock }
      ]
    });

    service = TestBed.inject(ThemeGeneratorService);

    // Replace document.documentElement with our mock in tests
    global.document = {
      documentElement: mockElement as any
    } as any;
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
    it('should update currentTheme$ with the provided colors', () => {
      // Setup a spy to observe the BehaviorSubject
      const nextSpy = jest.spyOn(service['currentTheme$'], 'next');

      service.applyTheme(mockThemeOption);

      expect(nextSpy).toHaveBeenCalledWith(mockThemeOption);
    });

    //- - - - - - - - - - - - - - -//

    it('should call paletteGenerator.generatePalettes with the theme option', () => {
      service.applyTheme(mockThemeOption);

      expect(paletteGeneratorMock.generatePalettes).toHaveBeenCalledWith(mockThemeOption);
    });

    //- - - - - - - - - - - - - - -//

    it('should call applyPaletteVariables with the generated palettes', () => {
      // Spy on the private method
      const paletteSpy = jest.spyOn(service as any, 'applyPaletteVariables').mockImplementation();

      service.applyTheme(mockThemeOption);

      expect(paletteSpy).toHaveBeenCalledWith(mockPalettes, document.documentElement);
    });

    //- - - - - - - - - - - - - - -//

    it('should call applySystemVariables with the correct parameters', () => {
      // Spy on the private method
      const systemSpy = jest.spyOn(service as any, 'applySystemVariables');

      service.applyTheme(mockThemeOption, mockElement, true);

      console.log('mockThemeOption', mockThemeOption);
      console.log('mockPalettes', mockPalettes);


      expect(systemSpy).toHaveBeenCalledWith(mockPalettes, mockElement, true);
    });

    //- - - - - - - - - - - - - - -//

    it('should add theme class if themeClass is provided', () => {
      service.applyTheme(mockThemeOption, mockElement, false, 'custom');

      expect(rendererMock.addClass).toHaveBeenCalledWith(
        mockElement,
        `${THEME_CLASS_PREFIX}-custom`
      );
    });

    //- - - - - - - - - - - - - - -//

    it('should add dark mode class if isDark is true', () => {
      service.applyTheme(mockThemeOption, mockElement, true);

      expect(rendererMock.addClass).toHaveBeenCalledWith(
        mockElement,
        DARK_MODE_CLASS
      );
    });

    //- - - - - - - - - - - - - - -//

    it('should remove dark mode class if isDark is false', () => {
      service.applyTheme(mockThemeOption, mockElement, false);

      expect(rendererMock.removeClass).toHaveBeenCalledWith(
        mockElement,
        DARK_MODE_CLASS
      );
    });
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

      // The total number of calls should match the total number of shades
      const totalShades = Object.values(mockPalettes)
        .reduce((acc, palette) => acc + Object.keys(palette).length, 0);

      expect(mockElement.style.setProperty).toHaveBeenCalledTimes(totalShades);
    });
  });

  //-----------------------------//

  describe('applySystemVariables', () => {
    it('should set primary color variables based on isDark flag', () => {
      const setVariableSpy = jest.spyOn(service as any, 'setVariable');

      // Test light mode
      (service as any).applySystemVariables(mockPalettes, mockElement, false);

      expect(setVariableSpy).toHaveBeenCalledWith(
        mockElement,
        '--mat-sys-primary',
        mockPalettes.primary['40']
      );

      setVariableSpy.mockClear();

      // Test dark mode
      (service as any).applySystemVariables(mockPalettes, mockElement, true);

      expect(setVariableSpy).toHaveBeenCalledWith(
        mockElement,
        '--mat-sys-primary',
        mockPalettes.primary['80']
      );
    });

    //- - - - - - - - - - - - - - -//

    it('should call addRGBVariables with the palettes', () => {
      const addRGBSpy = jest.spyOn(service as any, 'addRGBVariables');

      (service as any).applySystemVariables(mockPalettes, mockElement, false);

      expect(addRGBSpy).toHaveBeenCalledWith(mockPalettes, mockElement, false);
    });
  });

  //-----------------------------//

  describe('addRGBVariables', () => {
    it('should call colorUtils.setRGBVariable for RGB variables', () => {
      (service as any).addRGBVariables(mockPalettes, mockElement, false);

      expect(colorUtilsMock.setRGBVariable).toHaveBeenCalledWith(
        mockElement,
        '--mat-sys-primary-rgb',
        mockPalettes.primary['40']
      );

      expect(colorUtilsMock.setRGBVariable).toHaveBeenCalledTimes(9); // 9 RGB variables are set
    });
  });

  //-----------------------------//

  describe('exportThemeAsScss', () => {
    it('should call scssGenerator.exportThemeAsScss with the current theme', () => {
      // Set a current theme
      service.applyTheme(mockThemeOption);

      const result = service.exportThemeAsScss();

      expect(scssGeneratorMock.exportThemeAsScss).toHaveBeenCalledWith(mockThemeOption);
      expect(result).toBe('// SCSS mock content');
    });

    //- - - - - - - - - - - - - - -//

    it('should return empty string if no current theme exists', () => {
      // Make sure no theme is set
      service['currentTheme$'].next(null);

      const result = service.exportThemeAsScss();

      expect(result).toBe('');
      expect(scssGeneratorMock.exportThemeAsScss).not.toHaveBeenCalled();
    });
  });

  //-----------------------------//

  describe('setVariable', () => {
    it('should call element.style.setProperty with the name and value', () => {
      (service as any).setVariable(mockElement, '--test-var', '#ff0000');

      expect(mockElement.style.setProperty).toHaveBeenCalledWith(
        '--test-var',
        '#ff0000'
      );
    });
  });
});