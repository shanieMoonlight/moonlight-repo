import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouteArchitectureComponent } from './route-architecture.component';

describe('RouteArchitectureComponent', () => {
  let component: RouteArchitectureComponent;
  let fixture: ComponentFixture<RouteArchitectureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouteArchitectureComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RouteArchitectureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
