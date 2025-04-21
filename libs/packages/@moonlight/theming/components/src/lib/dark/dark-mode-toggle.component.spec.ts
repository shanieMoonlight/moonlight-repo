import { NgTemplateOutlet } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BehaviorSubject } from 'rxjs';
import { DarkModeToggleMatComponent } from './dark-mode-toggle.component';
import { ThemeService } from '../../../../service/src/lib/theme.service';

// Remove jest.mock completely and instead create a mock class
class MockThemeService {
  isDarkMode$ = new BehaviorSubject<boolean>(false);
  setDarkMode = jest.fn((isDark: boolean) => {
    this.isDarkMode$.next(isDark);
  });
}

describe('DarkModeToggleMatComponent', () => {
  let component: DarkModeToggleMatComponent;
  let fixture: ComponentFixture<DarkModeToggleMatComponent>;
  let mockThemeService: MockThemeService;
  
  //-----------------------------//
  
  beforeEach(async () => {
    mockThemeService = new MockThemeService();

    await TestBed.configureTestingModule({
      imports: [
        NgTemplateOutlet,
        MatTooltipModule,
        MatSlideToggleModule,
        DarkModeToggleMatComponent
      ],
      providers: [
        // This is the key line - provide the mock directly through DI
        { provide: ThemeService, useValue: mockThemeService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DarkModeToggleMatComponent);
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
    expect((component as any)._isDark()).toBe(false);
    
    mockThemeService.isDarkMode$.next(true);
    fixture.detectChanges();
    
    expect((component as any)._isDark()).toBe(true);
  });

  //- - - - - - - - - - - - - - -//

  it('should call themeService.setDarkMode when toggleDarkTheme is called', () => {
    component.toggleDarkTheme(true);
    expect(mockThemeService.setDarkMode).toHaveBeenCalledWith(true);
  });
});