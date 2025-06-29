import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MntcTeamComponent } from './mntc-team.component';

describe('MntcTeamComponent', () => {
  let component: MntcTeamComponent;
  let fixture: ComponentFixture<MntcTeamComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MntcTeamComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MntcTeamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
