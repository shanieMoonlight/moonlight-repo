import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MntcTeamComponent } from './mntc-team.component';
import { MntcTeamStateService } from './mntc-team.state.service';
import { fakeMntcTeam } from './fake-mntc-data';
import { MntcTeamTableColumnsService } from './data-table-columns';
import { ColumnData } from '@spider-baby/ui-kit/table';
import { AppUserDto } from '@spider-baby/myid-io/models';


//######################//

const mockMntcTeamStateService: Partial<MntcTeamStateService> = {
  addMember: jest.fn(),
  updatePosition: jest.fn(),
  successMsg: signal('Success!'),
  errorMsg: signal('Error!'),
  loading: signal(false),
  data: signal(fakeMntcTeam),
  canUpdateMember: signal(true),
};

const mockMntcTeamTableColumnsService: Partial<MntcTeamTableColumnsService> = {
  tableColumns: signal([ 
    ColumnData.create<AppUserDto>('userName'),
    ColumnData.create<AppUserDto>('email'),
  ]),
};

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
      ]
    })
    .overrideComponent(MntcTeamComponent, {
      set: {
        providers: [
          { provide: MntcTeamStateService, useValue: mockMntcTeamStateService },
          { provide: MntcTeamTableColumnsService, useValue: mockMntcTeamTableColumnsService },
        ]
      }
    })
    .compileComponents();

    fixture = TestBed.createComponent(MntcTeamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should expose successMsg, errorMsg, loading, data, and canUpdateMember signals', () => {
    expect((component as any)._successMsg()).toBe(mockMntcTeamStateService.successMsg?.());
    expect((component as any)._errorMsg()).toBe(mockMntcTeamStateService.errorMsg?.());
    expect((component as any)._loading()).toBe(mockMntcTeamStateService.loading?.());
    expect((component as any)._data()).toEqual(mockMntcTeamStateService.data?.());
    expect((component as any)._canUpdateMember()).toBe(mockMntcTeamStateService.canUpdateMember?.());
  });

  it('should expose _tableColumns', () => {
    expect((component as any)._tableColumns).toBeDefined();
  });

  it('should pass the correct values to CrudTableComponent', () => {
    fixture.detectChanges();
    const crudTable = fixture.debugElement.query((el: any) => el.name === 'sb-crud-table' || el.name === 'crud-table');
    expect(crudTable).toBeTruthy();
    expect(crudTable.componentInstance.tableColumns()).toEqual((component as any)._tableColumns());
    expect(crudTable.componentInstance.data()).toEqual((component as any)._data());
    expect(crudTable.componentInstance.loading()).toBe((component as any)._loading());
    expect(crudTable.componentInstance.errorMsg()).toBe((component as any)._errorMsg());
    expect(crudTable.componentInstance.successMsg()).toBe((component as any)._successMsg());
    expect(crudTable.componentInstance.deleteModalMessageFn()).toBe((component as any)._deleteMessageFn);
  });

  it('should provide a delete message for a member with userName', () => {
    const member = { userName: 'Alice', email: 'alice@example.com' };
    const msg = (component as any)._deleteMessageFn(member);
    expect(msg).toContain('Alice');
    expect(msg).toContain('This action cannot be undone.');
  });

  it('should provide a delete message for a member with only email', () => {
    const member = { email: 'bob@example.com' };
    const msg = (component as any)._deleteMessageFn(member);
    expect(msg).toContain('bob@example.com');
  });

  it('should call addMntcMember when addMntcMember is called', () => {
    const spy = jest.spyOn((component as any)._state, 'addMember');
    const dto = { userName: 'Test' };
    (component as any).addMntcMember(dto);
    expect(spy).toHaveBeenCalledWith(dto);
  });

  it('should call updatePosition when updatePosition is called', () => {
    const spy = jest.spyOn((component as any)._state, 'updatePosition');
    const dto = { userName: 'Test' };
    (component as any).updatePosition(dto);
    expect(spy).toHaveBeenCalledWith(dto);
  });

  it('should call deleteMember when deleteMember is called', () => {
    if (!(mockMntcTeamStateService as any).deleteMember) {
      (mockMntcTeamStateService as any).deleteMember = jest.fn();
    }
    const spy = jest.spyOn((component as any)._state, 'deleteMember');
    const dto = { userName: 'Test' };
    (component as any).deleteMember(dto);
    expect(spy).toHaveBeenCalledWith(dto);
  });
});
