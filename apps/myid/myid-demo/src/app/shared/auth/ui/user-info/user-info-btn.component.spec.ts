import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserInfoButtonComponent } from './user-info-btn.component';
import { MyIdAuthService } from '@spider-baby/myid-auth/services';

// Mock MyIdAuthService
class MockMyIdAuthService {
  userName = jest.fn(() => 'TestUser');
  email = jest.fn(() => 'test@example.com');
  teamType = jest.fn(() => 'admin');
  isLoggedIn = jest.fn(() => true);
}

describe('UserInfoButtonComponent', () => {
  let component: UserInfoButtonComponent;
  let fixture: ComponentFixture<UserInfoButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserInfoButtonComponent],
      providers: [
        { provide: MyIdAuthService, useClass: MockMyIdAuthService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UserInfoButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open info when openInfo is called', () => {
    (component as any).openInfo();
    expect((component as any)._showInfo()).toBe(true);
  });

  it('should close info when closeInfo is called', () => {
    (component as any)._showInfo.set(true);
    (component as any).closeInfo();
    expect((component as any)._showInfo()).toBe(false);
  });

  it('should hide user button when not logged in', () => {
    (component as any)._auth.isLoggedIn = jest.fn(() => false);
    expect((component as any)._hideUserButton()).toBe(true);
  });

  it('should show user button when logged in and info is hidden', () => {
    (component as any)._auth.isLoggedIn = jest.fn(() => true);
    (component as any)._showInfo.set(false);
    expect((component as any)._hideUserButton()).toBe(false);
  });
});
