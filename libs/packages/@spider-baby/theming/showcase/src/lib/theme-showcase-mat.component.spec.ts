import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SbThemeShowcaseMatComponent } from './theme-showcase-mat.component';


describe('ThemeShowcaseMatComponent', () => {
  let component: SbThemeShowcaseMatComponent;
  let fixture: ComponentFixture<SbThemeShowcaseMatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SbThemeShowcaseMatComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SbThemeShowcaseMatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
