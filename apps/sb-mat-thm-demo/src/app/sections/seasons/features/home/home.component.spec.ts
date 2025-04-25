import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SeasonalHomeComponent } from './home.component';

describe('HomeComponent', () => {
  let component: SeasonalHomeComponent;
  let fixture: ComponentFixture<SeasonalHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SeasonalHomeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SeasonalHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
