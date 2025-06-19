import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfirmEmailWithPwdComponent } from './confirm-email-with-pwd.component';

describe('ConfirmEmailWithPwdComponent', () => {
  let component: ConfirmEmailWithPwdComponent;
  let fixture: ComponentFixture<ConfirmEmailWithPwdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmEmailWithPwdComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ConfirmEmailWithPwdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
