import { EnvironmentProviders, Provider } from "@angular/core";
import { TOAST_CONFIG_TOKEN, ToastConfig } from "./toast-config";


export const matToastConfig = ToastConfig.Create(
    'var(--mat-sys-error-container)',
    'var(--mat-sys-tertiary-container)',
    'var(--mat-sys-primary-container)',
    'var(--mat-sys-secondary-container)')
    .setColorTxtError('var(--mat-sys-on-error-container)')
    .setColorTxtWarn('var(--mat-sys-on-tertiary-container)')
    .setColorTxtSuccess('var(--mat-sys-on-primary-container)')
    .setColorTxtInfo('var(--mat-sys-on-secondary-container)')
    .setColorBgDefault('var(--mat-sys-surface-container)');

