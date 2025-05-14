import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MainNavbarSmlComponent } from './navbar-small.component';
import { RouterModule } from '@angular/router';

describe('NavbarSmlComponent', () => {
  let component: MainNavbarSmlComponent;
  let fixture: ComponentFixture<MainNavbarSmlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MainNavbarSmlComponent, RouterModule.forRoot([])],
    }).compileComponents();

    fixture = TestBed.createComponent(MainNavbarSmlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
