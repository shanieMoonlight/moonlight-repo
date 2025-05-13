import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from '@sb-hub/app/entry-point';
import { config } from './app/app.config.server';

const bootstrap = () => bootstrapApplication(AppComponent, config);

export default bootstrap;
