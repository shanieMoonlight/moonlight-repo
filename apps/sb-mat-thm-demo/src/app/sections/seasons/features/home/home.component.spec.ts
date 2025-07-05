import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SeasonalHomeComponent } from './home.component';
import { RouterModule } from '@angular/router';

describe('HomeComponent', () => {
  let component: SeasonalHomeComponent;
  let fixture: ComponentFixture<SeasonalHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SeasonalHomeComponent, RouterModule.forRoot([])],
    }).compileComponents();

    fixture = TestBed.createComponent(SeasonalHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
