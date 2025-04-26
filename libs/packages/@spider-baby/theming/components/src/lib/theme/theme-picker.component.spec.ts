import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { signal } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { MatIconModule } from '@angular/material/icon'; // Import MatIconModule
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTooltipHarness } from '@angular/material/tooltip/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { BehaviorSubject } from 'rxjs';
import { ThemeOption } from '@spider-baby/material-theming/config';
import { ThemeService } from '@spider-baby/material-theming/service';
import { MlThemeAvatarComponent } from '@spider-baby/material-theming/ui';
import { MatEverythingModule } from '@spider-baby/material-theming/utils';
import { MlThemePickerMatComponent } from './theme-picker.component';

const mockSystemTheme1: ThemeOption = ThemeOption.create({ label: 'System Light', value: 'system-light',  defaultDarkMode: 'light', primaryColor: '#ffffff', secondaryColor: '#000000' });
const mockSystemTheme2: ThemeOption = ThemeOption.create({ label: 'System Dark', value: 'system-dark', defaultDarkMode: 'dark', primaryColor: '#000000', secondaryColor: '#ffffff' });
const mockCustomTheme1: ThemeOption = ThemeOption.create({ label: 'Custom Blue', value: 'custom-blue',  defaultDarkMode: 'light', primaryColor: '#0000ff', secondaryColor: '#ffffff' });

const mockSystemThemes = signal([mockSystemTheme1, mockSystemTheme2]);
const mockCustomThemes = signal([mockCustomTheme1]);
// const mockCurrentTheme$ = new BehaviorSubject<ThemeOption | undefined>(mockSystemTheme1);
// Define the initial state value
const initialThemeState = mockSystemTheme1;
// Keep the BehaviorSubject definition outside
const mockCurrentTheme$ = new BehaviorSubject<ThemeOption | undefined>(initialThemeState);

class MockThemeService {
    systemThemes = mockSystemThemes.asReadonly();
    customThemes = mockCustomThemes.asReadonly();
    currentTheme$ = mockCurrentTheme$.asObservable();
    setTheme = jest.fn((theme: ThemeOption) => {
        mockCurrentTheme$.next(theme);
    });
}

