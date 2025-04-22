import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ThemeBannerComponent } from './theme-banner.component';

describe('ThemeBannerComponent', () => {
  let component: ThemeBannerComponent;
  let fixture: ComponentFixture<ThemeBannerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ThemeBannerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ThemeBannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
