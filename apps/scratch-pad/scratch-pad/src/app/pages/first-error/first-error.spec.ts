import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FirstErrorPage } from './first-error';

describe('FirstError', () => {
  let component: FirstErrorPage;
  let fixture: ComponentFixture<FirstErrorPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FirstErrorPage],
    }).compileComponents();

    fixture = TestBed.createComponent(FirstErrorPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
