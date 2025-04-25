import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SectionedThemesComponent } from './sectioned-themes.component';

describe('SectionedThemesComponent', () => {
  let component: SectionedThemesComponent;
  let fixture: ComponentFixture<SectionedThemesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SectionedThemesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SectionedThemesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
