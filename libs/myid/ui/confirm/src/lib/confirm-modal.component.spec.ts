import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfirmModalComponent } from './confirm-modal.component';

describe('ConfirmModalComponent', () => {
  let component: ConfirmModalComponent;
  let fixture: ComponentFixture<ConfirmModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ConfirmModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit true and close modal on confirmClick', () => {
    const spy = jest.spyOn(component.confirm, 'emit');
    component.openModal.set(true);
    (component as any).confirmClick();
    expect(component.openModal()).toBe(false);
    expect(spy).toHaveBeenCalledWith(true);
  });

  it('should emit false and close modal on cancelClick', () => {
    const spy = jest.spyOn(component.confirm, 'emit');
    component.openModal.set(true);
    (component as any).cancelClick();
    expect(component.openModal()).toBe(false);
    expect(spy).toHaveBeenCalledWith(false);
  });

  it('should close modal on dismissModal', () => {
    component.openModal.set(true);
    (component as any).dismissModal();
    expect(component.openModal()).toBe(false);
  });

  it('should have default title and closed state', () => {
    expect(component.title()).toBe('Confimation Required');
    expect(component.openModal()).toBe(false);
  });
});
