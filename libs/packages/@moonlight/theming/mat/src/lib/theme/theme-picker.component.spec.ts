import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ThemeConfig, ThemeConfigService, ThemeOption, ThemeSuffix } from '../../../../config/src/index'; // Adjusted path
import { ThemeService } from '../../../../service/src/index'; // Adjusted path
import { BehaviorSubject } from 'rxjs';
import { ThemePicker_Mat_Component } from './theme-picker.component';

//##################################################//

// Mock Theme Options
const mockThemeOptions: ThemeOption[] = [
  { label: 'Default', value: 'default', classSuffix: 0, primaryColor: '#ffffff', secondaryColor: '#000000', fallbackIsDarkMode: false },
  { label: 'Blue', value: 'blue', classSuffix: 1, primaryColor: '#0000ff', secondaryColor: '#ffffff', fallbackIsDarkMode: false },
  { label: 'Dark', value: 'dark', classSuffix: 2, primaryColor: '#aaaaaa', secondaryColor: '#333333', fallbackIsDarkMode: true },
];

// Mock ThemeService
class MockThemeService {
  themeSuffix$ = new BehaviorSubject<ThemeSuffix | undefined>(mockThemeOptions[0].classSuffix); // Start with default
  setThemeSuffix = jest.fn((suffix: ThemeSuffix) => {
    this.themeSuffix$.next(suffix);
  });
}

// Mock ThemeConfigService
class MockThemeConfigService implements Partial<ThemeConfig> {
  themeOptions = mockThemeOptions;
}

//##################################################//

