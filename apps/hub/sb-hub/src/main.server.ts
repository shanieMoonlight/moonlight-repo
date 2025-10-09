import { bootstrapApplication, BootstrapContext } from '@angular/platform-browser';
import { AppComponent } from '@sb-hub/app/entry-point';
import { config } from './app/app.config.server';

const bootstrap = (context: BootstrapContext) => bootstrapApplication(AppComponent, config, context);

export default bootstrap;
