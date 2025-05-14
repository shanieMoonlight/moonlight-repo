import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MainProductsComponent } from './products.component';

describe('ProductsComponent', () => {
  let component: MainProductsComponent;
  let fixture: ComponentFixture<MainProductsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MainProductsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MainProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
