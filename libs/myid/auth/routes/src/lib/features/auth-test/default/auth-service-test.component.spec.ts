import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AuthServiceTestComponent } from './auth-service-test.component';

describe('AuthServiceTestComponent', () => {
  let component: AuthServiceTestComponent;
  let fixture: ComponentFixture<AuthServiceTestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthServiceTestComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AuthServiceTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
