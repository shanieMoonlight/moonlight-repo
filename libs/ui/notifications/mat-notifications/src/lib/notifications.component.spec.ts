import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SbMatNotificationsModalComponent } from './notifications.component';

describe('SuccessModalComponent', () => {
  let component: SbMatNotificationsModalComponent;
  let fixture: ComponentFixture<SbMatNotificationsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SbMatNotificationsModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SbMatNotificationsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
