import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SpiderBabyMyidAuthComponent } from './spider-baby-myid-auth.component';

describe('SpiderBabyMyidAuthComponent', () => {
  let component: SpiderBabyMyidAuthComponent;
  let fixture: ComponentFixture<SpiderBabyMyidAuthComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpiderBabyMyidAuthComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SpiderBabyMyidAuthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
