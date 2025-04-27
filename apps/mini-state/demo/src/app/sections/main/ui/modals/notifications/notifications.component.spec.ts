import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NotificationsModalComponent } from './notifications.component';

describe('SuccessModalComponent', () => {
  let component: NotificationsModalComponent;
  let fixture: ComponentFixture<NotificationsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotificationsModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NotificationsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
