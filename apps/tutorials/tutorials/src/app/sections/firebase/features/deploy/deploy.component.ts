import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HighlightModule } from 'ngx-highlightjs';
import { MatEverythingModule } from '@spider-baby/utils-mat-everything';

@Component({
  selector: 'sb-firebase-deploy',
  imports: [HighlightModule, MatEverythingModule],
  templateUrl: './deploy.component.html',
  styleUrl: './deploy.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FirebaseDeployComponent {


  protected _firebaseDotJson = `{
  "hosting": [
    {
      "target": "spider-baby-mat-theming-demo",
      "public": "dist/apps/sb-mat-thm-demo/browser",
      // ... other config like ignore, rewrites
    },
    {
      "target": "spider-baby-hub-demo", // Your target name here!
      "public": "dist/apps/hub/sb-hub/browser",
      // ... other config
    }
    // ... other hosting configurations
  ],
  // ... other Firebase service configurations (firestore, functions)
}`;

_firebaserc = `{
  "projects": {
    // ... project aliases
  },
  "targets": {
    "spiderbabymaterialtheming": { /* Targets for Project ID "spiderbabymaterialtheming" */
      "hosting": {
        "spider-baby-mat-theming-demo": ["spiderbabymaterialtheming"] // Target name maps to Site ID
      }
    },
    "spider-baby-hub": { /* Targets for Project ID "spider-baby-hub" */
      "hosting": {
        "spider-baby-hub-demo": ["spider-baby-hub"] // Your target name maps to the Site ID here!
      }
    },
    // ... targets for other projects
  },
  "etags": {}
}`


_gitActions = `
- name: Deploy to Firebase Hosting
  uses: FirebaseExtended/action-hosting-deploy@v0
  with:
    repoToken: \${{ secrets.GITHUB_TOKEN }}
    firebaseServiceAccount: \${{ secrets.FIREBASE_SERVICE_ACCOUNT_SPIDERBABY_HUB }}
    channelId: live
    target: spider-baby-hub-demo # &lt;--- This parameter is key!
    projectId: spider-baby-hub   # &lt;--- And this one!
`

}
