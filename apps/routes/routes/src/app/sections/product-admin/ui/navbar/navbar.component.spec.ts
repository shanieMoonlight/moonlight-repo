import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProdAdminNavbarComponent } from './navbar.component';
import { RouterModule } from '@angular/router';

describe('MainNavbarComponent', () => {
  let component: ProdAdminNavbarComponent;
  let fixture: ComponentFixture<ProdAdminNavbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProdAdminNavbarComponent, RouterModule.forRoot([])],
    }).compileComponents();

    fixture = TestBed.createComponent(ProdAdminNavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
