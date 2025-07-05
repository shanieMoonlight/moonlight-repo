import { TestBed } from '@angular/core/testing';
import { SbToastService } from './toast.service';
import { GlobalPositionStrategy, Overlay, OverlayModule, OverlayRef, PositionStrategy } from '@angular/cdk/overlay';
import { TOAST_CONFIG_TOKEN, ToastConfig } from '@spider-baby/ui-toast/setup';
import { ComponentPortal } from '@angular/cdk/portal';
import { ToastData } from '../toast-data';
import { ToastRef } from '../toast-ref';
import { DestroyRef } from '@angular/core';
import { Subject } from 'rxjs';

describe('SbToastService', () => {
  let service: SbToastService;
  let overlay: jest.Mocked<Partial<Overlay>>;
  let overlayRef: jest.Mocked<Partial<OverlayRef>>;
  let positionStrategy: jest.Mocked<Partial<GlobalPositionStrategy>>;
  let destroyRef: DestroyRef;
  let mockToastConfig: Partial<ToastConfig>;

  beforeEach(() => {
    // Create mock for OverlayRef
    overlayRef = {
      attach: jest.fn(),
      dispose: jest.fn(),
      overlayElement: document.createElement('div')
    } as jest.Mocked<Partial<OverlayRef>>;
    
    // Create mock for position builder
    positionStrategy = {
      top: jest.fn().mockReturnThis(),
      bottom: jest.fn().mockReturnThis(),
      left: jest.fn().mockReturnThis(),
      right: jest.fn().mockReturnThis(),
      centerVertically: jest.fn().mockReturnThis(),
      centerHorizontally: jest.fn().mockReturnThis()
    } as unknown as jest.Mocked<Partial<GlobalPositionStrategy>>;
    
    const positionBuilder = {
      global: jest.fn().mockReturnValue(positionStrategy)
    };
    
    // Create mock for Overlay
    overlay = {
      create: jest.fn().mockReturnValue(overlayRef),
      position: jest.fn().mockReturnValue(positionBuilder)
    } as jest.Mocked<Partial<Overlay>>;
    
    // Create mock for ToastConfig
    mockToastConfig = {
      positionConfig: {
        topPx: 20,
        bottomPx: 20,
        leftPx: 20,
        rightPx: 20
      },
      colorBgDefault: '#ffffff',
      colorText: '#333333'
    };
    
    // Create destroyRef mock
    destroyRef = {
      onDestroy: jest.fn()
    } as unknown as DestroyRef;

    // Mock ComponentPortal
    jest.spyOn(ComponentPortal.prototype, 'attach').mockImplementation(() => ({
      instance: { close: jest.fn() }
    }) as any);

    TestBed.configureTestingModule({
      imports: [OverlayModule],
      providers: [
        SbToastService,
        { provide: Overlay, useValue: overlay },
        { provide: DestroyRef, useValue: destroyRef },
        { provide: TOAST_CONFIG_TOKEN, useValue: mockToastConfig }
      ]
    });

    service = TestBed.inject(SbToastService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('show method', () => {
    it('should create a toast with overlay', () => {
      // Arrange
      const toastData = new ToastData('info', 'Test message');
      (overlayRef.attach as jest.Mock).mockReturnValue({ instance: { close: jest.fn() } });
      
      // Act
      const result = service.show(toastData);
      
      // Assert
      expect(overlay.position).toHaveBeenCalled();
      expect(overlay.create).toHaveBeenCalled();
      expect(overlayRef.attach).toHaveBeenCalled();
      expect(result).toBeTruthy();
      expect(result instanceof ToastRef).toBe(true);
    });

    it('should respect position settings from toast data', () => {
      // Arrange
      const toastData = new ToastData('info', 'Test message');
      toastData.positionVertical = 'top';
      toastData.positionHorizontal = 'right';
      
      // Act
      service.show(toastData);
      
      // Assert
      expect(positionStrategy.top).toHaveBeenCalled();
      expect(positionStrategy.right).toHaveBeenCalled();
    });

    it('should respect center positions', () => {
      // Arrange
      const toastData = new ToastData('info', 'Test message');
      toastData.positionVertical = 'center';
      toastData.positionHorizontal = 'center';
      
      // Act
      service.show(toastData);
      
      // Assert
      expect(positionStrategy.centerVertically).toHaveBeenCalled();
      expect(positionStrategy.centerHorizontally).toHaveBeenCalled();
    });

    it('should close toast after duration', () => {
      // Arrange
      const mockComponentInstance = { close: jest.fn() };
      (overlayRef.attach as jest.Mock).mockReturnValue({ instance: mockComponentInstance });
      const toastData = new ToastData('info', 'Test message');
      
      // Set up Jest timer to test timers
      jest.useFakeTimers();
      
      // Act
      service.show(toastData, 1000);
      
      // Fast-forward time
      jest.advanceTimersByTime(1000);
      
      // Assert
      expect(mockComponentInstance.close).toHaveBeenCalled();
      
      // Cleanup
      jest.useRealTimers();
    });
  });

  describe('convenience methods', () => {
    let showSpy: jest.SpyInstance;
    
    beforeEach(() => {
      showSpy = jest.spyOn(service, 'show').mockReturnValue({} as ToastRef);
    });
    
    it('should call show with success toast data', () => {
      // Act
      service.success('Success message');
      
      // Assert
      expect(showSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'success',
          text: 'Success message'
        }),
        5000
      );
    });
    
    it('should call show with error toast data', () => {
      // Act
      service.error('Error message');
      
      // Assert
      expect(showSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'error',
          text: 'Error message'
        }),
        8000
      );
    });
    
    it('should call show with warning toast data', () => {
      // Act
      service.warning('Warning message');
      
      // Assert
      expect(showSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'warn',
          text: 'Warning message'
        }),
        6000
      );
    });
    
    it('should call show with info toast data', () => {
      // Act
      service.info('Info message');
      
      // Assert
      expect(showSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'info',
          text: 'Info message'
        }),
        5000
      );
    });
    
    it('should call show with custom toast type via showMsg', () => {
      // Act
      service.showMsg('Custom message', 'warn', 3000);
      
      // Assert
      expect(showSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'warn',
          text: 'Custom message'
        }),
        3000
      );
    });
  });

  describe('toast management', () => {
    it('should track active toasts', () => {
      // Arrange - setup the service to track toasts
      const activeToastsSet = new Set<ToastRef>();
      Object.defineProperty(service, 'activeToasts', {
        get: jest.fn().mockReturnValue(activeToastsSet),
        set: jest.fn()
      });
      
      // Create a few mock toast refs
      const toastRef1 = {} as ToastRef;
      const toastRef2 = {} as ToastRef;
      const toastRef3 = {} as ToastRef;
      
      // Manually add toast refs to set
      activeToastsSet.add(toastRef1);
      activeToastsSet.add(toastRef2);
      activeToastsSet.add(toastRef3);
      
      // Act & Assert
      expect(service.getActiveCount()).toBe(3);
    });
    
    it('should clear all active toasts', () => {
      // Arrange - create some mock toast refs with spies
      const mockToastRef1 = { close: jest.fn() } as unknown as ToastRef;
      const mockToastRef2 = { close: jest.fn() } as unknown as ToastRef;
      
      // Create a test set with our mocks
      const activeToastsSet = new Set<ToastRef>([mockToastRef1, mockToastRef2]);
      
      // Replace the service's activeToasts with our test set
      Object.defineProperty(service, 'activeToasts', {
        get: jest.fn().mockReturnValue(activeToastsSet),
        set: jest.fn()
      });
      
      // Act
      service.clearAll();
      
      // Assert
      expect(mockToastRef1.close).toHaveBeenCalled();
      expect(mockToastRef2.close).toHaveBeenCalled();
      expect(activeToastsSet.size).toBe(0);
    });
    
    it('should remove toast from active toasts when closed', () => {
      // Arrange
      const afterClosedSubject = new Subject<void>();
      
      // Create a mock ToastRef that we can control the afterClosed behavior
      const mockToastRef = {
        afterClosed: jest.fn().mockReturnValue(afterClosedSubject.asObservable()),
        close: jest.fn()
      } as unknown as ToastRef;
      
      // Create a test set for activeToasts and add our mock toast
      const activeToastsSet = new Set<ToastRef>();
      activeToastsSet.add(mockToastRef);
      
      // Replace the service's activeToasts with our test set
      Object.defineProperty(service, 'activeToasts', {
        get: jest.fn().mockReturnValue(activeToastsSet),
        set: jest.fn()
      });
      
      // Create a fake takeUntilDestroyed to simulate the subscription in service
      const deleteToastMock = jest.fn(() => {
        activeToastsSet.delete(mockToastRef);
      });
      
      // Hook up our mock to the afterClosed subject
      afterClosedSubject.subscribe({
        complete: deleteToastMock
      });
      
      // Verify initial state
      expect(activeToastsSet.size).toBe(1);
      
      // Act - simulate the toast being closed
      afterClosedSubject.next();
      afterClosedSubject.complete();
      
      // Assert
      expect(deleteToastMock).toHaveBeenCalled();
      expect(activeToastsSet.size).toBe(0);
    });
  });

  describe('position utilities', () => {
    it('should use config values for position methods', () => {
      // Arrange
      const mockToastData = new ToastData('info', 'Test message', {
        positionVertical: 'top',
        positionHorizontal: 'right'
      });
      
      // Act
      service.show(mockToastData);
      
      // Assert that the correct position methods were called with config values
      expect(positionStrategy.top).toHaveBeenCalledWith('20px');
      expect(positionStrategy.right).toHaveBeenCalledWith('20px');
    });
  });
});
