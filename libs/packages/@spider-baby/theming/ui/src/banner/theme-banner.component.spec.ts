import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatTooltipModule } from '@angular/material/tooltip';
import { By } from '@angular/platform-browser';
import { ThemeOption } from '@spider-baby/material-theming/config';
import { MlThemeBannerComponent } from './theme-banner.component';

// Create a test host component to properly set the input
@Component({
  template: `<ml-theme-banner [theme]="theme"></ml-theme-banner>`,
  imports: [MlThemeBannerComponent],
  standalone: true
})
class TestHostComponent {
  theme: ThemeOption = {
    value: 'test-theme',
    label: 'Test Theme',
    primaryColor: '#FF0000',
    secondaryColor: '#00FF00',
    tertiaryColor: '#0000FF',
    darkMode: 'light'
  } as ThemeOption;
}

// Helper function to convert HEX to RGB for test comparisons
function hexToRgb(hex: string): string {
  // Remove # if present
  hex = hex.replace('#', '');

  // Parse the RGB components
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  // Return as rgb(r, g, b) format
  return `rgb(${r}, ${g}, ${b})`;
}

describe('MlThemeBannerComponent', () => {
  let hostComponent: TestHostComponent;
  let component: MlThemeBannerComponent;
  let fixture: ComponentFixture<TestHostComponent>;

  const mockTheme: ThemeOption = {
    value: 'test-theme',
    label: 'Test Theme',
    primaryColor: '#FF0000',
    secondaryColor: '#00FF00',
    tertiaryColor: '#0000FF',
    darkMode: 'light'
  } as ThemeOption;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent, MlThemeBannerComponent, MatTooltipModule]
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    hostComponent = fixture.componentInstance;
    component = fixture.debugElement.query(By.directive(MlThemeBannerComponent)).componentInstance;

    // Make sure to use the host component's theme
    hostComponent.theme = mockTheme;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display three color sections', () => {
    const divElements = fixture.debugElement.queryAll(By.css('div'));
    expect(divElements.length).toBe(3);
  });

  it('should apply the primary color to the left section', () => {
    const leftSection = fixture.debugElement.query(By.css('.left')).nativeElement;
    expect(leftSection.style.backgroundColor).toBe(hexToRgb(mockTheme.primaryColor));
  });

  it('should apply the secondary color to the middle section', () => {
    const middleSection = fixture.debugElement.query(By.css('.middle')).nativeElement;
    expect(middleSection.style.backgroundColor).toBe(hexToRgb(mockTheme.secondaryColor));
  });

  it('should apply the tertiary color to the right section', () => {
    const rightSection = fixture.debugElement.query(By.css('.right')).nativeElement;
    expect(rightSection.style.backgroundColor).toBe(hexToRgb(mockTheme.tertiaryColor ?? ''));
  });

  it('should update colors when theme input changes', () => {
    // Change the theme
    const newTheme = {
      ...mockTheme,
      primaryColor: '#123456',
      secondaryColor: '#654321',
      tertiaryColor: '#ABCDEF'
    } as ThemeOption;

    hostComponent.theme = newTheme;
    fixture.detectChanges();

    const leftSection = fixture.debugElement.query(By.css('.left')).nativeElement;
    const middleSection = fixture.debugElement.query(By.css('.middle')).nativeElement;
    const rightSection = fixture.debugElement.query(By.css('.right')).nativeElement;

    expect(leftSection.style.backgroundColor).toBe(hexToRgb(newTheme.primaryColor));
    expect(middleSection.style.backgroundColor).toBe(hexToRgb(newTheme.secondaryColor));
    expect(rightSection.style.backgroundColor).toBe(hexToRgb(newTheme.tertiaryColor ?? ''));
  });

  it('should handle missing tertiary color', () => {
    const themeWithoutTertiary = {
      ...mockTheme,
      tertiaryColor: ''
    } as ThemeOption;

    hostComponent.theme = themeWithoutTertiary;
    fixture.detectChanges();

    const rightSection = fixture.debugElement.query(By.css('.right')).nativeElement;
    // This might be a specific default color or empty string depending on implementation
    expect(rightSection.style.backgroundColor).not.toBe(hexToRgb(mockTheme.tertiaryColor ?? ''));
  });
});