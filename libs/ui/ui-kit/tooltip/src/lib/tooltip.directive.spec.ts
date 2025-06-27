import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { SbTooltipDirective } from './tooltip.directive';

@Component({
  template: `<button sbTooltip="Test tooltip" tooltipPosition="top">Hover me</button>`,
  standalone: true,
  imports: [SbTooltipDirective],
})
class TestHostComponent { }

describe('SbTooltipDirective', () => {
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestHostComponent]
    });
    fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
  });

  it('should create an instance', () => {
    const tooltipDe = fixture.debugElement.query(By.directive(SbTooltipDirective));
    expect(tooltipDe).toBeTruthy();
    expect(tooltipDe.injector.get(SbTooltipDirective)).toBeTruthy();
  });

  it('should show tooltip on mouseenter and hide on mouseleave', fakeAsync(() => {
    const tooltipDe = fixture.debugElement.query(By.directive(SbTooltipDirective));
    // Trigger mouseenter
    tooltipDe.triggerEventHandler('mouseenter', {});
    fixture.detectChanges();
    tick(20); // allow setTimeout in animate()
    fixture.detectChanges();
    tick(100); // Give the DOM a little more time

    // Tooltip should be in the DOM
    const tooltip = document.body.querySelector('.sb-tooltip') as HTMLElement;
    expect(tooltip).toBeTruthy();
    console.log('tooltip', tooltip);
    console.log('tooltip', tooltip.innerText);

    expect(tooltip.innerText).toContain('Test tooltip');

    // Should have correct classes
    expect(tooltip.classList.contains('sb-tooltip')).toBeTruthy();
    expect(tooltip.classList.contains('sb-tooltip-top')).toBeTruthy();

    // Should animate to correct styles
    tick(500); // allow transition to finish
    fixture.detectChanges();
    tick(100); // Give the DOM a little more time

    expect(tooltip.style.opacity).not.toBe('0');
    expect(
      tooltip.style.transform === 'translateY(0)' ||
      tooltip.style.transform === 'translateX(0)'
    ).toBeTruthy();

    // Trigger mouseleave
    tooltipDe.triggerEventHandler('mouseleave', {});
    fixture.detectChanges();
    tick();

    // Tooltip should be removed from DOM
    expect(document.body.querySelector('.sb-tooltip')).toBeFalsy();
  }));
});