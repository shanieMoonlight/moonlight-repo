import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ApiHomeComponent } from './home.component';
import { RouterModule } from '@angular/router';

describe('ApiHomeComponent', () => {
  let component: ApiHomeComponent;
  let fixture: ComponentFixture<ApiHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApiHomeComponent, RouterModule.forRoot([])],
    }).compileComponents();

    fixture = TestBed.createComponent(ApiHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
