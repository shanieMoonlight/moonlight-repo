import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MainNavbarComponent } from './navbar.component';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconTestingModule } from '@angular/material/icon/testing';

describe('NavbarComponent', () => {
  let component: MainNavbarComponent;
  let fixture: ComponentFixture<MainNavbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MainNavbarComponent,
        MatCardModule,
        MatIconTestingModule,
        RouterModule.forRoot([]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MainNavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
