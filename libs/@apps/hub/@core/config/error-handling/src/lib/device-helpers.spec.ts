import { TestBed } from '@angular/core/testing';
import { DeviceHelpers } from './device-helpers';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Platform } from '@angular/cdk/platform';

// Mock classes
type MockPlatform = Partial<Record<keyof Platform, jest.Mock | boolean>>;
type MockBreakpointObserver = {
  isMatched: jest.Mock;
};

describe('DeviceHelpers', () => {
  let service: DeviceHelpers;
  let platformMock: MockPlatform;
  let breakpointObserverMock: MockBreakpointObserver;

  beforeEach(() => {
    // Create mock objects for Platform and BreakpointObserver
    platformMock = {
      TRIDENT: false,
      EDGE: false,
      FIREFOX: false,
      WEBKIT: false,
      SAFARI: false,
      BLINK: false,
      IOS: false
    };

    breakpointObserverMock = {
      isMatched: jest.fn().mockReturnValue(false)
    };

    TestBed.configureTestingModule({
      providers: [
        DeviceHelpers,
        { provide: Platform, useValue: platformMock },
        { provide: BreakpointObserver, useValue: breakpointObserverMock }
      ]
    });

    service = TestBed.inject(DeviceHelpers);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('WhatBrowser', () => {
    it('should detect Internet Explorer', () => {
      // Arrange
      platformMock.TRIDENT = true;
      
      // Act
      const result = service.WhatBrowswer();
      
      // Assert
      expect(result).toBe('Internet Explorer');
    });

    it('should detect Edge (old)', () => {
      // Arrange
      platformMock.EDGE = true;
      
      // Act
      const result = service.WhatBrowswer();
      
      // Assert
      expect(result).toBe('Edge - Old');
    });

    it('should detect Firefox', () => {
      // Arrange
      platformMock.FIREFOX = true;
      
      // Act
      const result = service.WhatBrowswer();
      
      // Assert
      expect(result).toBe('Firefox');
    });

    it('should detect Opera', () => {
      // Arrange
      platformMock.WEBKIT = true;
      
      // Act
      const result = service.WhatBrowswer();
      
      // Assert
      expect(result).toBe('Opera');
    });

    it('should detect Safari', () => {
      // Arrange
      platformMock.SAFARI = true;
      
      // Act
      const result = service.WhatBrowswer();
      
      // Assert
      expect(result).toBe('Safari');
    });

    it('should detect Chrome', () => {
      // Arrange
      platformMock.BLINK = true;
      
      // Act
      const result = service.WhatBrowswer();
      
      // Assert
      expect(result).toBe('Chrome');
    });

    it('should detect iOS', () => {
      // Arrange
      platformMock.IOS = true;
      
      // Act
      const result = service.WhatBrowswer();
      
      // Assert
      expect(result).toBe('IOS');
    });

    it('should return unknown browser when no platform match', () => {
      // Act
      const result = service.WhatBrowswer();
      
      // Assert
      expect(result).toBe('Dunno Man');
    });

    it('should prioritize detection in the correct order', () => {
      // Arrange - set multiple flags to true
      platformMock.TRIDENT = true;
      platformMock.BLINK = true;
      
      // Act
      const result = service.WhatBrowswer();
      
      // Assert - should return the first match in the sequence
      expect(result).toBe('Internet Explorer');
    });
  });
  describe('WhatDevice', () => {
    beforeEach(() => {
      // Reset the mock before each test
      breakpointObserverMock.isMatched.mockReset().mockReturnValue(false);
    });

    it('should detect Handset', () => {
      // Arrange
      breakpointObserverMock.isMatched.mockImplementation((breakpoint) => 
        breakpoint === Breakpoints.Handset);
      
      // Act
      const result = service.WhatDevice();
      
      // Assert
      expect(result).toContain('Handset');
      // Check for proper formatting (starts with comma+space)
      expect(result).toMatch(/^, Handset/);
    });

    it('should detect Tablet', () => {
      // Arrange
      breakpointObserverMock.isMatched.mockImplementation((breakpoint) => 
        breakpoint === Breakpoints.Tablet);
      
      // Act
      const result = service.WhatDevice();
      
      // Assert
      expect(result).toContain('Tablet');
    });

    it('should detect Web', () => {
      // Arrange
      breakpointObserverMock.isMatched.mockImplementation((breakpoint) => 
        breakpoint === Breakpoints.Web);
      
      // Act
      const result = service.WhatDevice();
      
      // Assert
      expect(result).toContain('Web');
    });

    it('should detect multiple breakpoints', () => {
      // Arrange
      breakpointObserverMock.isMatched.mockImplementation((breakpoint) => 
        breakpoint === Breakpoints.Large || breakpoint === Breakpoints.WebLandscape);
      
      // Act
      const result = service.WhatDevice();
      
      // Assert
      expect(result).toContain('Large');
      expect(result).toContain('WebLandscape');
      // Check that both breakpoints are included
      expect(result).toMatch(/.*Large.*WebLandscape.*/);
    });

    it('should return unknown device when no breakpoints match', () => {
      // Act
      const result = service.WhatDevice();
      
      // Assert
      expect(result).toBe('Dunno Man');
    });

    it('should concatenate all matched breakpoints', () => {
      // Arrange
      breakpointObserverMock.isMatched.mockImplementation((breakpoint) => 
        [Breakpoints.Medium, Breakpoints.TabletPortrait, Breakpoints.HandsetLandscape].includes(breakpoint));
      
      // Act
      const result = service.WhatDevice();
      
      // Assert
      expect(result).toContain('Medium');
      expect(result).toContain('TabletPortrait');
      expect(result).toContain('HandsetLandscape');
      // Check format with commas between items
      expect(result.split(',').length).toBe(4); // 3 items + the empty string before first comma
    });
  });
});
