/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SbUpdateTwoFactorProviderFormComponent } from './update-two-factor-provider.component';
import { ReactiveFormsModule } from '@angular/forms';
import { FirstErrorComponent, FirstErrorDirective } from '@spider-baby/utils-forms';
import { SbButtonComponent } from '../../../../ui/buttons';
import { SbSelectComponent } from '../../../../ui/select/select.component';
import { TwoFactorProvider } from '../../../../id/io/models/two-factor-provider';
import { By } from '@angular/platform-browser';

describe('SbUpdateTwoFactorProviderFormComponent', () => {
  let component: SbUpdateTwoFactorProviderFormComponent;
  let fixture: ComponentFixture<SbUpdateTwoFactorProviderFormComponent>;

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
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default provider value', () => {
    expect(component['\u005fform'].controls.provider.value).toBe('email');
  });

  it('should update provider when currentProvider is set', () => {
    component.currentProvider = 'sms';
    expect(component['\u005fform'].controls.provider.value).toBe('sms');
  });

  it('should be invalid if provider is not set', () => {
    component['\u005fform'].controls.provider.setValue(null!);
    expect(component['\u005fform'].valid).toBeFalsy();
  });

  it('should be valid with a valid provider', () => {
    component['\u005fform'].controls.provider.setValue('authenticatorApp');
    expect(component['\u005fform'].valid).toBeTruthy();
  });

  it('should emit updateProvider with correct dto on submit when valid', () => {
    const emitSpy = jest.spyOn(component.updateProvider, 'emit');
    component['\u005fform'].controls.provider.setValue('sms');
    component.submit();
    expect(emitSpy).toHaveBeenCalledWith({ provider: 'sms' });
  });

  it('should not emit updateProvider on submit when form is invalid', () => {
    const emitSpy = jest.spyOn(component.updateProvider, 'emit');
    component['\u005fform'].controls.provider.setValue(null!);
    component.submit();
    expect(emitSpy).not.toHaveBeenCalled();
  });

  it('should have correct provider options', () => {
    expect(component['\u005fproviderOptions']).toEqual([
      { value: 'authenticatorApp', label: 'Authenticator App' },
      { value: 'sms', label: 'SMS' },
      { value: 'email', label: 'Email' },
    ]);
  });
});
