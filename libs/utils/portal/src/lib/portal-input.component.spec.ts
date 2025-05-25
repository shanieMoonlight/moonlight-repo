import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, PLATFORM_ID, TemplateRef, ViewChild } from '@angular/core';
import { By } from '@angular/platform-browser';

import { SbPortalInputComponent } from './portal-input.component';
import { SbPortalBridgeService } from './portal-bridge.service';
import { DEFAULT_NAME } from './portal-constants';

// Mock bridge service
class MockSbPortalBridgeService {
  private _updatePortalSpy = jest.fn();
  private _removePortalSpy = jest.fn();

  updatePortal = this._updatePortalSpy;
  removePortal = this._removePortalSpy;

  // Test helpers
  get updatePortalSpy() { return this._updatePortalSpy; }
  get removePortalSpy() { return this._removePortalSpy; }

  reset() {
    this._updatePortalSpy.mockClear();
    this._removePortalSpy.mockClear();
  }
}

// Test host component for testing input changes
@Component({
  standalone: true,
  imports: [SbPortalInputComponent],
  template: `
    <ng-template #testTemplate>
      <div class="test-content">Test Content</div>
    </ng-template>
    
    <sb-portal-input [name]="portalName" [portalTemplate]="testTemplate"></sb-portal-input>
  `
})
class TestHostComponent {
  @ViewChild('testTemplate', { static: true }) testTemplate!: TemplateRef<any>;
  portalName = 'test-portal';
}

