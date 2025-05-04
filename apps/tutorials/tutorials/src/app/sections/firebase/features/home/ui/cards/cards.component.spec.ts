import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CardsComponent } from './cards.component';
import { RouterModule } from '@angular/router';

describe('CardsComponent', () => {
  let component: CardsComponent;
  let fixture: ComponentFixture<CardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardsComponent, RouterModule.forRoot([])],
    }).compileComponents();

    fixture = TestBed.createComponent(CardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
