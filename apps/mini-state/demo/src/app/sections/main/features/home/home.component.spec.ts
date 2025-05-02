import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MainHomeComponent } from './home.component';
import { RouterModule } from '@angular/router';

describe('MainHomeComponent', () => {
  let component: MainHomeComponent;
  let fixture: ComponentFixture<MainHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MainHomeComponent, RouterModule.forRoot([])],
    }).compileComponents();

    fixture = TestBed.createComponent(MainHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