describe('MlThemePickerMatComponent', () => {
    let component: MlThemePickerMatComponent;
    let fixture: ComponentFixture<MlThemePickerMatComponent>;
    let mockThemeService: MockThemeService;
    let loader: HarnessLoader;

    beforeEach(async () => {
      
      // Reset the BehaviorSubject's value before each test runs
      mockCurrentTheme$.next(initialThemeState);

        await TestBed.configureTestingModule({
            imports: [
                MlThemePickerMatComponent,
                NoopAnimationsModule,
                MatMenuModule,
                MatTooltipModule,
                MatEverythingModule,
                MatIconModule // Add MatIconModule here

            ],
            providers: [
                { provide: ThemeService, useClass: MockThemeService }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(MlThemePickerMatComponent);
        component = fixture.componentInstance;
        mockThemeService = TestBed.inject(ThemeService) as unknown as MockThemeService;
        loader = TestbedHarnessEnvironment.loader(fixture);

        // Reset mock calls after the service instance is available
        mockThemeService.setTheme.mockClear();
        
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should display the default tooltip', async () => {
        expect(component._toolTip()).toBe('Change app theme');

        // Get the tooltip harness directly
        const tooltipHarness = await loader.getHarness(MatTooltipHarness);
        const hostElement = await tooltipHarness.host();

        // Hover over the host element (the mat-icon)
        await hostElement.hover();

        // Check the tooltip text
        expect(await tooltipHarness.getTooltipText()).toBe('Change app theme');

        // Mouse away to hide tooltip
        await hostElement.mouseAway();
    });

    it('should display a custom tooltip when provided', async () => {
        const customTooltip = 'Select Theme';
        fixture.componentRef.setInput('pickerTooltip', customTooltip);
        fixture.detectChanges(); // Ensure changes are detected
        expect(component._toolTip()).toBe(customTooltip);

        // Get the tooltip harness directly
        const tooltipHarness = await loader.getHarness(MatTooltipHarness);
        const hostElement = await tooltipHarness.host();

        // Hover over the host element (the mat-icon)
        await hostElement.hover();

        // Check the tooltip text
        expect(await tooltipHarness.getTooltipText()).toBe(customTooltip);

        // Mouse away to hide tooltip
        await hostElement.mouseAway();
    });

    it('should combine system and custom themes', () => {
        const expectedOptions = [...mockSystemThemes(), ...mockCustomThemes()];
        expect(component['_allOptions']()).toEqual(expectedOptions);
    });

    it('should reflect the initial theme from ThemeService', fakeAsync(() => {
        tick();
        fixture.detectChanges();
        expect(component['_selectedOption']()).toEqual(mockSystemTheme1);
    }));

    it('should call ThemeService.setTheme when a theme is clicked', fakeAsync(() => {
        const themeToSelect = mockCustomTheme1;
        component['_changeThemeClick$'].next(themeToSelect);
        tick();
        fixture.detectChanges();

        expect(mockThemeService.setTheme).toHaveBeenCalledWith(themeToSelect);
    }));

    it('should update selectedOption and emit theme change when a theme is clicked', fakeAsync(() => {
      const themeToSelect = mockCustomTheme1;
      let emittedTheme: ThemeOption | undefined;
      const subscription = component._onThemeChange.subscribe(theme => {
          console.log('[_onThemeChange emitted]:', theme); // Add logging
          emittedTheme = theme;
      });

      component['_changeThemeClick$'].next(themeToSelect);
      tick(); // Process async operations
      fixture.detectChanges(); // Update fixture if needed

      expect(component['_selectedOption']()).toEqual(themeToSelect);
      console.log('[Test check] emittedTheme:', emittedTheme); // Add logging
      expect(emittedTheme).toEqual(themeToSelect); // Check if emission was captured

      subscription.unsubscribe();
  }));


    // it('should update selectedOption and emit theme change when a theme is clicked0', fakeAsync(() => {
    //     const themeToSelect = mockCustomTheme1;
    //     let emittedTheme: ThemeOption | undefined;
    //     const subscription = component._onThemeChange.subscribe(theme => emittedTheme = theme);

    //     component['_changeThemeClick$'].next(themeToSelect);
    //     tick();
    //     fixture.detectChanges();

    //     expect(component['_selectedOption']()).toEqual(themeToSelect);
    //     expect(emittedTheme).toEqual(themeToSelect);

    //     subscription.unsubscribe();
    // }));

    it('should update selectedOption and emit theme change when currentTheme$ emits', fakeAsync(() => {
        const newThemeFromServer = mockSystemTheme2;
        let emittedTheme: ThemeOption | undefined;
        const subscription = component._onThemeChange.subscribe(theme => emittedTheme = theme);

        mockCurrentTheme$.next(newThemeFromServer);
        tick();
        fixture.detectChanges();

        expect(component['_selectedOption']()).toEqual(newThemeFromServer);
        expect(emittedTheme).toEqual(newThemeFromServer);

        subscription.unsubscribe();
    }));

    it('should emit undefined initially if ThemeService provides undefined', fakeAsync(() => {
        mockCurrentTheme$.next(undefined);
        TestBed.resetTestingModule();

        TestBed.configureTestingModule({
            imports: [
                MlThemePickerMatComponent,
                NoopAnimationsModule,
                MatMenuModule,
                MatTooltipModule,
                MatIconModule // Add MatIconModule here too
            ],
            providers: [
                { provide: ThemeService, useClass: MockThemeService }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(MlThemePickerMatComponent);
        component = fixture.componentInstance;
        mockThemeService = TestBed.inject(ThemeService) as unknown as MockThemeService;
        loader = TestbedHarnessEnvironment.loader(fixture);

        let emittedTheme: ThemeOption | undefined = mockSystemTheme1;
        const subscription = component._onThemeChange.subscribe(theme => emittedTheme = theme);

        fixture.detectChanges();
        tick();

        expect(component['_selectedOption']()).toBeUndefined();
        expect(emittedTheme).toBeUndefined();

        subscription.unsubscribe();
        mockCurrentTheme$.next(mockSystemTheme1);
    }));

});