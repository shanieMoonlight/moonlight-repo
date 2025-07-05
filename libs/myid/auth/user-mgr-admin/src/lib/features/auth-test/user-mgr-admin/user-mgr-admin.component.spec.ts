import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AuthServiceUserMgrAdminComponent } from './user-mgr-admin.component';

describe('AuthServiceUserMgrAdminComponent', () => {
  let component: AuthServiceUserMgrAdminComponent;
  let fixture: ComponentFixture<AuthServiceUserMgrAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthServiceUserMgrAdminComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AuthServiceUserMgrAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
