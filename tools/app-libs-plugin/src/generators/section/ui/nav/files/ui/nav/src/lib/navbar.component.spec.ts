import { ComponentFixture, TestBed } from '@angular/core/testing';
import { <%= classNamePrefix %><%= className %>NavbarComponent } from './navbar.component';
import { RouterModule } from '@angular/router';

describe('<%= classNamePrefix %><%= className %>NavbarComponent', () => {
  let component: <%= classNamePrefix %><%= className %>NavbarComponent;
  let fixture: ComponentFixture<<%= classNamePrefix %><%= className %>NavbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [<%= classNamePrefix %><%= className %>NavbarComponent, RouterModule.forRoot([])],
    }).compileComponents();

    fixture = TestBed.createComponent(<%= classNamePrefix %><%= className %>NavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
