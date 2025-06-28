import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Update2FactorComponent } from './update-2-factor.component';

describe('Update2FactorComponent', () => {
  let component: Update2FactorComponent;
  let fixture: ComponentFixture<Update2FactorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Update2FactorComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(Update2FactorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
