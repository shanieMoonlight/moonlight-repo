import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MntcTeamComponent } from './mntc-team.component';
import { MntcTeamStateService } from './mntc-team.state.service';


//######################//

const mockMntcTeamStateService: Partial<MntcTeamStateService> = {
  addMember: jest.fn(),
  updatePostion: jest.fn(),
  // Computed properties can be mocked as simple functions or values
  successMsg: signal(''),
  errorMsg: signal(''),
  loading: signal(false),
  data: signal([]),
}

//######################//
describe('MntcTeamComponent', () => {
  let component: MntcTeamComponent;
  let fixture: ComponentFixture<MntcTeamComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MntcTeamComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: MntcTeamStateService, useValue: mockMntcTeamStateService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MntcTeamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
