/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { FirstErrorComponent, FirstErrorDirective } from '@spider-baby/utils-forms';
import { SbButtonComponent } from '@spider-baby/ui-kit/buttons';
import { SbSelectComponent } from '@spider-baby/ui-kit/select';
import { SbUpdateTwoFactorProviderFormComponent } from './update-two-factor-provider.component';
import { ComponentRef } from '@angular/core';

//##########################//

interface TwoFactorOption {
  value: string,
  label: string
}


const twoFactorProviderOptions: TwoFactorOption[] = [
  { value: 'AuthenticatorApp', label: 'Authenticator App' },
  { value: 'Sms', label: 'SMS' },
  { value: 'Email', label: 'Email' }
]

//##########################//


describe('SbUpdateTwoFactorProviderFormComponent', () => {
  let component: SbUpdateTwoFactorProviderFormComponent;
  let fixture: ComponentFixture<SbUpdateTwoFactorProviderFormComponent>;
  let componentRef: ComponentRef<SbUpdateTwoFactorProviderFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        SbUpdateTwoFactorProviderFormComponent,
        ReactiveFormsModule,
        FirstErrorComponent,
        FirstErrorDirective,
        SbButtonComponent,
        SbSelectComponent,
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(SbUpdateTwoFactorProviderFormComponent);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;
    componentRef.setInput('twoFactorProviderOptions', twoFactorProviderOptions);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    componentRef.setInput('twoFactorProviderOptions', twoFactorProviderOptions);
  });

  it('should initialize with default provider value', () => {
    expect(component['\u005fform'].controls.provider.value).toBe('Email');
  });

  it('should update provider when currentProvider is set', () => {
    component.currentProvider = 'Sms';
    expect(component['\u005fform'].controls.provider.value).toBe('Sms');
  });

  it('should be invalid if provider is not set', () => {
    component['\u005fform'].controls.provider.setValue(null!);
    expect(component['\u005fform'].valid).toBeFalsy();
  });

  it('should be valid with a valid provider', () => {
    component['\u005fform'].controls.provider.setValue('AuthenticatorApp');
    expect(component['\u005fform'].valid).toBeTruthy();
  });

  it('should emit updateProvider with correct dto on submit when valid', () => {
    const emitSpy = jest.spyOn(component.updateProvider, 'emit');
    component['\u005fform'].controls.provider.setValue('Sms');
    component.submit();
    expect(emitSpy).toHaveBeenCalledWith({ provider: 'Sms' });
  });

  it('should not emit updateProvider on submit when form is invalid', () => {
    const emitSpy = jest.spyOn(component.updateProvider, 'emit');
    component['\u005fform'].controls.provider.setValue(null!);
    component.submit();
    expect(emitSpy).not.toHaveBeenCalled();
  });

});
