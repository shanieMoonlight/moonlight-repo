import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SbMatLoaderModalComponent } from './loader.component';

describe('SbMatLoaderModalComponent', () => {
  let component: SbMatLoaderModalComponent;
  let fixture: ComponentFixture<SbMatLoaderModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SbMatLoaderModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SbMatLoaderModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
