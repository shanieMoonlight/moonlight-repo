import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MainDemoSimpleComponent } from './simple.component';

describe('SimpleComponent', () => {
  let component: MainDemoSimpleComponent;
  let fixture: ComponentFixture<MainDemoSimpleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MainDemoSimpleComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MainDemoSimpleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
