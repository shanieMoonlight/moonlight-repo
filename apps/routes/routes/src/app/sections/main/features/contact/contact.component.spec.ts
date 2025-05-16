import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MainContactComponent } from './contact.component';
import { RouterModule } from '@angular/router';

describe('MainContactComponent', () => {
  let component: MainContactComponent;
  let fixture: ComponentFixture<MainContactComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MainContactComponent, RouterModule.forRoot([])],
    }).compileComponents();

    fixture = TestBed.createComponent(MainContactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
