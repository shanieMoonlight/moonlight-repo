export const TestingCode = `// portal-input.component.spec.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { SbPortalInputComponent } from './portal-input.component';
import { SbPortalBridgeService } from './portal-bridge.service';

@Component({
  template: \`
    <!-- Define template -->
    <ng-template #testTemplate>
      <div data-testid="portal-content">Test Content</div>
    </ng-template>
    
    <!-- Project template -->
    <sb-portal-input name="test-portal" [portalTemplate]="testTemplate"></sb-portal-input>
  \`
})
class TestHostComponent {}

describe('SbPortalInputComponent', () => {
  let component: TestHostComponent;
  let fixture: ComponentFixture<TestHostComponent>;
  let portalBridge: SbPortalBridgeService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SbPortalInputComponent],
      declarations: [TestHostComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
    portalBridge = TestBed.inject(SbPortalBridgeService);
  });

  it('should register portal with bridge service', () => {
    fixture.detectChanges();
    
    expect(portalBridge.hasPortal('test-portal')).toBe(true);
  });

  it('should create template portal from TemplateRef', () => {
    fixture.detectChanges();
    
    const portal = portalBridge.getPortal('test-portal');
    expect(portal).toBeTruthy();
    expect(portal.constructor.name).toBe('TemplatePortal');
  });
});`;

export const E2ETestingCode = `// portal.e2e.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Portal System', () => {
  test('should teleport content between locations', async ({ page }) => {
    await page.goto('/portal-demo');

    // Content should appear in the portal input initially
    await expect(page.locator('[data-testid="portal-input"] .content'))
      .toBeVisible();

    // Content should also appear in the portal outlet
    await expect(page.locator('[data-testid="portal-outlet"] .content'))
      .toBeVisible();

    // Both should have the same content
    const inputText = await page.locator('[data-testid="portal-input"] .content')
      .textContent();
    const outletText = await page.locator('[data-testid="portal-outlet"] .content')
      .textContent();
    
    expect(inputText).toBe(outletText);
  });

  test('should handle multiple named portals', async ({ page }) => {
    await page.goto('/portal-demo');

    await expect(page.locator('[data-testid="header-outlet"]'))
      .toContainText('Header Content');
    await expect(page.locator('[data-testid="sidebar-outlet"]'))
      .toContainText('Sidebar Content');
  });
});`;
