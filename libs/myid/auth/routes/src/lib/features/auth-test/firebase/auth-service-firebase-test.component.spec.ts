import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AuthServiceFirebaseTestComponent } from './auth-service-firebase-test.component';

describe('AuthServiceFirebaseTestComponent', () => {
  let component: AuthServiceFirebaseTestComponent;
  let fixture: ComponentFixture<AuthServiceFirebaseTestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthServiceFirebaseTestComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AuthServiceFirebaseTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
