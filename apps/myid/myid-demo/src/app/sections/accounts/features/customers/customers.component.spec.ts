import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CustomersComponent } from './customers.component';
import { CustomersStateService } from './customers.state.service';
import { fakeCustomers } from './fake-customer-data';
import { By } from '@angular/platform-browser';


//######################//

const mockCustomersStateService = {
  deleteCustomer: jest.fn(),
  successMsg: signal('Success!'),
  errorMsg: signal('Error!'),
  loading: signal(false),
  data: signal(fakeCustomers),
}

//######################//

describe('CustomersComponent', () => {
  let component: CustomersComponent;
  let fixture: ComponentFixture<CustomersComponent>;
  let stateService: CustomersStateService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomersComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        // { provide: CustomersStateService, useValue: mockCustomersStateService }
      ]
    })
  .overrideComponent(CustomersComponent, {
    set: {
      providers: [
        { provide: CustomersStateService, useValue: mockCustomersStateService }
      ]
    }
  })
    .compileComponents();

    fixture = TestBed.createComponent(CustomersComponent);
    component = fixture.componentInstance;
    stateService = fixture.debugElement.injector.get(CustomersStateService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should expose successMsg, errorMsg, loading, and data signals', () => {
    
    expect((component as any)._successMsg()).toBe('Success!');
    expect((component as any)._errorMsg()).toBe('Error!');
    expect((component as any)._loading()).toBe(false);
    expect((component as any)._data().length).toBe(fakeCustomers.length);
  });


  it('should call deleteCustomer when deleteCustomer is called - 2', () => {
    const spy = jest.spyOn(stateService, 'deleteCustomer');
    const dto = fakeCustomers[0];
    (component as any).deleteCustomer(dto as any);
    expect(spy).toHaveBeenCalledWith(dto);
  });

  it('should provide a delete message for a member with userName', () => {
    const member = fakeCustomers[0];
    const msg = (component as any)._deleteMessageFn(member as any);
    expect(msg).toContain(fakeCustomers[0].userName);
    expect(msg).toContain('This action cannot be undone.');
  });

  it('should provide a delete message for a member with only email', () => {
    const member = { email: 'bob@example.com' };
    const msg = (component as any)._deleteMessageFn(member as any);
    expect(msg).toContain('bob@example.com');
  });


  it('should expose _tableColumns', () => {
    expect((component as any)._tableColumns).toBeDefined();
  });

  it('should pass the correct values to sb-crud-table', () => {
  fixture.detectChanges();
  const crudTable = fixture.debugElement.query(By.css('sb-crud-table'));
  expect(crudTable).toBeTruthy();

  console.log('crudTable:', crudTable);
  console.log('(component as any)._tableColumns():', (component as any)._tableColumns());
  console.log('crudTable.componentInstance.tableColumns:', crudTable.componentInstance.tableColumns);
  

  // Check the input values
  expect(crudTable.componentInstance.tableColumns()).toEqual((component as any)._tableColumns());
  expect(crudTable.componentInstance.data()).toEqual((component as any)._data());
  expect(crudTable.componentInstance.loading()).toBe((component as any)._loading());
  expect(crudTable.componentInstance.errorMsg()).toBe((component as any)._errorMsg());
  expect(crudTable.componentInstance.successMsg()).toBe((component as any)._successMsg());
  expect(crudTable.componentInstance.deleteModalMessageFn()).toBe((component as any)._deleteMessageFn);
});
});
