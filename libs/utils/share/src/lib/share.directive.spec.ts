import { Component, PLATFORM_ID } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ShareService } from './share.service';
import { ShareCurrentPageDirective } from './share.directive';

// Mock ShareService
const mockShareService = {
  shareCurrentPage: jest.fn()
};

// Test component with directive
@Component({
  selector: 'sb-test-share-component',
  standalone: true,
  imports: [ShareCurrentPageDirective],
  template: `<button sbShareCurrentPage>Share</button>`
})
class TestShareComponent {}

describe('ShareCurrentPageDirective', () => {
  let fixture: ComponentFixture<TestShareComponent>;
  let buttonEl: HTMLElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        // Import the standalone component instead of declaring it
        TestShareComponent
      ],
      providers: [
        { provide: ShareService, useValue: mockShareService }
      ]
    });
    
    fixture = TestBed.createComponent(TestShareComponent);
    fixture.detectChanges();
    buttonEl = fixture.debugElement.query(By.css('button')).nativeElement;
    
    // Reset mock function calls before each test
    jest.clearAllMocks();
  });

  it('should create an instance', () => {
    const directive = fixture.debugElement
      .query(By.directive(ShareCurrentPageDirective))
      .injector.get(ShareCurrentPageDirective);
    expect(directive).toBeTruthy();
  });

  it('should call shareCurrentPage when button is clicked in browser environment', () => {
    // Simulate mousedown event
    buttonEl.dispatchEvent(new MouseEvent('mousedown'));
    fixture.detectChanges();
    
    // Service method should be called
    expect(mockShareService.shareCurrentPage).toHaveBeenCalledTimes(1);
  });

  it('should not call shareCurrentPage in server environment', () => {
    // Create a new TestBed with server-side rendering configuration
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [
        TestShareComponent
      ],
      providers: [
        { provide: ShareService, useValue: mockShareService },
        { provide: PLATFORM_ID, useValue: 'server' } // Simulate server-side
      ]
    });
    
    const serverFixture = TestBed.createComponent(TestShareComponent);
    serverFixture.detectChanges();
    const serverButtonEl = serverFixture.debugElement.query(By.css('button')).nativeElement;
    
    // Reset mock calls
    jest.clearAllMocks();
    
    // Simulate mousedown event in server environment
    serverButtonEl.dispatchEvent(new MouseEvent('mousedown'));
    serverFixture.detectChanges();
    
    // Service method should NOT be called in server environment
    expect(mockShareService.shareCurrentPage).not.toHaveBeenCalled();
  });

  it('should attach to elements with sbShareCurrentPage directive', () => {
    const directiveElements = fixture.debugElement.queryAll(By.directive(ShareCurrentPageDirective));
    expect(directiveElements.length).toBe(1);
    expect(directiveElements[0].nativeElement).toBe(buttonEl);
  });
});