import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { SbClickOutsideDirective } from './click-outside.directive';

@Component({
  template: `
    <div id="inside" sbOutsideClick (sbOutsideClick)="onOutside()">Inside</div>
    <div id="outside">Outside</div>
  `,
  standalone: true,
  imports: [SbClickOutsideDirective]
})
class TestHostComponent {
  outsideSpy = jest.fn();
  onOutside() {
    this.outsideSpy();
  }
}

describe('SbClickOutsideDirective', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let hostComponent: TestHostComponent;
  let insideEl: HTMLElement;
  let outsideEl: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(TestHostComponent);
    hostComponent = fixture.componentInstance;
    fixture.detectChanges();
    insideEl = fixture.debugElement.query(By.css('#inside')).nativeElement;
    outsideEl = fixture.debugElement.query(By.css('#outside')).nativeElement;
  });

  it('should create an instance', () => {
    const directive = fixture.debugElement
      .query(By.directive(SbClickOutsideDirective))
      .injector.get(SbClickOutsideDirective);
    expect(directive).toBeTruthy();
  });

  it('should emit when clicking outside the element', () => {
    // Simulate click outside
    const event = new MouseEvent('click', { bubbles: true });
    Object.defineProperty(event, 'composedPath', {
      value: () => [outsideEl, document.body, document],
    });
    document.dispatchEvent(event);
    expect(hostComponent.outsideSpy).toHaveBeenCalled();
  });

  it('should not emit when clicking inside the element', () => {
    // Simulate click inside
    const event = new MouseEvent('click', { bubbles: true });
    Object.defineProperty(event, 'composedPath', {
      value: () => [insideEl, document.body, document],
    });
    document.dispatchEvent(event);
    expect(hostComponent.outsideSpy).not.toHaveBeenCalled();
  });
});
