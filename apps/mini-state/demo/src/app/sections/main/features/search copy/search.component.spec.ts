import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MainDemoSearchComponent } from './search.component';

describe('SimpleComponent', () => {
  let component: MainDemoSearchComponent;
  let fixture: ComponentFixture<MainDemoSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MainDemoSearchComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MainDemoSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
