import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeGettingStartedComponent } from './getting-started.component';

describe('GettingStartedComponent', () => {
  let component: HomeGettingStartedComponent;
  let fixture: ComponentFixture<HomeGettingStartedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeGettingStartedComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeGettingStartedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
