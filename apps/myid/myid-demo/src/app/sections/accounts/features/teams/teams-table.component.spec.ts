import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentRef, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ActivatedRoute, ParamMap, convertToParamMap } from '@angular/router';
import { TeamDto } from '@spider-baby/myid-io/models';
import { SbAddTeamFormComponent, SbUpdateTeamFormComponent } from '@spider-baby/myid-ui/team';
import { ColumnData } from '@spider-baby/ui-kit/table';
import { BehaviorSubject, Subject, of } from 'rxjs';
import { CrudTableComponent } from '../../ui/crud-table/crud-table.component';
import { TeamsTableColumnsService } from './data-table-columns';
import { TeamsTableComponent } from './teams-table.component';
import { TeamsTableStateService } from './teams-table.state.service';

const paramMapSubject: Subject<ParamMap> = new BehaviorSubject<ParamMap>(convertToParamMap({}));
const mockActivatedRoute: Partial<ActivatedRoute> = {
    paramMap: paramMapSubject.asObservable(),
    data: of({ get: () => null })
};

// Mock services and components
const mockState = {
    successMsg: signal('Success!'),
    errorMsg: signal('Error!'),
    loading: signal(false),
    data: signal([]),
    canUpdateTeam: signal(true),
    canUpdateTeamFn: jest.fn().mockReturnValue(true),
    canUpdateTeamPositionRangefn: jest.fn().mockReturnValue(true),
    canUpdateTeamLeaderfn: jest.fn().mockReturnValue(true),
    addTeam: jest.fn(),
    updateTeam: jest.fn(),
    deleteTeam: jest.fn(),
}
const mockColumnsService: Partial<TeamsTableColumnsService> = {
    tableColumns: signal([
        ColumnData.create<TeamDto>('name'),
        ColumnData.create<TeamDto>('teamType'),
        ColumnData.create<TeamDto>('minPosition'),
        ColumnData.create<TeamDto>('maxPosition')
    ]),
};
describe('TeamsTableComponent', () => {
    let component: TeamsTableComponent;
    let fixture: ComponentFixture<TeamsTableComponent>;
    let componentRef: ComponentRef<TeamsTableComponent>;
    let stateService: TeamsTableStateService;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                TeamsTableComponent,
                SbAddTeamFormComponent, SbUpdateTeamFormComponent,
                CrudTableComponent
            ],
            providers: [
                provideHttpClient(),
                provideHttpClientTesting(),
                { provide: ActivatedRoute, useValue: mockActivatedRoute },
                { provide: TeamsTableColumnsService, useValue: mockColumnsService },
            ]
        })
            .overrideComponent(TeamsTableComponent, {
                set: {
                    providers: [
                        { provide: TeamsTableStateService, useValue: mockState }
                    ]
                }
            })
            .compileComponents();

        fixture = TestBed.createComponent(TeamsTableComponent);
        component = fixture.componentInstance;
        componentRef = fixture.componentRef;
        stateService = fixture.debugElement.injector.get(TeamsTableStateService);
        // console.log('stateService:', stateService);

        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should call addTeam on addTeam()', () => {
        const spy = jest.spyOn((component as any)._state, 'addTeam');
        const dto = { name: 'Test Team' };
        component.addTeam(dto as any);
        expect(spy).toHaveBeenCalledWith(dto);
    });

    it('should call updateTeam on updateTeam()', () => {
        const spy = jest.spyOn((component as any)._state, 'updateTeam');
        const dto = { id: '1', name: 'Updated Team' };
        component.updateTeam(dto as any);
        expect(spy).toHaveBeenCalledWith(dto);
    });

    it('should call deleteTeam on deleteTeam()', () => {
        const spy = jest.spyOn((component as any)._state, 'deleteTeam');
        const dto = { id: '1', name: 'Delete Team' };
        component.deleteTeam(dto as any);
        expect(spy).toHaveBeenCalledWith(dto);
    });

    it('should provide correct delete message', () => {
        const team = { name: 'Alpha' };
        const msg = (component as any)._deleteMessageFn(team);
        expect(msg).toContain('Alpha');
        expect(msg).toContain('This action cannot be undone');
    });

    it('should expose signals for template', () => {
        expect((component as any)._successMsg()).toBe('Success!');
        expect((component as any)._errorMsg()).toBe('Error!');
        expect((component as any)._loading()).toBe(false);
        expect(Array.isArray((component as any)._data())).toBe(true);
    });

    it('should pass _data() to sb-crud-table [data] input', () => {
        (component as any)._data.set([{ name: 'Test Team' }]);
        fixture.detectChanges();
        const crudTable = fixture.debugElement.query(By.css('sb-crud-table'));
        expect(crudTable.componentInstance.data()).toEqual([{ name: 'Test Team' }]);
    });

    it('should pass _loading() to sb-crud-table [loading] input', () => {
        (component as any)._loading.set(true);
        fixture.detectChanges();
        const crudTable = fixture.debugElement.query(By.css('sb-crud-table'));
        expect(crudTable.componentInstance.loading()).toBe(true);
    });

    it('should pass _errorMsg() to sb-crud-table [errorMsg] input', () => {
        (component as any)._errorMsg.set('Some error');
        fixture.detectChanges();
        const crudTable = fixture.debugElement.query(By.css('sb-crud-table'));
        expect(crudTable.componentInstance.errorMsg()).toBe('Some error');
    });

    it('should pass _successMsg() to sb-crud-table [successMsg] input', () => {
        (component as any)._successMsg.set('Success!');
        fixture.detectChanges();
        const crudTable = fixture.debugElement.query(By.css('sb-crud-table'));
        expect(crudTable.componentInstance.successMsg()).toBe('Success!');
    });

    it('should pass _tableColumns() to sb-crud-table [tableColumns] input', () => {
        const columns = [
            { key: 'name' },
            { key: 'teamType' }
        ];
        (component as any)._tableColumns.set(columns);
        fixture.detectChanges();
        const crudTable = fixture.debugElement.query(By.css('sb-crud-table'));
        expect(crudTable.componentInstance.tableColumns()).toBe(columns);
    });

    it('should call deleteTeam when sb-crud-table emits deleteItem', () => {
        const spy = jest.spyOn(component, 'deleteTeam');
        const crudTable = fixture.debugElement.query(By.css('sb-crud-table'));
        crudTable.triggerEventHandler('deleteItem', { id: 1 });
        expect(spy).toHaveBeenCalledWith({ id: 1 });
    });
});
