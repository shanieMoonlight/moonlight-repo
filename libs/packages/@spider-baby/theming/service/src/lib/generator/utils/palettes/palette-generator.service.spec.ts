import { TestBed } from '@angular/core/testing';
import { argbFromHex, themeFromSourceColor, TonalPalette } from '@material/material-color-utilities';
import { DEFAULT_COLOR_ERROR, DEFAULT_COLOR_TERTIARY, ThemeConfigService, ThemeOption, ThemingConfig } from '@spider-baby/material-theming/config';
import { PaletteGeneratorService } from './palette-generator.service';

// Mock the Material Color Utilities to control their behavior
jest.mock('@material/material-color-utilities', () => {
  // Create mock implementations for each function
  const argbFromHex = jest.fn(hex => {
    // Simple mock that returns different values for different colors
    if (hex === '#FF0000') return 4294901760; // Red in ARGB
    if (hex === '#00FF00') return 4278255360; // Green in ARGB
    if (hex === '#0000FF') return 4278190335; // Blue in ARGB
    if (hex === '#FF00FF') return 4294902015; // Magenta in ARGB
    return 4278190080; // Default black
  });

  const hexFromArgb = jest.fn(argb => {
    // Return predictable hex values based on tone and color
    return '#MOCK' + argb.toString(16);
  });

  // Mock theme object with palettes
  const mockThemeObj = {
    palettes: {
      primary: { tone: (tone: number) => 1000 + tone },
      neutral: { tone: (tone: number) => 2000 + tone },
      neutralVariant: { tone: (tone: number) => 3000 + tone },
      error: { tone: (tone: number) => 4000 + tone },
    }
  };

  // Mock TonalPalette
  const TonalPalette = {
    fromInt: jest.fn((color) => ({
      tone: (tone: number) => {
        if (color === 4278255360) return 5000 + tone; // Secondary
        if (color === 4278190335) return 6000 + tone; // Tertiary
        return 7000 + tone; // Default
      }
    }))
  };

  const themeFromSourceColor = jest.fn(() => mockThemeObj);

  return {
    argbFromHex,
    hexFromArgb,
    themeFromSourceColor,
    TonalPalette
  };
});

//-----------------------------//

