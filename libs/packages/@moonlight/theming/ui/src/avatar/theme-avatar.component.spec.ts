import { render, screen } from '@testing-library/angular';
import { MlThemeAvatarComponent } from './theme-avatar.component';
import { ThemeOption } from '../../../config/src/index';
import '@testing-library/jest-dom';

// Helper function to create mock ThemeOption
const createMockTheme = (overrides: Partial<ThemeOption> = {}): ThemeOption => ({
  label: 'Test Theme',
  value: 'test-theme',
  primaryColor: '#673AB7', // Deep Purple 500
  secondaryColor: '#FFC107', // Amber 500
  tertiaryColor: '#03A9F4', // Light Blue 500
  errorColor: '#F44336', // Red 500
   darkMode: 'light',
  ...overrides,
});

//-----------------------------//

describe('MlThemeAvatarComponent', () => {
  // Helper function to add data-testid attributes using nativeElement
  const addDataTestIds = (element: HTMLElement) => { // Accept HTMLElement
    if (element) {
      // Query directly on the provided element
      const stripees = element.querySelectorAll('.stripe');
      console.log('stripees found in element:', stripees); // Debug log

      if (stripees.length === 3) {
        stripees[0].setAttribute('data-testid', 'secondary-stripe');
        stripees[1].setAttribute('data-testid', 'primary-stripe');
        stripees[2].setAttribute('data-testid', 'tertiary-stripe');
        console.log('data-testid attributes set.'); // Debug log
      } else {
        console.warn(`Expected 3 stripees, found ${stripees.length}. data-testid attributes not set.`); // Debug log
      }
    } else {
      console.error('addDataTestIds received null or undefined element.'); // Debug log
    }
  };

  //-----------------------------//

  it('should render and apply colors from theme input', async () => {
    const mockTheme = createMockTheme();
    const { fixture } = await render(MlThemeAvatarComponent, {
      componentInputs: { theme: mockTheme },
    });
    // Pass fixture.nativeElement to the helper function
    addDataTestIds(fixture.nativeElement);

    // Debug: Log the state of the DOM right before querying
    // screen.debug(fixture.nativeElement);

    const secondarystripe = screen.getByTestId('secondary-stripe');
    const primarystripe = screen.getByTestId('primary-stripe');
    const tertiarystripe = screen.getByTestId('tertiary-stripe');

    // Check background colors
    expect(secondarystripe).toHaveStyle({ backgroundColor: mockTheme.secondaryColor });
    expect(primarystripe).toHaveStyle({ backgroundColor: mockTheme.primaryColor });
    expect(tertiarystripe).toHaveStyle({ backgroundColor: mockTheme.tertiaryColor });
  });

  //- - - - - - - - - - - - - - -//

  it('should apply secondary color to tertiary stripe when tertiaryColor is null', async () => {
    const mockTheme = createMockTheme({ tertiaryColor: null });
    const { fixture } = await render(MlThemeAvatarComponent, {
      componentInputs: { theme: mockTheme },
    });
    addDataTestIds(fixture.nativeElement); // Use nativeElement

    const tertiarystripe = screen.getByTestId('tertiary-stripe');

    // Check that tertiary stripe uses the secondary color as fallback
    expect(tertiarystripe).toHaveStyle({ backgroundColor: mockTheme.secondaryColor });
  });

  //- - - - - - - - - - - - - - -//

  it('should apply secondary color to tertiary stripe when tertiaryColor is undefined', async () => {
    // Create theme without tertiaryColor property
    const { tertiaryColor, ...themeWithoutTertiary } = createMockTheme();
    // Explicitly cast to ThemeOption, tertiaryColor will be undefined
    const mockTheme = themeWithoutTertiary as ThemeOption;

    const { fixture } = await render(MlThemeAvatarComponent, {
      componentInputs: { theme: mockTheme },
    });
    addDataTestIds(fixture.nativeElement); // Use nativeElement

    const tertiarystripe = screen.getByTestId('tertiary-stripe');

    // Check that tertiary stripe uses the secondary color as fallback
    // Need to access the original secondaryColor before it was potentially overridden
    const originalSecondaryColor = createMockTheme().secondaryColor;
    expect(tertiarystripe).toHaveStyle({ backgroundColor: originalSecondaryColor });
  });

  //- - - - - - - - - - - - - - -//

  it('should render three stripe elements', async () => {
    const mockTheme = createMockTheme();
    const { fixture } = await render(MlThemeAvatarComponent, {
      componentInputs: { theme: mockTheme },
    });
    addDataTestIds(fixture.nativeElement); // Use nativeElement

    // Check if all three stripees are rendered
    expect(screen.getByTestId('secondary-stripe')).toBeInTheDocument();
    expect(screen.getByTestId('primary-stripe')).toBeInTheDocument();
    expect(screen.getByTestId('tertiary-stripe')).toBeInTheDocument();
  });

  //- - - - - - - - - - - - - - -//

  it('should apply circular border radius by default', async () => {
    const mockTheme = createMockTheme();
    const { fixture } = await render(MlThemeAvatarComponent, {
      componentInputs: { 
        theme: mockTheme
        // isCircle is true by default, so no need to set it
      },
    });
    
    // Get the host element (component root)
    const hostElement = fixture.nativeElement as HTMLElement;
    
    // Check that the host element has border-radius: 50%
    expect(hostElement).toHaveStyle({ borderRadius: '50%' });
  });
  
  //- - - - - - - - - - - - - - -//

  it('should apply rectangular shape when isCircle is false', async () => {
    const mockTheme = createMockTheme();
    const { fixture } = await render(MlThemeAvatarComponent, {
      componentInputs: { 
        theme: mockTheme,
        isCircle: false
      },
    });
    
    // Get the host element (component root)
    const hostElement = fixture.nativeElement as HTMLElement;
    
    // Check that the host element has border-radius: 0%
    expect(hostElement).toHaveStyle({ borderRadius: '0%' });
  });

  //- - - - - - - - - - - - - - -//

});