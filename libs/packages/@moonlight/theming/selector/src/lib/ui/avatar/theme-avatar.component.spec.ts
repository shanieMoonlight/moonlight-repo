import { render, screen } from '@testing-library/angular';
import { ThemeAvatarComponent } from './theme-avatar.component';
import { ThemeOption } from '../../../../../config/src/index';
import '@testing-library/jest-dom';

// Helper function to create mock ThemeOption
const createMockTheme = (overrides: Partial<ThemeOption> = {}): ThemeOption => ({
  label: 'Test Theme',
  value: 'test-theme',
  primaryColor: '#673AB7', // Deep Purple 500
  secondaryColor: '#FFC107', // Amber 500
  tertiaryColor: '#03A9F4', // Light Blue 500
  errorColor: '#F44336', // Red 500
  darkMode: false,
  ...overrides,
});

//-----------------------------//

describe('ThemeAvatarComponent', () => {
  // Helper function to add data-testid attributes using nativeElement
  const addDataTestIds = (element: HTMLElement) => { // Accept HTMLElement
    if (element) {
      // Query directly on the provided element
      const swatches = element.querySelectorAll('.swatch');
      console.log('Swatches found in element:', swatches); // Debug log

      if (swatches.length === 3) {
        swatches[0].setAttribute('data-testid', 'secondary-swatch');
        swatches[1].setAttribute('data-testid', 'primary-swatch');
        swatches[2].setAttribute('data-testid', 'tertiary-swatch');
        console.log('data-testid attributes set.'); // Debug log
      } else {
        console.warn(`Expected 3 swatches, found ${swatches.length}. data-testid attributes not set.`); // Debug log
      }
    } else {
      console.error('addDataTestIds received null or undefined element.'); // Debug log
    }
  };

  //-----------------------------//

  it('should render and apply colors from theme input', async () => {
    const mockTheme = createMockTheme();
    const { fixture } = await render(ThemeAvatarComponent, {
      componentInputs: { theme: mockTheme },
    });
    // Pass fixture.nativeElement to the helper function
    addDataTestIds(fixture.nativeElement);

    // Debug: Log the state of the DOM right before querying
    // screen.debug(fixture.nativeElement);

    const secondarySwatch = screen.getByTestId('secondary-swatch');
    const primarySwatch = screen.getByTestId('primary-swatch');
    const tertiarySwatch = screen.getByTestId('tertiary-swatch');

    // Check background colors
    expect(secondarySwatch).toHaveStyle({ backgroundColor: mockTheme.secondaryColor });
    expect(primarySwatch).toHaveStyle({ backgroundColor: mockTheme.primaryColor });
    expect(tertiarySwatch).toHaveStyle({ backgroundColor: mockTheme.tertiaryColor });
  });

  //- - - - - - - - - - - - - - -//

  it('should apply secondary color to tertiary swatch when tertiaryColor is null', async () => {
    const mockTheme = createMockTheme({ tertiaryColor: null });
    const { fixture } = await render(ThemeAvatarComponent, {
      componentInputs: { theme: mockTheme },
    });
    addDataTestIds(fixture.nativeElement); // Use nativeElement

    const tertiarySwatch = screen.getByTestId('tertiary-swatch');

    // Check that tertiary swatch uses the secondary color as fallback
    expect(tertiarySwatch).toHaveStyle({ backgroundColor: mockTheme.secondaryColor });
  });

  //- - - - - - - - - - - - - - -//

  it('should apply secondary color to tertiary swatch when tertiaryColor is undefined', async () => {
    // Create theme without tertiaryColor property
    const { tertiaryColor, ...themeWithoutTertiary } = createMockTheme();
    // Explicitly cast to ThemeOption, tertiaryColor will be undefined
    const mockTheme = themeWithoutTertiary as ThemeOption;

    const { fixture } = await render(ThemeAvatarComponent, {
      componentInputs: { theme: mockTheme },
    });
    addDataTestIds(fixture.nativeElement); // Use nativeElement

    const tertiarySwatch = screen.getByTestId('tertiary-swatch');

    // Check that tertiary swatch uses the secondary color as fallback
    // Need to access the original secondaryColor before it was potentially overridden
    const originalSecondaryColor = createMockTheme().secondaryColor;
    expect(tertiarySwatch).toHaveStyle({ backgroundColor: originalSecondaryColor });
  });

  //- - - - - - - - - - - - - - -//

  it('should render three swatch elements', async () => {
    const mockTheme = createMockTheme();
    const { fixture } = await render(ThemeAvatarComponent, {
      componentInputs: { theme: mockTheme },
    });
    addDataTestIds(fixture.nativeElement); // Use nativeElement

    // Check if all three swatches are rendered
    expect(screen.getByTestId('secondary-swatch')).toBeInTheDocument();
    expect(screen.getByTestId('primary-swatch')).toBeInTheDocument();
    expect(screen.getByTestId('tertiary-swatch')).toBeInTheDocument();
  });

  //- - - - - - - - - - - - - - -//

});