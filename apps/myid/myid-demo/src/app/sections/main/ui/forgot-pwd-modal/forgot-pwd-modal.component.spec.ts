import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ForgotPwdModalComponent } from './forgot-pwd-modal.component';

describe('ForgotPwdModalComponent', () => {
  let component: ForgotPwdModalComponent;
  let fixture: ComponentFixture<ForgotPwdModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ForgotPwdModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ForgotPwdModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
