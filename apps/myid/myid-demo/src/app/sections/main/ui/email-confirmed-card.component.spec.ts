import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EmailConfirmedCardComponent } from './email-confirmed-card.component';

describe('EmailConfirmedCardComponent', () => {
  let component: EmailConfirmedCardComponent;
  let fixture: ComponentFixture<EmailConfirmedCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmailConfirmedCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EmailConfirmedCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
