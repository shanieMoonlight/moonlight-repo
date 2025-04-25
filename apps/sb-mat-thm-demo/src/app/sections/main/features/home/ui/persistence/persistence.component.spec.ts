import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PersistenceComponent } from './persistence.component';

describe('PersistenceComponent', () => {
  let component: PersistenceComponent;
  let fixture: ComponentFixture<PersistenceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PersistenceComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PersistenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
