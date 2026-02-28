import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ScratchPadHomePage } from './home';

describe('Home', () => {
  let component: ScratchPadHomePage;
  let fixture: ComponentFixture<ScratchPadHomePage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScratchPadHomePage],
    }).compileComponents();

    fixture = TestBed.createComponent(ScratchPadHomePage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
