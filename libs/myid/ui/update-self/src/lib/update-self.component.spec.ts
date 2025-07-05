import { ComponentRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { TwoFactorProvider } from '@spider-baby/myid-io/models';
import { MyIdPhoneFormatProvider } from '@spider-baby/myid-ui/utils';
import { RemoveNullsService } from '@spider-baby/utils-forms';
import { SbUpdateSelfFormComponent } from './update-self.component';
import { UpdateSelfFormDto } from './update-self.models';

//############################//

const mockRemoveNullsService = {
  remove: (obj: any) => obj,
};
const mockPhoneFormatProvider = {
  formatPhoneInternational: (obj: string) => obj,
};

//############################//

describe('SbUpdateSelfFormComponent', () => {
  let component: SbUpdateSelfFormComponent;
  let fixture: ComponentFixture<SbUpdateSelfFormComponent>;
  let componentRef: ComponentRef<SbUpdateSelfFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SbUpdateSelfFormComponent, ReactiveFormsModule],
      providers: [
        { provide: RemoveNullsService, useValue: mockRemoveNullsService },
        { provide: MyIdPhoneFormatProvider, useValue: mockPhoneFormatProvider },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(SbUpdateSelfFormComponent);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render an element with id for each UpdateSelfFormDto property', () => {
    const dtoKeys = Object.keys({} as UpdateSelfFormDto);
    for (const key of dtoKeys) {
      const el = fixture.debugElement.query(By.css(`#${key}`));
      expect(el).toBeTruthy();
    }
  });

  it('should render labels when showLabels it true', () => {
    const cbs = fixture.debugElement.queryAll(By.css(`sb-checkbox`));
    const checkBoxCount = cbs.length;

    componentRef.setInput('showLabels', true);
    fixture.detectChanges();
    let labels = fixture.debugElement.queryAll(By.css(`label`));
    expect(labels.length).toBeGreaterThan(checkBoxCount);

    componentRef.setInput('showLabels', false);
    fixture.detectChanges();
    labels = fixture.debugElement.queryAll(By.css(`label`));
    expect(labels.length).toBe(checkBoxCount);
  });

  it('should require email and validate format', () => {
    const emailControl = component['_form'].controls.email;
    emailControl.setValue('');
    expect(emailControl.valid).toBe(false);
    emailControl.setValue('not-an-email');
    expect(emailControl.valid).toBe(false);
    emailControl.setValue('test@example.com');
    expect(emailControl.valid).toBe(true);
  });

  it('should require TwoFactorProvider', () => {
    const twoFactorProviderControl =
      component['_form'].controls.twoFactorProvider;
    twoFactorProviderControl.setValue('' as TwoFactorProvider);
    expect(twoFactorProviderControl.valid).toBe(false);
    twoFactorProviderControl.setValue('Email' as TwoFactorProvider);
    expect(twoFactorProviderControl.valid).toBe(true);
  });

  it('should emit addMember with correct value on update', () => {
    const spy = jest.spyOn(component.updateSelf, 'emit');
    component['_form'].setValue({
      id: '123',
      firstName: 'John',
      lastName: 'Doe',
      userName: 'johndoe',
      email: 'john@example.com',
      phoneNumber: '1234567890',
      twoFactorProvider: 'Email',
      twoFactorEnabled: false,
    });
    component.update();

    expect(spy).toHaveBeenCalledWith({
      id: '123',
      firstName: 'John',
      lastName: 'Doe',
      userName: 'johndoe',
      email: 'john@example.com',
      phoneNumber: '1234567890',
      twoFactorProvider: 'Email' as TwoFactorProvider,
      twoFactorEnabled: false,
    });
  });

  it('should not emit if form is invalid', () => {
    const spy = jest.spyOn(component.updateSelf, 'emit');
    component['_form'].setValue({
      id: '',
      firstName: '',
      lastName: '',
      userName: '',
      email: '',
      phoneNumber: '',
      twoFactorProvider: '' as TwoFactorProvider,
      twoFactorEnabled: false,
    });
    component.update();
    expect(spy).not.toHaveBeenCalled();
  });
});
