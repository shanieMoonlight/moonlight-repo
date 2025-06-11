import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ApiNavbarComponent } from './navbar.component';
import { RouterModule } from '@angular/router';

describe('ApiNavbarComponent', () => {
  let component: ApiNavbarComponent;
  let fixture: ComponentFixture<ApiNavbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApiNavbarComponent, RouterModule.forRoot([])],
    }).compileComponents();

    fixture = TestBed.createComponent(ApiNavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
