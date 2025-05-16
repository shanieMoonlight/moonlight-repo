import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MainAboutComponent } from './about.component';
import { RouterModule } from '@angular/router';

describe('MainAboutComponent', () => {
  let component: MainAboutComponent;
  let fixture: ComponentFixture<MainAboutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MainAboutComponent, RouterModule.forRoot([])],
    }).compileComponents();

    fixture = TestBed.createComponent(MainAboutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
