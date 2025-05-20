import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FirebaseDeployComponent } from './deploy.component';

describe('FirebaseDeployComponent', () => {
  let component: FirebaseDeployComponent;
  let fixture: ComponentFixture<FirebaseDeployComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FirebaseDeployComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FirebaseDeployComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
