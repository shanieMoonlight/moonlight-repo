import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ThemeShowcaseMatComponent } from './theme-showcase-mat.component';


describe('ThemeShowcaseMatComponent', () => {
  let component: ThemeShowcaseMatComponent;
  let fixture: ComponentFixture<ThemeShowcaseMatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ThemeShowcaseMatComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ThemeShowcaseMatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
