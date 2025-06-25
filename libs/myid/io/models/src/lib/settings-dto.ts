import { IdGlobalOptions } from './id-global-options';
import { IdGlobalSetupOptions_CUSTOMER } from './id-global-setup-options_customer';

export interface SettingsDto {
  settings?: IdGlobalOptions;
  customerSettings?: IdGlobalSetupOptions_CUSTOMER;
}
