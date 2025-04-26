import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CompleteColorListComponent } from './complete-color-list.component';

describe('CompleteColorListComponent', () => {
  let component: CompleteColorListComponent;
  let fixture: ComponentFixture<CompleteColorListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompleteColorListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CompleteColorListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
