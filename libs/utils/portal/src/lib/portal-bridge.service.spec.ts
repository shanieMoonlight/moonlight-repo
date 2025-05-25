import { TestBed } from '@angular/core/testing';
import { Portal, ComponentPortal } from '@angular/cdk/portal';
import { signal, effect, Component } from '@angular/core';

import { SbPortalBridgeService } from './portal-bridge.service';

// Simple test component to use with ComponentPortal
@Component({
  standalone: true,
  template: `<div>Test Portal Content</div>`
})
class TestPortalComponent {}

// Another test component for testing multiple portals
@Component({
  standalone: true,
  template: `<div>Second Portal Content</div>`
})
class SecondTestPortalComponent {}

describe('SbPortalBridgeService', () => {
  let service: SbPortalBridgeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SbPortalBridgeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('updatePortal', () => {
    it('should add a new portal to the registry', () => {
      const portal = new ComponentPortal(TestPortalComponent);
      const portalName = 'test-portal';

      service.updatePortal(portalName, portal);

      const nameSignal = signal(portalName);
      const retrievedPortal = service.getPortal(nameSignal)();
      
      expect(retrievedPortal).toBe(portal);
    });

    it('should update an existing portal in the registry', () => {
      const portal1 = new ComponentPortal(TestPortalComponent);
      const portal2 = new ComponentPortal(SecondTestPortalComponent);
      const portalName = 'test-portal';

      // Add first portal
      service.updatePortal(portalName, portal1);
      
      // Update with second portal
      service.updatePortal(portalName, portal2);

      const nameSignal = signal(portalName);
      const retrievedPortal = service.getPortal(nameSignal)();
      
      expect(retrievedPortal).toBe(portal2);
      expect(retrievedPortal).not.toBe(portal1);
    });    it('should trigger signal updates when portal is added', () => {
      const portal = new ComponentPortal(TestPortalComponent);
      const portalName = 'test-portal';
      const nameSignal = signal(portalName);
      
      let portalValue: Portal<unknown> | undefined = undefined;
      const effectCleanup = TestBed.runInInjectionContext(() => {
        return effect(() => {
          portalValue = service.getPortal(nameSignal)();
        });
      });

      // Flush effects to ensure initial run
      TestBed.flushEffects();

      // Initially should be undefined
      expect(portalValue).toBeUndefined();

      // Add portal - should trigger effect
      service.updatePortal(portalName, portal);
      
      // Flush effects to ensure effect runs after signal update
      TestBed.flushEffects();
      
      expect(portalValue).toBe(portal);
      
      effectCleanup.destroy();
    });
  });

  describe('removePortal', () => {
    it('should remove an existing portal from the registry', () => {
      const portal = new ComponentPortal(TestPortalComponent);
      const portalName = 'test-portal';

      // Add portal first
      service.updatePortal(portalName, portal);
      
      // Verify it exists
      const nameSignal = signal(portalName);
      expect(service.getPortal(nameSignal)()).toBe(portal);

      // Remove portal
      service.removePortal(portalName);

      // Verify it's removed
      expect(service.getPortal(nameSignal)()).toBeUndefined();
    });    it('should handle removing non-existent portal gracefully', () => {
      const portalName = 'non-existent-portal';
      
      // Should not throw error
      expect(() => service.removePortal(portalName)).not.toThrow();
      
      // Portal should still be undefined
      const nameSignal = signal(portalName);
      expect(service.getPortal(nameSignal)()).toBeUndefined();
    });
      it('should detach portal if it is attached before removing it', () => {
      const portal = new ComponentPortal(TestPortalComponent);
      const portalName = 'detach-test-portal';
      
      // Mock the isAttached property and detach method
      Object.defineProperty(portal, 'isAttached', { get: () => true });
      const detachSpy = jest.spyOn(portal, 'detach').mockImplementation(() => null);
      
      // Add portal first
      service.updatePortal(portalName, portal);
      
      // Remove portal - should trigger detach
      service.removePortal(portalName);
      
      // Verify detach was called
      expect(detachSpy).toHaveBeenCalled();
      
      // Cleanup
      detachSpy.mockRestore();
    });
    
    it('should handle errors during portal detachment gracefully', () => {
      const portal = new ComponentPortal(TestPortalComponent);
      const portalName = 'error-detach-test';
      
      // Mock the isAttached property and make detach throw an error
      Object.defineProperty(portal, 'isAttached', { get: () => true });
      const detachSpy = jest.spyOn(portal, 'detach').mockImplementation(() => {
        throw new Error('Detach error');
      });
      
      // Add portal first
      service.updatePortal(portalName, portal);
      
      // Should not throw even though detach throws
      expect(() => service.removePortal(portalName)).not.toThrow();
      
      // Verify detach was called
      expect(detachSpy).toHaveBeenCalled();
      
      // Verify portal was still removed despite the error
      const nameSignal = signal(portalName);
      expect(service.getPortal(nameSignal)()).toBeUndefined();
      
      // Cleanup
      detachSpy.mockRestore();
    });

    it('should trigger signal updates when portal is removed', () => {
      const portal = new ComponentPortal(TestPortalComponent);
      const portalName = 'test-portal';
      const nameSignal = signal(portalName);
      
      // Add portal first
      service.updatePortal(portalName, portal);
      
      let portalValue: Portal<unknown> | undefined = undefined;
      const effectCleanup = TestBed.runInInjectionContext(() => {
        return effect(() => {
          portalValue = service.getPortal(nameSignal)();
        });
      });

      // Flush effects to get initial value
      TestBed.flushEffects();

      // Should have the portal
      expect(portalValue).toBe(portal);

      // Remove portal - should trigger effect
      service.removePortal(portalName);
      
      // Flush effects to ensure effect runs after signal update
      TestBed.flushEffects();
      
      expect(portalValue).toBeUndefined();
      
      effectCleanup.destroy();
    });
  });

  describe('getPortal', () => {
    it('should return undefined for non-existent portal', () => {
      const nameSignal = signal('non-existent');
      const portalSignal = service.getPortal(nameSignal);
      
      expect(portalSignal()).toBeUndefined();
    });

    it('should return the correct portal for existing name', () => {
      const portal = new ComponentPortal(TestPortalComponent);
      const portalName = 'test-portal';
      
      service.updatePortal(portalName, portal);
      
      const nameSignal = signal(portalName);
      const portalSignal = service.getPortal(nameSignal);
      
      expect(portalSignal()).toBe(portal);
    });

    it('should be reactive to name signal changes', () => {
      const portal1 = new ComponentPortal(TestPortalComponent);
      const portal2 = new ComponentPortal(SecondTestPortalComponent);
      
      service.updatePortal('portal1', portal1);
      service.updatePortal('portal2', portal2);
      
      const nameSignal = signal('portal1');
      const portalSignal = service.getPortal(nameSignal);
      
      // Initially should return portal1
      expect(portalSignal()).toBe(portal1);
      
      // Change name signal to portal2
      nameSignal.set('portal2');
      
      // Should now return portal2
      expect(portalSignal()).toBe(portal2);
    });

    it('should be reactive to portal registry changes', () => {
      const portal = new ComponentPortal(TestPortalComponent);
      const portalName = 'reactive-portal';
      const nameSignal = signal(portalName);
      const portalSignal = service.getPortal(nameSignal);
      
      // Initially undefined
      expect(portalSignal()).toBeUndefined();
      
      // Add portal
      service.updatePortal(portalName, portal);
      
      // Should now return the portal
      expect(portalSignal()).toBe(portal);
      
      // Remove portal
      service.removePortal(portalName);
      
      // Should be undefined again
      expect(portalSignal()).toBeUndefined();
    });
  });

  describe('integration scenarios', () => {
    it('should handle multiple portals independently', () => {
      const portal1 = new ComponentPortal(TestPortalComponent);
      const portal2 = new ComponentPortal(SecondTestPortalComponent);
      
      service.updatePortal('portal1', portal1);
      service.updatePortal('portal2', portal2);
      
      const name1Signal = signal('portal1');
      const name2Signal = signal('portal2');
      
      expect(service.getPortal(name1Signal)()).toBe(portal1);
      expect(service.getPortal(name2Signal)()).toBe(portal2);
      
      // Remove one should not affect the other
      service.removePortal('portal1');
      
      expect(service.getPortal(name1Signal)()).toBeUndefined();
      expect(service.getPortal(name2Signal)()).toBe(portal2);
    });    it('should work with effects for automatic cleanup patterns', () => {
      const portal = new ComponentPortal(TestPortalComponent);
      const portalName = 'effect-test-portal';
      const nameSignal = signal(portalName);
      
      let effectRunCount = 0;
      let lastPortalValue: Portal<unknown> | undefined;
      
      const effectCleanup = TestBed.runInInjectionContext(() => {
        return effect(() => {
          effectRunCount++;
          lastPortalValue = service.getPortal(nameSignal)();
        });
      });

      // Flush effects to ensure initial run
      TestBed.flushEffects();

      // Effect should run once initially
      expect(effectRunCount).toBe(1);
      expect(lastPortalValue).toBeUndefined();

      // Add portal - should trigger effect
      service.updatePortal(portalName, portal);
      
      // Flush effects to ensure effect runs
      TestBed.flushEffects();
      
      expect(effectRunCount).toBe(2);
      expect(lastPortalValue).toBe(portal);

      // Remove portal - should trigger effect
      service.removePortal(portalName);
      
      // Flush effects to ensure effect runs
      TestBed.flushEffects();
      
      expect(effectRunCount).toBe(3);
      expect(lastPortalValue).toBeUndefined();

      effectCleanup.destroy();
    });

    it('should maintain portal isolation between different service instances', () => {
      // Create a second service instance for testing
      const service2 = new SbPortalBridgeService();
      const portal = new ComponentPortal(TestPortalComponent);
      const portalName = 'isolation-test';
      
      service.updatePortal(portalName, portal);
      
      const nameSignal = signal(portalName);
      
      // First service should have the portal
      expect(service.getPortal(nameSignal)()).toBe(portal);
      
      // Second service should not have the portal
      expect(service2.getPortal(nameSignal)()).toBeUndefined();
    });
  });
});