import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SeasonalNavbarComponent } from './navbar.component';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { RouterModule } from '@angular/router';

describe('SeasonalNavbarComponent', () => {
  let component: SeasonalNavbarComponent;
  let fixture: ComponentFixture<SeasonalNavbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        SeasonalNavbarComponent,
        MatIconTestingModule,
        RouterModule.forRoot([]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SeasonalNavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
