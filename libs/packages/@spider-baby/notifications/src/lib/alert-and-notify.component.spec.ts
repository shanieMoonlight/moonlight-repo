import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GgWbNotificationsComponent } from './alert-and-notify.component';

describe('GgWbNotificationsComponent', () => {
  let component: GgWbNotificationsComponent;
  let fixture: ComponentFixture<GgWbNotificationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GgWbNotificationsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GgWbNotificationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
