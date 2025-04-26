import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ApiNavbarComponent } from './navbar.component';

describe('NavbarComponent', () => {
  let component: ApiNavbarComponent;
  let fixture: ComponentFixture<ApiNavbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApiNavbarComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ApiNavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
