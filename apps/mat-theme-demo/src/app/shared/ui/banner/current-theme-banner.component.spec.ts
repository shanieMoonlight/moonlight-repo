import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CurrentThemeBannerComponent } from './current-theme-banner.component';

describe('ThemeBannerComponent', () => {
  let component: CurrentThemeBannerComponent;
  let fixture: ComponentFixture<CurrentThemeBannerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CurrentThemeBannerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CurrentThemeBannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