describe('PaletteGeneratorService', () => {
  let service: PaletteGeneratorService;
  let configServiceMock: Partial<typeof ThemeConfigService>;

  // Create a mock ThemeConfig with sample color tones
  const mockConfig: Partial<ThemingConfig> = {
    colorTones: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 95, 99, 100]
  };

  //-----------------------------//

  beforeEach(() => {
    // Setup mock for ThemeConfigService
    configServiceMock = mockConfig as Partial<typeof ThemeConfigService>;

    TestBed.configureTestingModule({
      providers: [
        PaletteGeneratorService,
        { provide: ThemeConfigService, useValue: configServiceMock }
      ]
    });

    service = TestBed.inject(PaletteGeneratorService);
  });

  //-----------------------------//

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  //- - - - - - - - - - - - - - -//

  it('should call Material Color utilities with correct color values', () => {
    // Create a test theme option
    const themeOption: ThemeOption = {
      primaryColor: '#FF0000',
      secondaryColor: '#00FF00',
      tertiaryColor: '#0000FF',
      errorColor: '#FF00FF',
      value: 'test-theme',
      label: 'Test Theme',
      darkMode: 'light'
    };

    service.generatePalettes(themeOption);

    // Verify argbFromHex was called with the correct colors
    expect(argbFromHex).toHaveBeenCalledWith('#FF0000');
    expect(argbFromHex).toHaveBeenCalledWith('#00FF00');
    expect(argbFromHex).toHaveBeenCalledWith('#0000FF');
    expect(argbFromHex).toHaveBeenCalledWith('#FF00FF');

    // Verify themeFromSourceColor was called
    expect(themeFromSourceColor).toHaveBeenCalled();

    // Verify TonalPalette.fromInt was called for secondary and tertiary
    expect(TonalPalette.fromInt).toHaveBeenCalledTimes(3); // secondary, tertiary, error  
  });

  //- - - - - - - - - - - - - - -//

  it('should use default colors when not provided in the theme option', () => {
    // Create a minimal theme option with only required fields
    const themeOption: ThemeOption = ThemeOption.create({
      primaryColor: '#FF0000',
      secondaryColor: '#00FF00',
      value: 'minimal-theme',
      label: 'Minimal Theme',
       darkMode: 'light'
    });

    service.generatePalettes(themeOption);

    // Verify default tertiary and error colors were used
    expect(argbFromHex).toHaveBeenCalledWith(DEFAULT_COLOR_TERTIARY);
    expect(argbFromHex).toHaveBeenCalledWith(DEFAULT_COLOR_ERROR);
  });

  //- - - - - - - - - - - - - - -//

  it('should generate palettes for all specified tones', () => {
    const themeOption: ThemeOption = {
      primaryColor: '#FF0000',
      secondaryColor: '#00FF00',
      tertiaryColor: '#0000FF',
      errorColor: '#FF00FF',
      value: 'test-theme',
      label: 'Test Theme',
       darkMode: 'light'
    };

    const result = service.generatePalettes(themeOption);

    // Check we have the correct number of tones in each palette
    // Should have 13 tones as specified in the mock config
    expect(Object.keys(result.primary).length).toBe(13);
    expect(Object.keys(result.secondary).length).toBe(13);
    expect(Object.keys(result.tertiary).length).toBe(13);
    expect(Object.keys(result.error).length).toBe(13);
    expect(Object.keys(result.neutral).length).toBe(13);
    expect(Object.keys(result.neutralVariant).length).toBe(13);
  });

  //- - - - - - - - - - - - - - -//

  it('should sanitize tone values correctly', () => {
    // Override the mock config with invalid values that need sanitizing
    (configServiceMock as any).colorTones = [
      -10, // Below minimum (should be filtered out)
      0, // Minimum valid value
      10.5, // Should be rounded to 11
      50,
      100, // Maximum valid value
      110 // Above maximum (should be filtered out)
    ];

    const themeOption: ThemeOption =ThemeOption.create( {
      primaryColor: '#FF0000',
      secondaryColor: '#00FF00',
      value: 'test-theme',
      label: 'Test Theme',
       darkMode: 'light'
    });

    const result = service.generatePalettes(themeOption);

    console.log('result', result.primary, Object.keys(result.primary).sort());
    

    // Should only contain the valid, sanitized tones (0, 11, 50, 100)
    const expectedTones = ['0', `${Math.round(10.5)}`, '50', '100'].sort()
    expect(Object.keys(result.primary).sort()).toEqual(expectedTones);
  });

  //- - - - - - - - - - - - - - -//

  it('should return an object with all required palette types', () => {
    const themeOption: ThemeOption = ThemeOption.create({
      primaryColor: '#FF0000',
      secondaryColor: '#00FF00',
      value: 'test-theme',
      label: 'Test Theme',
       darkMode: 'light'
    });

    const result = service.generatePalettes(themeOption);

    // Verify all palette types exist
    expect(result).toHaveProperty('primary');
    expect(result).toHaveProperty('secondary');
    expect(result).toHaveProperty('tertiary');
    expect(result).toHaveProperty('error');
    expect(result).toHaveProperty('neutral');
    expect(result).toHaveProperty('neutralVariant');
  });

  //- - - - - - - - - - - - - - -//

  it('should handle nullish theme input with defaults', () => {
    // Test with empty/undefined values
    const themeOption: ThemeOption = ThemeOption.create({
      primaryColor: '#44dd55',
      secondaryColor: '#46dd55',
      value: 'empty-theme',
      label: 'Empty Theme',
       darkMode: 'light'
    });

    const result = service.generatePalettes(themeOption);

    // Verify defaults were used for all colors
    expect(argbFromHex).toHaveBeenCalledWith(DEFAULT_COLOR_TERTIARY);
    expect(argbFromHex).toHaveBeenCalledWith(DEFAULT_COLOR_ERROR);

    // Verify we still get valid palette structure
    expect(Object.keys(result.primary).length).toBeGreaterThan(0);
  });
});
