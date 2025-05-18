import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppStructureDiagramComponent } from './app-structure-diagram.component';

describe('AppStructureDiagramComponent', () => {
  let component: AppStructureDiagramComponent;
  let fixture: ComponentFixture<AppStructureDiagramComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppStructureDiagramComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AppStructureDiagramComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
