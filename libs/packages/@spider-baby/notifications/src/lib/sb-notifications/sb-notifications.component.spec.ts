import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SbNotificationsComponent } from './sb-notifications.component';

describe('SbNotificationsComponent', () => {
  let component: SbNotificationsComponent;
  let fixture: ComponentFixture<SbNotificationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SbNotificationsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SbNotificationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
