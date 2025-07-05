import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SuperTeamComponent } from './super-team.component';
import { SuperTeamStateService } from './super-team.state.service';
import { fakeSuperTeam } from './fake-super-data';
import { mock } from 'node:test';


//######################//

const mockSuperTeamStateService: Partial<SuperTeamStateService> = {
  addMember: jest.fn(),
  updatePosition: jest.fn(),
  // Computed properties can be mocked as simple functions or values
  successMsg: signal('Success!!!'),
  errorMsg: signal('Something went wrong;('),
  loading: signal(false),
  data: signal(fakeSuperTeam),
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
        // { provide: SuperTeamStateService, useValue: mockSuperTeamStateService }
      ]
    })
    .overrideComponent(SuperTeamComponent, {
      set: {
        providers: [
          { provide: SuperTeamStateService, useValue: mockSuperTeamStateService }
        ]
      }
    })
    .compileComponents();

    fixture = TestBed.createComponent(SuperTeamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should expose successMsg, errorMsg, loading, and data signals', () => {
    expect((component as any)._successMsg()).toBe(mockSuperTeamStateService.successMsg?.());
    expect((component as any)._errorMsg()).toBe(mockSuperTeamStateService.errorMsg?.());
    expect((component as any)._loading()).toBe(mockSuperTeamStateService.loading?.());
    expect((component as any)._data()).toEqual(mockSuperTeamStateService.data?.());
  });

  it('should expose _tableColumns', () => {
    expect((component as any)._tableColumns).toBeDefined();
  });

  it('should pass the correct values to CrudTableComponent', () => {
    fixture.detectChanges();
    const crudTable = fixture.debugElement.query((el: any) => el.name === 'sb-crud-table' || el.name === 'crud-table');
    expect(crudTable).toBeTruthy();
    // Check the input values (all are signals, so call them on both sides)
    expect(crudTable.componentInstance.tableColumns()).toEqual((component as any)._tableColumns);
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

  it('should call addMember when addMember is called', () => {
    const spy = jest.spyOn((component as any)._state, 'addMember');
    const dto = { userName: 'Test' };
    (component as any).addMember(dto);
    expect(spy).toHaveBeenCalledWith(dto);
  });

  it('should call updatePosition when updatePosition is called', () => {
    const spy = jest.spyOn((component as any)._state, 'updatePosition');
    const dto = { userName: 'Test' };
    (component as any).updatePosition(dto);
    expect(spy).toHaveBeenCalledWith(dto);
  });

  it('should call deleteMember when deleteMember is called', () => {
    // Add deleteMember to the mock if not present
    if (!(mockSuperTeamStateService as any).deleteMember) {
      (mockSuperTeamStateService as any).deleteMember = jest.fn();
    }
    const spy = jest.spyOn((component as any)._state, 'deleteMember');
    const dto = { userName: 'Test' };
    (component as any).deleteMember(dto);
    expect(spy).toHaveBeenCalledWith(dto);
  });
});
