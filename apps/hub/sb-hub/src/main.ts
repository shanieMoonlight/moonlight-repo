import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from '@sb-hub/app/entry-point';

bootstrapApplication(AppComponent, appConfig).catch((err) =>
  console.error(err)
);
