import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { signal } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ThemeOption } from '../../../../config/src/index';
import { ThemeService } from '../../../../service/src/index';
import { MlThemePicker_Mat_Component } from './theme-picker.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatTooltipHarness } from '@angular/material/tooltip/testing';
import { MatIconHarness } from '@angular/material/icon/testing';
import { MatIconModule } from '@angular/material/icon'; // Import MatIconModule
import { MatEverythingModule } from '../../../../utils/src';

const mockSystemTheme1: ThemeOption = ThemeOption.create({ label: 'System Light', value: 'system-light', darkMode: false, primaryColor: '#ffffff', secondaryColor: '#000000' });
const mockSystemTheme2: ThemeOption = ThemeOption.create({ label: 'System Dark', value: 'system-dark', darkMode: true, primaryColor: '#000000', secondaryColor: '#ffffff' });
const mockCustomTheme1: ThemeOption = ThemeOption.create({ label: 'Custom Blue', value: 'custom-blue', darkMode: false, primaryColor: '#0000ff', secondaryColor: '#ffffff' });

const mockSystemThemes = signal([mockSystemTheme1, mockSystemTheme2]);
const mockCustomThemes = signal([mockCustomTheme1]);
const mockCurrentTheme$ = new BehaviorSubject<ThemeOption | undefined>(mockSystemTheme1);

class MockThemeService {
    systemThemes = mockSystemThemes.asReadonly();
    customThemes = mockCustomThemes.asReadonly();
    currentTheme$ = mockCurrentTheme$.asObservable();
    setTheme = jest.fn((theme: ThemeOption) => {
        mockCurrentTheme$.next(theme);
    });
}

describe('MlThemePicker_Mat_Component', () => {
    let component: MlThemePicker_Mat_Component;
    let fixture: ComponentFixture<MlThemePicker_Mat_Component>;
    let mockThemeService: MockThemeService;
    let loader: HarnessLoader;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                MlThemePicker_Mat_Component,
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

        fixture = TestBed.createComponent(MlThemePicker_Mat_Component);
        component = fixture.componentInstance;
        mockThemeService = TestBed.inject(ThemeService) as unknown as MockThemeService;
        loader = TestbedHarnessEnvironment.loader(fixture);
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should display the default tooltip', async () => {
        expect(component._toolTip()).toBe('Change app theme');

        const iconHarness = await loader.getHarness(MatIconHarness.with({ selector: '[matTooltip]' }));
        await (await iconHarness.host()).hover();
        const tooltipHarness = await loader.getHarness(MatTooltipHarness);
        expect(await tooltipHarness.getTooltipText()).toBe('Change app theme');
        await (await iconHarness.host()).mouseAway();
    });

    it('should display a custom tooltip when provided', async () => {
        const customTooltip = 'Select Theme';
        fixture.componentRef.setInput('pickerTooltip', customTooltip);
        fixture.detectChanges();
        expect(component._toolTip()).toBe(customTooltip);

        const iconHarness = await loader.getHarness(MatIconHarness.with({ selector: '[matTooltip]' }));
        await (await iconHarness.host()).hover();
        const tooltipHarness = await loader.getHarness(MatTooltipHarness);
        expect(await tooltipHarness.getTooltipText()).toBe(customTooltip);
        await (await iconHarness.host()).mouseAway();
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
        const subscription = component._onThemeChange.subscribe(theme => emittedTheme = theme);

        component['_changeThemeClick$'].next(themeToSelect);
        tick();
        fixture.detectChanges();

        expect(component['_selectedOption']()).toEqual(themeToSelect);
        expect(emittedTheme).toEqual(themeToSelect);

        subscription.unsubscribe();
    }));

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
                MlThemePicker_Mat_Component,
                NoopAnimationsModule,
                MatMenuModule,
                MatTooltipModule,
                MatIconModule // Add MatIconModule here too
            ],
            providers: [
                { provide: ThemeService, useClass: MockThemeService }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(MlThemePicker_Mat_Component);
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