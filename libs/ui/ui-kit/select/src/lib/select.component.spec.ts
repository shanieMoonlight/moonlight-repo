import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { SbSelectComponent, SelectOption } from './select.component';

@Component({
  template: `
    <sb-select [options]="options" [placeholder]="placeholder"></sb-select>
  `,
  standalone: true,
  imports: [SbSelectComponent]
})
class TestHostComponent {
  options: SelectOption[] = [
    { value: 'a', label: 'Option A' },
    { value: 'b', label: 'Option B', disabled: true },
    { value: 'c', label: 'Option C' }
  ];
  placeholder = 'Choose...';
}

describe('SbSelectComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let host: TestHostComponent;
  let selectDebugEl: any;
  let selectInstance: SbSelectComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent]
    }).compileComponents();
    fixture = TestBed.createComponent(TestHostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();
    selectDebugEl = fixture.debugElement.query(By.directive(SbSelectComponent));
    selectInstance = selectDebugEl.componentInstance;
  });

  it('should create', () => {
    expect(selectInstance).toBeTruthy();
  });

  it('should display the placeholder when no value is selected', () => {
    const selectedEl = fixture.debugElement.query(By.css('.sb-select-selected'));
    expect(selectedEl.nativeElement.textContent).toContain('Choose...');
  });

  it('should open and close the dropdown', () => {
    expect((selectInstance as any)._isOpen).toBe(false);
    (selectInstance as any).toggleDropdown();
    expect((selectInstance as any)._isOpen).toBe(true);
    (selectInstance as any).toggleDropdown();
    expect((selectInstance as any)._isOpen).toBe(false);
  });

  it('should select an option and close the dropdown', () => {
    (selectInstance as any).toggleDropdown();
    fixture.detectChanges();
    const option = host.options[0];
    (selectInstance as any).selectOption(option);
    expect((selectInstance as any)._selectedOption()).toEqual(option);
    expect((selectInstance as any)._isOpen).toBe(false);
    expect((selectInstance as any)._value()).toBe(option.value);
  });

  it('should not select a disabled option', () => {
    (selectInstance as any).toggleDropdown();
    fixture.detectChanges();
    const option = host.options[1]; // disabled
    console.log('Before Attempting to select _selectedOption:', (selectInstance as any)._selectedOption());
    console.log('Attempting to select disabled option:', option);
    
    (selectInstance as any).selectOption(option);
    console.log('AFTER Attempting to select _selectedOption:', (selectInstance as any)._selectedOption());
    expect((selectInstance as any)._selectedOption()).not.toEqual(option);
    expect((selectInstance as any)._value()).not.toBe(option.value);
  });

  it('should close the dropdown on outside click', () => {
    (selectInstance as any)._isOpen = true;
    selectInstance.onOutsideClick();
    expect((selectInstance as any)._isOpen).toBe(false);
  });

  it('should write value and update selected option', () => {
    selectInstance.writeValue('c');
    expect((selectInstance as any)._selectedOption()).toEqual(host.options[2]);
    expect((selectInstance as any)._value()).toBe('c');
  });

  it('should set disabled state', () => {
    selectInstance.setDisabledState(true);
    expect((selectInstance as any)._disabled()).toBe(true);
    selectInstance.setDisabledState(false);
    expect((selectInstance as any)._disabled()).toBe(false);
  });
});
