import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HubMainNavbarComponent } from './navbar.component';
import { RouterModule } from '@angular/router';

describe('HubMainNavbarComponent', () => {
  let component: HubMainNavbarComponent;
  let fixture: ComponentFixture<HubMainNavbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HubMainNavbarComponent, RouterModule.forRoot([])],
    }).compileComponents();

    fixture = TestBed.createComponent(HubMainNavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
