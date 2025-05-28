import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SbToastComponent } from './toast.component';

describe('ToastComponent', () => {
  let component: SbToastComponent;
  let fixture: ComponentFixture<SbToastComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [SbToastComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SbToastComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
