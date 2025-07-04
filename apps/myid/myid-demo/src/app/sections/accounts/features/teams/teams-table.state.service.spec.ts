import { TestBed } from '@angular/core/testing';
import { TeamsTableStateService } from './teams-table.state.service';
import { TeamsIoService } from '@spider-baby/myid-io';
import { MyIdAuthService } from '../../../../shared/id/auth/services/auth/myid-auth.browser.service';
import { AddTeamDto, TeamDto } from '@spider-baby/myid-io/models';
import { CrudArraySignalOps } from '../../../../shared/utils/crud-array-ops/crud-array-ops.signal';
import { of } from 'rxjs';

// Use jest.fn() for all mocks
const mockCrudOps = {
  refresh: jest.fn(),
  append: jest.fn(),
  insert: jest.fn(),
  delete: jest.fn(),
  data: jest.fn().mockReturnValue([])
};

const mockIoService = {
  getAll: jest.fn().mockReturnValue(of([])), // <-- must return observable!
  add: jest.fn().mockReturnValue(of({})),
  edit: jest.fn().mockReturnValue(of({})),
  deleteById: jest.fn().mockReturnValue(of({}))
};

const mockAuth = {
  isMntcMinimum: jest.fn().mockReturnValue(true),
  isMntcPositionMinimum: jest.fn().mockReturnValue(() => true),
  isSuperPositionMinimum: jest.fn().mockReturnValue(() => true),
  isSuperLdr: jest.fn().mockReturnValue(true),
  isMntcLdr: jest.fn().mockReturnValue(true),
  teamType: jest.fn().mockReturnValue('customer'),
  isLdr: jest.fn().mockReturnValue(true)
};

describe('TeamsTableStateService', () => {
  let service: TeamsTableStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        TeamsTableStateService,
        { provide: TeamsIoService, useValue: mockIoService },
        { provide: MyIdAuthService, useValue: mockAuth },
        { provide: CrudArraySignalOps, useValue: mockCrudOps }
      ]
    });
    service = TestBed.inject(TeamsTableStateService);
    // jest.clearAllMocks();
  });
  
  afterEach(() => {
    jest.clearAllMocks(); // <-- clear after each test, not before
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call getAll and refresh data on init', () => {
    expect(mockIoService.getAll).toHaveBeenCalled();
    // refresh is called in setOnSuccessFn, but only if getAll resolves, so you may need to simulate a response in a real test
  });

  it('should call add on addTeam', () => {
    const dto: AddTeamDto = { name: 'Test' } as any;
    service.addTeam(dto);
    expect(mockIoService.add).toHaveBeenCalledWith(dto);
  });

  it('should call edit on updateTeam', () => {
    const dto: TeamDto = { id: '1', name: 'Test' } as any;
    service.updateTeam(dto);
    expect(mockIoService.edit).toHaveBeenCalledWith(dto);
  });

  it('should call deleteById on deleteTeam', () => {
    const dto: TeamDto = { id: '1', name: 'Test' } as any;
    service.deleteTeam(dto);
    expect(mockIoService.deleteById).toHaveBeenCalledWith('1');
  });

  it('canUpdateTeam should return computed value', () => {
    expect(service.canUpdateTeam()).toBe(true);
  });

  it('canUpdateTeamFn should call correct auth method for customer', () => {
    const team: TeamDto = { teamType: 'customer' } as any;
    expect(service.canUpdateTeamFn(team)).toBe(true);
    expect(mockAuth.isMntcPositionMinimum).toHaveBeenCalledWith(2);
  });

  it('canUpdateTeamFn should call correct auth method for maintenance', () => {
    const team: TeamDto = { teamType: 'maintenance' } as any;
    expect(service.canUpdateTeamFn(team)).toBe(true);
    expect(mockAuth.isSuperPositionMinimum).toHaveBeenCalledWith(2);
  });

  it('canUpdateTeamFn should call correct auth method for other', () => {
    const team: TeamDto = { teamType: 'other' } as any;
    expect(service.canUpdateTeamFn(team)).toBe(true);
    expect(mockAuth.isSuperLdr).toHaveBeenCalled();
  });

  it('canUpdateTeamPositionRangefn should call correct auth method for customer', () => {
    const team: TeamDto = { teamType: 'customer' } as any;
    expect(service.canUpdateTeamPositionRangefn(team)).toBe(true);
    expect(mockAuth.isMntcPositionMinimum).toHaveBeenCalledWith(2);
  });

  it('canUpdateTeamPositionRangefn should call correct auth method for maintenance', () => {
    const team: TeamDto = { teamType: 'maintenance' } as any;
    expect(service.canUpdateTeamPositionRangefn(team)).toBe(true);
    expect(mockAuth.isMntcLdr).toHaveBeenCalled();
  });

  it('canUpdateTeamPositionRangefn should call correct auth method for other', () => {
    const team: TeamDto = { teamType: 'other' } as any;
    expect(service.canUpdateTeamPositionRangefn(team)).toBe(true);
    expect(mockAuth.isSuperLdr).toHaveBeenCalled();
  });

  it('canUpdateTeamLeaderfn should return true if teamType matches and isLdr is true', () => {
    mockAuth.teamType.mockReturnValue('customer');
    mockAuth.isLdr.mockReturnValue(true);
    const team: TeamDto = { teamType: 'customer' } as any;
    expect(service.canUpdateTeamLeaderfn(team)).toBe(true);
  });

  it('canUpdateTeamLeaderfn should return false if teamType does not match', () => {
    mockAuth.teamType.mockReturnValue('maintenance');
    const team: TeamDto = { teamType: 'customer' } as any;
    expect(service.canUpdateTeamLeaderfn(team)).toBe(false);
  });
});
