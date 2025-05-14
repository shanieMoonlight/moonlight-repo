import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MainNavbarLargeComponent } from './navbar-large.component';
import { RouterModule } from '@angular/router';

describe('NavbarSmlComponent', () => {
  let component: MainNavbarLargeComponent;
  let fixture: ComponentFixture<MainNavbarLargeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MainNavbarLargeComponent, RouterModule.forRoot([])],
    }).compileComponents();

    fixture = TestBed.createComponent(MainNavbarLargeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