describe('ThemePicker_Mat_Component', () => {
  let component: ThemePicker_Mat_Component;
  let fixture: ComponentFixture<ThemePicker_Mat_Component>;
  let mockThemeService: MockThemeService;
  let mockThemeConfig: MockThemeConfigService;

  //-----------------------------//

  beforeEach(async () => {
    mockThemeService = new MockThemeService();
    mockThemeConfig = new MockThemeConfigService();

    await TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        MatIconModule,
        MatMenuModule,
        MatTooltipModule,
        ThemePicker_Mat_Component,
      ],
      providers: [
        { provide: ThemeService, useValue: mockThemeService },
        { provide: ThemeConfigService, useValue: mockThemeConfig }
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ThemePicker_Mat_Component);
    component = fixture.componentInstance;
    fixture.detectChanges(); // Initial binding and effect run
  });

  //-----------------------------//

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  //- - - - - - - - - - - - - - -//

  it('should initialize with default tooltip', () => {
    expect(component._toolTip()).toBe('Change app theme');
  });

  //- - - - - - - - - - - - - - -//

  it('should load theme options from ThemeConfigService', () => {
    // Accessing _options is okay if it's protected and used in the template
    expect((component as any)._options).toEqual(mockThemeOptions);
  });

  //- - - - - - - - - - - - - - -//

  // Test initialization using type casting
  it('should initialize _selectedOption based on ThemeService', fakeAsync(() => {
    tick(); // Allow signals to stabilize
    fixture.detectChanges();
    // Use type casting to access protected member
    expect((component as any)._selectedOption()).toEqual(mockThemeOptions[0]);

    // Change theme suffix in service
    mockThemeService.themeSuffix$.next(mockThemeOptions[1].classSuffix);
    tick(); // Allow signals to stabilize
    fixture.detectChanges();
    // Use type casting again
    expect((component as any)._selectedOption()).toEqual(mockThemeOptions[1]);
  }));

  //- - - - - - - - - - - - - - -//

  it('should call ThemeService.setThemeSuffix and update _selectedOption when a theme button is clicked', fakeAsync(() => {
    const themeToSelect = mockThemeOptions[1];
    // Directly call the subject's next method, simulating the template click binding
    (component as any)._changeThemeClick$.next(themeToSelect);
    tick(); // Allow time for tap/map operators and signal updates
    fixture.detectChanges();

    expect(mockThemeService.setThemeSuffix).toHaveBeenCalledWith(themeToSelect.classSuffix);
    // Use type casting to check the protected signal's value
    expect((component as any)._selectedOption()).toEqual(themeToSelect);
  }));

  //- - - - - - - - - - - - - - -//

  it('should emit _onThemeChange when selected option changes', fakeAsync(() => {
    const spy = jest.spyOn(component._onThemeChange, 'emit');
    const themeToSelect = mockThemeOptions[2];

    // Initial emit check
    tick();
    fixture.detectChanges();
    // Check the emitted value (public API)
    // expect(spy).toHaveBeenCalledWith(mockThemeOptions[0]);

    spy.mockClear();

    // Simulate theme change
    (component as any)._changeThemeClick$.next(themeToSelect);

    // console.log('spy.mock.calls', (component as any)._selectedOption(), themeToSelect);


    tick();
    fixture.detectChanges();

    // Check the emitted value (public API)
    expect(spy).toHaveBeenCalledWith(themeToSelect);
    expect(spy).toHaveBeenCalledTimes(1);
  }));

  //- - - - - - - - - - - - - - -//

  it('should apply the "selected" class to the correct menu item after change', fakeAsync(() => {
    const themeToSelect = mockThemeOptions[1];

    // 1. Find the menu trigger icon
    const triggerIcon = fixture.debugElement.query(By.css('#butt-icon'));
    expect(triggerIcon).toBeTruthy(); // Ensure trigger exists

    // 2. Simulate clicking the trigger to open the menu
    triggerIcon.nativeElement.click();
    fixture.detectChanges(); // Allow menu to open and render items
    tick(); // Allow any async operations related to menu opening
    fixture.detectChanges();

    // 3. Now query for the menu items
    const menuItems = fixture.debugElement.queryAll(By.css('button[mat-menu-item]'));
    console.log('menuItems after opening menu', menuItems.length); // Debug log
    expect(menuItems.length).toBe(mockThemeOptions.length); // Should now be 3

    // 4. Simulate selecting a theme (which happens *within* the menu)
    // Find the specific button to click - you might need a more specific selector
    // or find it by index if the order is guaranteed
    const buttonToClick = menuItems[1]; // Assuming the second button corresponds to mockThemeOptions[1]
    expect(buttonToClick).toBeTruthy();

    // Get the component instance associated with the button if needed, or just click
    buttonToClick.nativeElement.click();
    tick(); // Allow click handler, RxJS pipe, and signal updates
    fixture.detectChanges(); // Update template based on new selection

    // 5. Verify the "selected" class is now on the correct item
    // Re-query items *if* the menu might have closed and re-opened, though likely not needed here
    const updatedMenuItems = fixture.debugElement.queryAll(By.css('button[mat-menu-item]'));
    const selectedItem = updatedMenuItems.find(item => item.nativeElement.classList.contains('selected'));

    expect(selectedItem).not.toBeNull();
    // Check the text content of the selected item
    const selectedSpan = selectedItem!.query(By.css('span'));
    expect(selectedSpan.nativeElement.textContent.trim()).toBe(themeToSelect.label);

    // Optional: Check that the previously selected item is no longer selected
    const previouslySelectedItem = updatedMenuItems.find(item => item.nativeElement.textContent.includes(mockThemeOptions[0].label));
    expect(previouslySelectedItem?.nativeElement.classList.contains('selected')).toBe(false);

  }));

  // Modify the initial visual state test similarly if needed
  it('should initialize with the correct theme selected visually', fakeAsync(() => {
    tick();
    fixture.detectChanges();

    // Open the menu to check the items inside
    const triggerIcon = fixture.debugElement.query(By.css('#butt-icon'));
    triggerIcon.nativeElement.click();
    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    const selectedItem = fixture.debugElement.query(By.css('button.selected'));
    expect(selectedItem).not.toBeNull();
    const selectedSpan = selectedItem.query(By.css('span'));
    expect(selectedSpan.nativeElement.textContent.trim()).toBe(mockThemeOptions[0].label);
  }));

});