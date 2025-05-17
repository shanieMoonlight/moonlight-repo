import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HubBlogNavbarComponent } from './navbar.component';
import { RouterModule } from '@angular/router';

describe('HubBlogNavbarComponent', () => {
  let component: HubBlogNavbarComponent;
  let fixture: ComponentFixture<HubBlogNavbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HubBlogNavbarComponent, RouterModule.forRoot([])],
    }).compileComponents();

    fixture = TestBed.createComponent(HubBlogNavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
