import { NgTemplateOutlet } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BehaviorSubject } from 'rxjs';
import { MlDarkModeToggleMatComponent } from './dark-mode-toggle.component';
import { SbThemeService } from '@spider-baby/material-theming/service';
import { signal } from '@angular/core';

// Remove jest.mock completely and instead create a mock class
class MockSbThemeService {
  isDarkMode$ = new BehaviorSubject<boolean>(false);
  isDarkMode = signal(false);
  setDarkMode = jest.fn((isDark: boolean) => {
    this.isDarkMode$.next(isDark);
    this.isDarkMode.set(isDark);
  });
}

describe('MlDarkModeToggleMatComponent', () => {
  let component: MlDarkModeToggleMatComponent;
  let fixture: ComponentFixture<MlDarkModeToggleMatComponent>;
  let mockSbThemeService: MockSbThemeService;
  
  //-----------------------------//
  
  beforeEach(async () => {
    mockSbThemeService = new MockSbThemeService();

    await TestBed.configureTestingModule({
      imports: [
        NgTemplateOutlet,
        MatTooltipModule,
        MatSlideToggleModule,
        MlDarkModeToggleMatComponent
      ],
      providers: [
        // This is the key line - provide the mock directly through DI
        { provide: SbThemeService, useValue: mockSbThemeService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MlDarkModeToggleMatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // Test cases as before
  it('should create the toggle component', () => {
    expect(component).toBeTruthy();
  });

  //- - - - - - - - - - - - - - -//

  it('should have hideSwitch input defaulting to true', () => {
    expect(component._hideSwitch()).toBe(true);
  });

  //- - - - - - - - - - - - - - -//

  it('should initialize with correct dark mode state', () => {
    expect((component as any)['_isDark']()).toBe(false);
    
    mockSbThemeService.isDarkMode.set(true);
    fixture.detectChanges();
    
    expect((component as any)['_isDark']()).toBe(true);
  });

  //- - - - - - - - - - - - - - -//

  it('should call themeService.setDarkMode when toggleDarkTheme is called', () => {
    component.toggleDarkTheme(true);
    expect(mockSbThemeService.setDarkMode).toHaveBeenCalledWith('dark');
  });
});