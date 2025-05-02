import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeColorVarsComponent } from './color-vars.component';
import { ActivatedRoute, RouterModule } from '@angular/router';

describe('HomeColorVarsComponent', () => {
  let component: HomeColorVarsComponent;
  let fixture: ComponentFixture<HomeColorVarsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeColorVarsComponent, RouterModule.forRoot([])],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeColorVarsComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('sectionNumber', 'value');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
