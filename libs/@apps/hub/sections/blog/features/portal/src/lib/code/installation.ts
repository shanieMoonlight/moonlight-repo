export const InstallationCode = `# Install the Angular CDK
npm install @angular/cdk

# Install our portal library
npm install @spider-baby/utils-portal`;

export const SetupModuleCode = `// app.component.ts or feature module
import { SbPortalInputComponent, SbPortalOutletComponent } from '@spider-baby/utils-portal';

@Component({
  standalone: true,
  imports: [
    SbPortalInputComponent,
    SbPortalOutletComponent,
    // ... other imports
  ],
  // ... component definition
})
export class AppComponent {}`;

export const PackageJsonCode = `{
  "dependencies": {
    "@angular/cdk": "^17.3.0",
    "@spider-baby/utils-portal": "^latest"
  },
  "peerDependencies": {
    "@angular/core": ">=17.3.0",
    "@angular/common": ">=17.3.0",
    "@angular/cdk": ">=17.3.0"
  }
}`;
