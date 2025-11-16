import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FacebookButtonComponent } from './facebook-btn.component';

describe('FacebookButtonComponent', () => {
  let component: FacebookButtonComponent;
  let fixture: ComponentFixture<FacebookButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FacebookButtonComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FacebookButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
