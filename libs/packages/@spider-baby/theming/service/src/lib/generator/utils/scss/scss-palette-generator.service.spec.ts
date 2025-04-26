import { TestBed } from '@angular/core/testing';
import { ScssPaletteGeneratorService } from './scss-palette-generator.service';
import { PaletteGeneratorService } from '../palettes/palette-generator.service';
import { DEFAULT_COLOR_ERROR, DEFAULT_COLOR_TERTIARY, PALETTES_MAP_SCSS_VAR, ThemeOption } from '../../../../../../config/src/index';

describe('ScssPaletteGeneratorService', () => {
  let service: ScssPaletteGeneratorService;
  let paletteGeneratorMock: { generatePalettes: jest.Mock };

  const mockTheme: ThemeOption = {
    primaryColor: '#FF0000',
    secondaryColor: '#00FF00',
    tertiaryColor: '#0000FF',
    errorColor: '#FF00FF',
    value: 'test-theme',
    label: 'Test Theme',
     defaultDarkMode: 'light'
  };

  const mockPalettes = {
    primary: {
      '10': '#ffebee',
      '20': '#ffcdd2',
      '50': '#ef5350'
    },
    secondary: {
      '10': '#e8f5e9',
      '20': '#c8e6c9',
      '50': '#66bb6a'
    },
    tertiary: {
      '10': '#e3f2fd',
      '20': '#bbdefb',
      '50': '#42a5f5'
    },
    neutral: {
      '10': '#f5f5f5',
      '90': '#212121'
    },
    neutralVariant: {
      '10': '#f5f5f5',
      '90': '#212121'
    },
    error: {
      '10': '#ffebee',
      '50': '#ef5350'
    }
  };

  beforeEach(() => {
    // Create mock for PaletteGeneratorService with Jest
    const paletteMock = { generatePalettes: jest.fn().mockReturnValue(mockPalettes) };
    
    TestBed.configureTestingModule({
      providers: [
        ScssPaletteGeneratorService,
        { provide: PaletteGeneratorService, useValue: paletteMock }
      ]
    });
    
    service = TestBed.inject(ScssPaletteGeneratorService);
    paletteGeneratorMock = TestBed.inject(PaletteGeneratorService) as any;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return empty string for null/undefined theme', () => {
    expect(service.exportThemeAsScss(null as any)).toBe('');
    expect(service.exportThemeAsScss(undefined as any)).toBe('');
  });

  it('should call paletteGenerator.generatePalettes with the theme', () => {
    service.exportThemeAsScss(mockTheme);
    expect(paletteGeneratorMock.generatePalettes).toHaveBeenCalledWith(mockTheme);
  });

  it('should include all source colors in the comments', () => {
    const result = service.exportThemeAsScss(mockTheme);
    
    expect(result).toContain(`// Primary: ${mockTheme.primaryColor}`);
    expect(result).toContain(`// Secondary: ${mockTheme.secondaryColor}`);
    expect(result).toContain(`// Tertiary: ${mockTheme.tertiaryColor}`);
    expect(result).toContain(`// Error: ${mockTheme.errorColor}`);
  });

  it('should use default values in comments when colors are missing', () => {
    const incompleteTheme: ThemeOption = ThemeOption.create( {
      primaryColor: '#FF0000',
      secondaryColor: '#00FF00',
      value: 'incomplete',
      label: 'Incomplete Theme',
       defaultDarkMode: 'light'
    })
    
    const result = service.exportThemeAsScss(incompleteTheme);

    console.log('result', result); // For debugging
    
    
    expect(result).toContain(`// Tertiary: ${DEFAULT_COLOR_TERTIARY}`);
    expect(result).toContain(`// Error: ${DEFAULT_COLOR_ERROR}`);
  });

  it('should format SCSS correctly with the palette map variable', () => {
    const result = service.exportThemeAsScss(mockTheme);
    
    // Check for map variable name
    expect(result).toContain(`${PALETTES_MAP_SCSS_VAR}: (`);
    
    // Check for primary at root level
    expect(result).toContain('  10: #ffebee,');
    expect(result).toContain('  20: #ffcdd2,');
    
    // Check for nested palettes
    expect(result).toContain('  secondary: (');
    expect(result).toContain('    10: #e8f5e9,');
    
    // Check for closing syntax
    expect(result).toContain(');');
  });

  it('should handle all palettes from generatePalettes', () => {
    const result = service.exportThemeAsScss(mockTheme);
    
    // Check all palette names are included
    expect(result).toContain('  secondary: (');
    expect(result).toContain('  tertiary: (');
    expect(result).toContain('  neutral: (');
    expect(result).toContain('  neutralVariant: (');
    expect(result).toContain('  error: (');
  });
});