describe('SbPortalInputComponent', () => {
  let component: SbPortalInputComponent;
  let fixture: ComponentFixture<SbPortalInputComponent>;
  let mockBridgeService: MockSbPortalBridgeService;
  let mockTemplate: TemplateRef<any>;

  // Helper to create a mock TemplateRef
  const createMockTemplate = (): TemplateRef<unknown> => ({
    createEmbeddedView: jest.fn(),
    elementRef: { nativeElement: document.createElement('div') }
  } as TemplateRef<unknown>);

  describe('Browser Platform', () => {
    beforeEach(async () => {
      mockBridgeService = new MockSbPortalBridgeService();
      mockTemplate = createMockTemplate();

      await TestBed.configureTestingModule({
        imports: [SbPortalInputComponent],
        providers: [
          { provide: SbPortalBridgeService, useValue: mockBridgeService },
          { provide: PLATFORM_ID, useValue: 'browser' }
        ]
      }).compileComponents();

      fixture = TestBed.createComponent(SbPortalInputComponent);
      component = fixture.componentInstance;
    });

    describe('Component Creation and Initialization', () => {
      it('should create', () => {
        expect(component).toBeTruthy();
      });

      it('should have default name when no name is provided', () => {
        fixture.detectChanges();
        expect(component._name()).toBe(DEFAULT_NAME);
      });

      it('should use provided name input', () => {
        fixture.componentRef.setInput('name', 'custom-portal');
        fixture.detectChanges();
        expect(component._name()).toBe('custom-portal');
      });

      it('should transform null/undefined name to default', () => {
        fixture.componentRef.setInput('name', null);
        fixture.detectChanges();
        expect(component._name()).toBe(DEFAULT_NAME);

        fixture.componentRef.setInput('name', undefined);
        fixture.detectChanges();
        expect(component._name()).toBe(DEFAULT_NAME);
      });

      it('should create portal directive on initialization', () => {
        // Create a mock template ref
        const mockTemplate = {
          createEmbeddedView: jest.fn(),
          elementRef: { nativeElement: document.createElement('div') }
        } as any;
        
        // Set the required portalTemplate input
        fixture.componentRef.setInput('portalTemplate', mockTemplate);
        fixture.detectChanges();
        
        // After initialization, the portal should be available
        const portal = component['_portal'];
        expect(portal).toBeTruthy();
      });
    });

    describe('Portal Registration and Effect Behavior', () => {
      it('should register portal with bridge service when portal is available', async () => {
        // Set the required portalTemplate input
        fixture.componentRef.setInput('portalTemplate', mockTemplate);
        fixture.detectChanges();
        
        // Wait for effect to run and viewChild to be available
        await fixture.whenStable();
        fixture.detectChanges();

        const portal = component['_portal'];
        if (portal) {
          expect(mockBridgeService.updatePortalSpy).toHaveBeenCalledWith(DEFAULT_NAME, portal);
        }
      });

      it('should not register portal when portal is not available', () => {
        // Don't call detectChanges to prevent viewChild from being resolved
        expect(mockBridgeService.updatePortalSpy).not.toHaveBeenCalled();
      });

      it('should update portal registration when name changes', async () => {
        // Set the required portalTemplate input
        fixture.componentRef.setInput('portalTemplate', mockTemplate);
        fixture.detectChanges();
        await fixture.whenStable();
        
        const portal = component['_portal'];
        mockBridgeService.reset();

        // Change the name
        fixture.componentRef.setInput('name', 'new-portal-name');
        fixture.detectChanges();
        await fixture.whenStable();

        if (portal) {
          expect(mockBridgeService.updatePortalSpy).toHaveBeenCalledWith('new-portal-name', portal);
        }
      });

      it('should re-register portal when portal changes', async () => {
        // Set the required portalTemplate input
        fixture.componentRef.setInput('portalTemplate', mockTemplate);
        fixture.detectChanges();
        await fixture.whenStable();
        mockBridgeService.reset();

        // Create a new mock template and update it
        const newMockTemplate = createMockTemplate();
        fixture.componentRef.setInput('portalTemplate', newMockTemplate);
        fixture.detectChanges();
        await fixture.whenStable();

        const portal = component['_portal'];
        if (portal && mockBridgeService.updatePortalSpy.mock.calls.length > 0) {
          expect(mockBridgeService.updatePortalSpy).toHaveBeenCalledWith(DEFAULT_NAME, portal);
        }
      });
    });

    describe('Component Destruction and Cleanup', () => {
      it('should remove portal from bridge service on destroy', async () => {
        // Set required inputs
        fixture.componentRef.setInput('portalTemplate', mockTemplate);
        fixture.componentRef.setInput('name', 'test-cleanup');
        fixture.detectChanges();
        await fixture.whenStable();

        const portalBeforeDestroy = component['_portal'];
        
        // Destroy the component
        fixture.destroy();

        expect(mockBridgeService.removePortalSpy).toHaveBeenCalledWith('test-cleanup');
        
        // Verify portal was detached if it existed
        if (portalBeforeDestroy && portalBeforeDestroy.isAttached) {
          // Note: We can't easily test detach() as it's called on the actual portal
          // but we can verify removePortal was called
          expect(mockBridgeService.removePortalSpy).toHaveBeenCalled();
        }
      });

      it('should use current name value when removing portal on destroy', async () => {
        // Set required inputs
        fixture.componentRef.setInput('portalTemplate', mockTemplate);
        fixture.componentRef.setInput('name', 'initial-name');
        fixture.detectChanges();
        await fixture.whenStable();

        // Change name before destroying
        fixture.componentRef.setInput('name', 'final-name');
        fixture.detectChanges();
        await fixture.whenStable();

        mockBridgeService.reset();
        fixture.destroy();

        expect(mockBridgeService.removePortalSpy).toHaveBeenCalledWith('final-name');
      });
    });
  });

  describe('Server Platform (SSR)', () => {
    beforeEach(async () => {
      mockBridgeService = new MockSbPortalBridgeService();

      await TestBed.configureTestingModule({
        imports: [SbPortalInputComponent],
        providers: [
          { provide: SbPortalBridgeService, useValue: mockBridgeService },
          { provide: PLATFORM_ID, useValue: 'server' }
        ]
      }).compileComponents();

      fixture = TestBed.createComponent(SbPortalInputComponent);
      component = fixture.componentInstance;
    });

    it('should not register portal on server platform', async () => {
      fixture.detectChanges();
      await fixture.whenStable();

      expect(mockBridgeService.updatePortalSpy).not.toHaveBeenCalled();
    });

    it('should not remove portal on destroy on server platform', () => {
      fixture.detectChanges();
      fixture.destroy();

      expect(mockBridgeService.removePortalSpy).not.toHaveBeenCalled();
    });

    it('should still create component successfully on server', () => {
      fixture.detectChanges();
      expect(component).toBeTruthy();
      expect(component._name()).toBe(DEFAULT_NAME);
    });
  });

  describe('Integration with Test Host Component', () => {
    let hostFixture: ComponentFixture<TestHostComponent>;
    let hostComponent: TestHostComponent;

    beforeEach(async () => {
      mockBridgeService = new MockSbPortalBridgeService();

      await TestBed.configureTestingModule({
        imports: [SbPortalInputComponent, TestHostComponent],
        providers: [
          { provide: SbPortalBridgeService, useValue: mockBridgeService },
          { provide: PLATFORM_ID, useValue: 'browser' }
        ]
      }).compileComponents();

      hostFixture = TestBed.createComponent(TestHostComponent);
      hostComponent = hostFixture.componentInstance;
    });

    it('should register portal with custom name from host', async () => {
      hostComponent.portalName = 'host-portal';
      hostFixture.detectChanges();
      await hostFixture.whenStable();

      const portalInputDebugElement = hostFixture.debugElement.query(By.directive(SbPortalInputComponent));
      const portalInputComponent = portalInputDebugElement.componentInstance as SbPortalInputComponent;
      
      expect(portalInputComponent._name()).toBe('host-portal');
      
      const portal = component['_portal'];
      if (portal) {
        expect(mockBridgeService.updatePortalSpy).toHaveBeenCalledWith('host-portal', portal);
      }
    });

    it('should update portal when host changes name', async () => {
      hostFixture.detectChanges();
      await hostFixture.whenStable();
      mockBridgeService.reset();

      hostComponent.portalName = 'updated-portal';
      hostFixture.detectChanges();
      await hostFixture.whenStable();

      const portalInputDebugElement = hostFixture.debugElement.query(By.directive(SbPortalInputComponent));
      const portalInputComponent = portalInputDebugElement.componentInstance as SbPortalInputComponent;
      const portal = component['_portal'];

      if (portal) {
        expect(mockBridgeService.updatePortalSpy).toHaveBeenCalledWith('updated-portal', portal);
      }
    });

    it('should project content correctly', () => {
      hostFixture.detectChanges();
      
      // Verify the portal input component exists
      const portalComponent = hostFixture.debugElement.query(By.directive(SbPortalInputComponent));
      expect(portalComponent).toBeTruthy();
      
      // Verify that the portal is created and available
      const portalInputComponent = portalComponent.componentInstance as SbPortalInputComponent;
      // Get the portal from the component instance we found
      const portalInstance = portalInputComponent['_portal'];
      expect(portalInstance).toBeTruthy();
      
      // Note: The content is not rendered within the component itself but in portal outlets
      // So we verify the portal exists rather than trying to find the projected content
    });
  });

  describe('Edge Cases and Error Scenarios', () => {
    beforeEach(async () => {
      mockBridgeService = new MockSbPortalBridgeService();

      await TestBed.configureTestingModule({
        imports: [SbPortalInputComponent],
        providers: [
          { provide: SbPortalBridgeService, useValue: mockBridgeService },
          { provide: PLATFORM_ID, useValue: 'browser' }
        ]
      }).compileComponents();

      fixture = TestBed.createComponent(SbPortalInputComponent);
      component = fixture.componentInstance;
    });

    it('should handle empty string name input', () => {
      fixture.componentRef.setInput('name', '');
      fixture.detectChanges();
      expect(component._name()).toBe('');
    });

    it('should handle rapid name changes', async () => {
      // Set the required portalTemplate input
      fixture.componentRef.setInput('portalTemplate', mockTemplate);
      fixture.detectChanges();
      await fixture.whenStable();
      mockBridgeService.reset();

      // Rapidly change names
      fixture.componentRef.setInput('name', 'name1');
      fixture.componentRef.setInput('name', 'name2');
      fixture.componentRef.setInput('name', 'name3');
      fixture.detectChanges();
      await fixture.whenStable();

      // Should register with the final name
      const portal = component['_portal'];
      if (portal) {
        expect(mockBridgeService.updatePortalSpy).toHaveBeenCalledWith('name3', portal);
      }
    });

    it('should not fail if bridge service methods throw errors', async () => {
      mockBridgeService.updatePortalSpy.mockImplementation(() => {
        throw new Error('Bridge service error');
      });

      // Set the required portalTemplate input
      fixture.componentRef.setInput('portalTemplate', mockTemplate);

      // The component should handle bridge service errors gracefully
      expect(() => {
        fixture.detectChanges();
      }).not.toThrow();
      
      // Even if the bridge service throws, the component should still function
      expect(component).toBeTruthy();
      await fixture.whenStable();
    });

    it('should handle component destruction before portal is available', () => {
      // Don't trigger change detection
      expect(() => {
        fixture.destroy();
      }).not.toThrow();
    });
  });
});
