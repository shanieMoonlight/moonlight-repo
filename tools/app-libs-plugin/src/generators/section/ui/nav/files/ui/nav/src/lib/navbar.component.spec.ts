import { ComponentFixture, TestBed } from '@angular/core/testing';
import { <%= sectionClassNamePrefix %>NavbarComponent } from './navbar.component';
import { RouterModule } from '@angular/router';

describe('<%= sectionClassNamePrefix %>NavbarComponent', () => {
  let component: <%= sectionClassNamePrefix %>NavbarComponent;
  let fixture: ComponentFixture<<%= sectionClassNamePrefix %>NavbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [<%= sectionClassNamePrefix %>NavbarComponent, RouterModule.forRoot([])],
    }).compileComponents();

    fixture = TestBed.createComponent(<%= sectionClassNamePrefix %>NavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
