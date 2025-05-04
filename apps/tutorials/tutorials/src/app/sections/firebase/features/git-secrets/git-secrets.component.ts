import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { HighlightModule } from 'ngx-highlightjs';
import { MatEverythingModule } from '@spider-baby/material-theming/utils';


//################################################//

const GIT_ACTION = `jobs:
build:
runs-on: ubuntu-latest
environment: production # <---------- Must match the GIT environment
steps:
  - uses: actions/checkout@v3
  - name: Set up Node.js
    uses: actions/setup-node@v3
    with:
      node-version: 'lts/*'
  - name: Install dependencies
    run: npm install
  
    - name: Create environments directory
    run: mkdir -p apps/your-app/src/environments # Adjust path as needed
  
    - name: Create environment files from secrets
    env:
      ENVIRONMENT_PATH: 'apps/your-app/src/environments' # Adjust path as needed
    run: |
      # Create or update environment.ts (for development/default)
      echo "export const environment = {" > "$ENVIRONMENT_PATH/environment.ts"
      echo "  production: false," >> "$ENVIRONMENT_PATH/environment.ts"
      echo "  firebaseConfig: {" >> "$ENVIRONMENT_PATH/environment.ts"
      echo "    apiKey: '\\{{ secrets.FIREBASE_API_KEY }}'," >> "$ENVIRONMENT_PATH/environment.ts
      echo "    authDomain: '\\{{ secrets.FIREBASE_AUTH_DOMAIN }}'," >> "$ENVIRONMENT_PATH/environment.ts
      echo "    projectId: '\\{{ secrets.FIREBASE_PROJECT_ID }}'," >> "$ENVIRONMENT_PATH/environment.ts
      echo "    storageBucket: '\\{{ secrets.FIREBASE_STORAGE_BUCKET }}'," >> "$ENVIRONMENT_PATH/environment.ts
      echo "    messagingSenderId: '\\{{ secrets.FIREBASE_MESSAGING_SENDER_ID }}'," >> "$ENVIRONMENT_PATH/environment.ts
      echo "    appId: '\\{{ secrets.FIREBASE_APP_ID }}'," >> "$ENVIRONMENT_PATH/environment.ts
      echo "    measurementId: '\\{{ secrets.FIREBASE_MEASUREMENT_ID }}'," >> "$ENVIRONMENT_PATH/environment.ts
      echo "  }" >> "$ENVIRONMENT_PATH/environment.ts"
      echo "};" >> "$ENVIRONMENT_PATH/environment.ts"

      # Create or update environment.prod.ts (for production builds)
      echo "export const environment = {" > "$ENVIRONMENT_PATH/environment.prod.ts"
      echo "  production: true," >> "$ENVIRONMENT_PATH/environment.prod.ts"
      echo "  firebaseConfig: {" >> "$ENVIRONMENT_PATH/environment.prod.ts"
      echo "    apiKey: '\\{{ secrets.FIREBASE_API_KEY }}'," >> "$ENVIRONMENT_PATH/environment.prod.ts
      echo "    authDomain: '\\{{ secrets.FIREBASE_AUTH_DOMAIN }}'," >> "$ENVIRONMENT_PATH/environment.prod.ts
      echo "    projectId: '\\{{ secrets.FIREBASE_PROJECT_ID }}'," >> "$ENVIRONMENT_PATH/environment.prod.ts
      echo "    storageBucket: '\\{{ secrets.FIREBASE_STORAGE_BUCKET }}'," >> "$ENVIRONMENT_PATH/environment.prod.ts
      echo "    messagingSenderId: '\\{{ secrets.FIREBASE_MESSAGING_SENDER_ID }}'," >> "$ENVIRONMENT_PATH/environment.prod.ts
      echo "    appId: '\\{{ secrets.FIREBASE_APP_ID }}'," >> "$ENVIRONMENT_PATH/environment.prod.ts
      echo "    measurementId: '\\{{ secrets.FIREBASE_MEASUREMENT_ID }}'," >> "$ENVIRONMENT_PATH/environment.prod.ts
      echo "  }" >> "$ENVIRONMENT_PATH/environment.prod.ts"
      echo "};" >> "$ENVIRONMENT_PATH/environment.prod.ts"

  - name: Build Angular app
    run: npx ng build --configuration=production # Or your specific build command
  # ... rest of your deployment steps ...
  `

const APP_CONFIG = `
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { environment } from './environments/environment'; // Adjust path if needed

// ...

provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
`

//################################################//









@Component({
  selector: 'sb-tutorials-firebase-git-secrets',
  imports: [
    HighlightModule,
    MatEverythingModule
  ],
  templateUrl: './git-secrets.component.html',
  styleUrl: './git-secrets.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FirebaseGitSecretsComponent {


  protected _gitAction = signal(GIT_ACTION)
  protected _appConfig = signal(APP_CONFIG)

}
