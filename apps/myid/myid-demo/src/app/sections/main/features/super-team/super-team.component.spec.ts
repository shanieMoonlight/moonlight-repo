import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SuperTeamComponent } from './super-team.component';
import { SuperTeamStateService } from './super-team.state.service';


//######################//

const mockSuperTeamStateService: Partial<SuperTeamStateService> = {
  addMember: jest.fn(),
  updatePosition: jest.fn(),
  // Computed properties can be mocked as simple functions or values
  successMsg: signal(''),
  errorMsg: signal(''),
  loading: signal(false),
  data: signal([]),
}

//######################//
describe('SuperTeamComponent', () => {
  let component: SuperTeamComponent;
  let fixture: ComponentFixture<SuperTeamComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuperTeamComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: SuperTeamStateService, useValue: mockSuperTeamStateService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SuperTeamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
