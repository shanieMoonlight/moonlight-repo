import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { OverlayRef } from '@angular/cdk/overlay';
import { AnimationEvent } from '@angular/animations';
import { Subject } from 'rxjs';
import { SbToastComponent } from './toast.component';
import { ToastData, ToastType } from '../toast-data';
import { ToastRef } from '../toast-ref';
import { TOAST_CONFIG_TOKEN, ToastConfig } from '@spider-baby/ui-toast/setup';

describe('SbToastComponent', () => {
  let component: SbToastComponent;
  let fixture: ComponentFixture<SbToastComponent>;
  let mockToastData: ToastData;
  let mockToastRef: jest.Mocked<ToastRef>;
  let mockOverlayRef: jest.Mocked<Partial<OverlayRef>>;
  let mockToastConfig: ToastConfig;

  const setupComponent = async (toastType: ToastType = 'info', message: string = 'Test message', options?: Partial<ToastData>) => {
    // Reset TestBed before configuring to ensure clean state
    TestBed.resetTestingModule();
    
    // Create new mock ToastData for each test
    mockToastData = new ToastData(toastType, message);
    
    // Apply any additional options
    if (options) {
      Object.assign(mockToastData, options);
    }

    await TestBed.configureTestingModule({
      imports: [
        SbToastComponent,
        NoopAnimationsModule
      ],
      providers: [
        { provide: ToastData, useValue: mockToastData },
        { provide: ToastRef, useValue: mockToastRef },
        { provide: TOAST_CONFIG_TOKEN, useValue: mockToastConfig }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SbToastComponent);
    component = fixture.componentInstance;
  };

  beforeEach(async () => {
    // Create mock OverlayRef
    mockOverlayRef = {
      dispose: jest.fn(),
      overlayElement: document.createElement('div')
    };

    // Create mock ToastRef
    mockToastRef = {
      close: jest.fn(),
      afterClosed: jest.fn().mockReturnValue(new Subject<void>().asObservable()),
      isVisible: jest.fn(),
      getPosition: jest.fn(),
      data: undefined,
      _afterClosed: new Subject<void>(),
      overlay: mockOverlayRef
    } as unknown as jest.Mocked<ToastRef>;

    // Create mock ToastConfig using the Create factory method
    mockToastConfig = ToastConfig.Create(
      '#f44336', // colorBgError
      '#ff9800', // colorBgWarn  
      '#4caf50', // colorBgSuccess
      '#2196f3', // colorBgInfo
      '#ffffff', // colorBgDefault
      '#333333'  // colorText
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
    TestBed.resetTestingModule();
  });

  it('should create', async () => {
    await setupComponent();
    expect(component).toBeTruthy();
  });

  describe('Component initialization', () => {
    it('should initialize with correct default values for info toast', async () => {
      // Arrange & Act
      await setupComponent('info', 'Test message');
      fixture.detectChanges();

      // Assert
      expect(component['_bgColor']()).toBe(mockToastConfig.colorBgInfo);
      expect(component['_txtColor']()).toBe(mockToastConfig.colorTxtInfo);
      expect(component['_txt']()).toBe('Test message');
      expect(component['_toastType']()).toBe('info');
      expect(component['_dismissible']()).toBe(true);
      expect(component['_showIcon']()).toBe(true);
      expect(component['_animationState']()).toBe('fade');
    });

    it('should set animation state from toast data if provided', async () => {
      // Arrange & Act
      await setupComponent('info', 'Test message', { animationType: 'slide' });
      fixture.detectChanges();

      // Assert
      expect(component['_animationState']()).toBe('slide');
    });

    it('should use dismissible setting from toast data', async () => {
      // Arrange & Act
      await setupComponent('info', 'Test message', { dismissible: false });
      fixture.detectChanges();

      // Assert
      expect(component['_dismissible']()).toBe(false);
    });

    it('should use showIcon setting from toast data', async () => {
      // Arrange & Act
      await setupComponent('info', 'Test message', { showIcon: false });
      fixture.detectChanges();

      // Assert
      expect(component['_showIcon']()).toBe(false);
    });

    it('should handle null text gracefully', async () => {
      // Arrange & Act
      await setupComponent('info', 'Test message', { text: undefined });
      fixture.detectChanges();

      // Assert
      expect(component['_txt']()).toBe('');
    });
  });

  describe('Toast types and styling', () => {
    describe('Success toast', () => {
      it('should set correct background color for success toast', async () => {
        // Arrange & Act
        await setupComponent('success', 'Success message');
        fixture.detectChanges();

        // Assert
        expect(component['_bgColor']()).toBe(mockToastConfig.colorBgSuccess);
      });

      it('should set correct text color for success toast', async () => {
        // Arrange & Act
        await setupComponent('success', 'Success message');
        fixture.detectChanges();

        // Assert
        expect(component['_txtColor']()).toBe(mockToastConfig.colorTxtSuccess);
      });

      it('should set correct toast type for success toast', async () => {
        // Arrange & Act
        await setupComponent('success', 'Success message');
        fixture.detectChanges();

        // Assert
        expect(component['_toastType']()).toBe('success');
      });
    });

    describe('Error toast', () => {
      it('should set correct background color for error toast', async () => {
        // Arrange & Act
        await setupComponent('error', 'Error message');
        fixture.detectChanges();

        // Assert
        expect(component['_bgColor']()).toBe(mockToastConfig.colorBgError);
      });

      it('should set correct text color for error toast', async () => {
        // Arrange & Act
        await setupComponent('error', 'Error message');
        fixture.detectChanges();

        // Assert
        expect(component['_txtColor']()).toBe(mockToastConfig.colorTxtError);
      });

      it('should set correct toast type for error toast', async () => {
        // Arrange & Act
        await setupComponent('error', 'Error message');
        fixture.detectChanges();

        // Assert
        expect(component['_toastType']()).toBe('error');
      });
    });

    describe('Warning toast', () => {
      it('should set correct background color for warning toast', async () => {
        // Arrange & Act
        await setupComponent('warn', 'Warning message');
        fixture.detectChanges();

        // Assert
        expect(component['_bgColor']()).toBe(mockToastConfig.colorBgWarn);
      });

      it('should set correct text color for warning toast', async () => {
        // Arrange & Act
        await setupComponent('warn', 'Warning message');
        fixture.detectChanges();

        // Assert
        expect(component['_txtColor']()).toBe(mockToastConfig.colorTxtWarn);
      });

      it('should set correct toast type for warning toast', async () => {
        // Arrange & Act
        await setupComponent('warn', 'Warning message');
        fixture.detectChanges();

        // Assert
        expect(component['_toastType']()).toBe('warn');
      });
    });

    describe('Info toast', () => {
      it('should set correct background color for info toast', async () => {
        // Arrange & Act
        await setupComponent('info', 'Info message');
        fixture.detectChanges();

        // Assert
        expect(component['_bgColor']()).toBe(mockToastConfig.colorBgInfo);
      });

      it('should set correct text color for info toast', async () => {
        // Arrange & Act
        await setupComponent('info', 'Info message');
        fixture.detectChanges();

        // Assert
        expect(component['_txtColor']()).toBe(mockToastConfig.colorTxtInfo);
      });

      it('should set correct toast type for info toast', async () => {
        // Arrange & Act
        await setupComponent('info', 'Info message');
        fixture.detectChanges();

        // Assert
        expect(component['_toastType']()).toBe('info');
      });
    });

  });

  describe('Component interactions', () => {
    beforeEach(async () => {
      await setupComponent();
      fixture.detectChanges();
    });

    it('should trigger closing animation when close() is called', () => {
      // Act
      component.close();

      // Assert
      expect(component['_animationState']()).toBe('closing');
    });

    it('should call ToastRef.close() when animation finishes in closing state', () => {
      // Arrange
      const animationEvent: AnimationEvent = {
        toState: 'closing',
        fromState: 'fade',
        totalTime: 300,
        phaseName: 'done',
        element: document.createElement('div'),
        triggerName: 'dynamicToastAnimation',
        disabled: false
      };
      
      component['_animationState'].set('closing');

      // Act
      component['onAnimationFinished'](animationEvent);

      // Assert
      expect(mockToastRef.close).toHaveBeenCalled();
    });

    it('should not call ToastRef.close() when animation finishes but not in closing state', () => {
      // Arrange
      const animationEvent: AnimationEvent = {
        toState: 'fade',
        fromState: 'void',
        totalTime: 300,
        phaseName: 'done',
        element: document.createElement('div'),
        triggerName: 'dynamicToastAnimation',
        disabled: false
      };

      // Act
      component['onAnimationFinished'](animationEvent);

      // Assert
      expect(mockToastRef.close).not.toHaveBeenCalled();
    });

    it('should not call ToastRef.close() when toState is closing but component state is not closing', () => {
      // Arrange
      const animationEvent: AnimationEvent = {
        toState: 'closing',
        fromState: 'fade',
        totalTime: 300,
        phaseName: 'done',
        element: document.createElement('div'),
        triggerName: 'dynamicToastAnimation',
        disabled: false
      };
      
      component['_animationState'].set('fade'); // Different from closing

      // Act
      component['onAnimationFinished'](animationEvent);

      // Assert
      expect(mockToastRef.close).not.toHaveBeenCalled();
    });
  });

  describe('Template rendering', () => {
    it('should render toast text', async () => {
      // Arrange & Act
      await setupComponent('info', 'Test message');
      fixture.detectChanges();
      const compiled = fixture.nativeElement;

      // Assert
      expect(compiled.querySelector('.toast-text').textContent).toContain('Test message');
    });

    it('should apply background color style', async () => {
      // Arrange & Act
      await setupComponent('info', 'Test message');
      fixture.detectChanges();
      const compiled = fixture.nativeElement;
      const toastElement = compiled.querySelector('.toast');

      // Assert
      expect(toastElement.style.backgroundColor).toBe('rgb(33, 150, 243)'); // #2196f3 converted to rgb
    });

    it('should show icon when showIcon is true', async () => {
      // Arrange & Act
      await setupComponent('info', 'Test message', { showIcon: true });
      fixture.detectChanges();
      const compiled = fixture.nativeElement;

      // Assert
      expect(compiled.querySelector('#icon')).toBeTruthy();
    });

    it('should hide icon when showIcon is false', async () => {
      // Arrange & Act 
      await setupComponent('info', 'Test message', { showIcon: false });
      fixture.detectChanges();
      const compiled = fixture.nativeElement;

      // Assert
      expect(compiled.querySelector('#icon')).toBeFalsy();
    });

    it('should show close button when dismissible is true', async () => {
      // Arrange & Act
      await setupComponent('info', 'Test message', { dismissible: true });
      fixture.detectChanges();
      const compiled = fixture.nativeElement;

      // Assert
      expect(compiled.querySelector('#button-close')).toBeTruthy();
    });

    it('should hide close button when dismissible is false', async () => {
      // Arrange & Act
      await setupComponent('info', 'Test message', { dismissible: false });
      fixture.detectChanges();
      const compiled = fixture.nativeElement;

      // Assert
      expect(compiled.querySelector('#button-close')).toBeFalsy();
    });

    it('should trigger close when close button is clicked', async () => {
      // Arrange & Act
      await setupComponent('info', 'Test message', { dismissible: true });
      fixture.detectChanges();
      const closeSpy = jest.spyOn(component, 'close');
      const compiled = fixture.nativeElement;
      const closeButton = compiled.querySelector('#button-close');

      // Act
      closeButton.click();

      // Assert
      expect(closeSpy).toHaveBeenCalled();
    });
  });

  describe('Icon template context', () => {
    it('should pass correct toast type to icon template for success', async () => {
      // Arrange & Act
      await setupComponent('success', 'Success message');
      fixture.detectChanges();

      // Assert
      expect(component['_toastType']()).toBe('success');
    });

    it('should pass correct toast type to icon template for error', async () => {
      // Arrange & Act
      await setupComponent('error', 'Error message');
      fixture.detectChanges();

      // Assert
      expect(component['_toastType']()).toBe('error');
    });

    it('should pass correct toast type to icon template for warn', async () => {
      // Arrange & Act
      await setupComponent('warn', 'Warning message');
      fixture.detectChanges();

      // Assert
      expect(component['_toastType']()).toBe('warn');
    });

    it('should pass correct toast type to icon template for info', async () => {
      // Arrange & Act
      await setupComponent('info', 'Info message');
      fixture.detectChanges();

      // Assert
      expect(component['_toastType']()).toBe('info');
    });
  });

  describe('Helper methods', () => {
    describe('getBackgroundColor', () => {
      it('should return correct color for each toast type', () => {
        // Test success
        expect(component['getBackgroundColor'](new ToastData('success', 'test'), mockToastConfig))
          .toBe(mockToastConfig.colorBgSuccess);

        // Test error
        expect(component['getBackgroundColor'](new ToastData('error', 'test'), mockToastConfig))
          .toBe(mockToastConfig.colorBgError);

        // Test warn
        expect(component['getBackgroundColor'](new ToastData('warn', 'test'), mockToastConfig))
          .toBe(mockToastConfig.colorBgWarn);

        // Test info
        expect(component['getBackgroundColor'](new ToastData('info', 'test'), mockToastConfig))
          .toBe(mockToastConfig.colorBgInfo);

      });
    });

    describe('getTextColor', () => {
      it('should return correct color for each toast type', () => {
        // Test success
        expect(component['getTextColor'](new ToastData('success', 'test'), mockToastConfig))
          .toBe(mockToastConfig.colorTxtSuccess);

        // Test error
        expect(component['getTextColor'](new ToastData('error', 'test'), mockToastConfig))
          .toBe(mockToastConfig.colorTxtError);

        // Test warn
        expect(component['getTextColor'](new ToastData('warn', 'test'), mockToastConfig))
          .toBe(mockToastConfig.colorTxtWarn);

        // Test info
        expect(component['getTextColor'](new ToastData('info', 'test'), mockToastConfig))
          .toBe(mockToastConfig.colorTxtInfo);

      });
    });
  });

  describe('Animation configuration', () => {
    it('should use animation config from toast config', async () => {
      // Arrange & Act
      await setupComponent();
      fixture.detectChanges();
      const compiled = fixture.nativeElement;
      const toastElement = compiled.querySelector('.toast');

      // Assert - check that animation binding is properly set up
      expect(toastElement).toBeTruthy();
      expect(component['_toastConfig'].animationConfig).toBeDefined();
    });

    it('should handle fade animation type', async () => {
      // Arrange & Act
      await setupComponent('info', 'Test message', { animationType: 'fade' });
      fixture.detectChanges();

      // Assert
      expect(component['_animationState']()).toBe('fade');
    });

    it('should handle slide animation type', async () => {
      // Arrange & Act
      await setupComponent('info', 'Test message', { animationType: 'slide' });
      fixture.detectChanges();

      // Assert
      expect(component['_animationState']()).toBe('slide');
    });

    it('should handle scale animation type', async () => {
      // Arrange & Act
      await setupComponent('info', 'Test message', { animationType: 'scale' });
      fixture.detectChanges();

      // Assert
      expect(component['_animationState']()).toBe('scale');
    });

    it('should handle bounce animation type', async () => {
      // Arrange & Act
      await setupComponent('info', 'Test message', { animationType: 'bounce' });
      fixture.detectChanges();

      // Assert
      expect(component['_animationState']()).toBe('bounce');
    });
  });
});
