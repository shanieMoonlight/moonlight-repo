import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTabsModule } from '@angular/material/tabs';
import { HighlightModule } from 'ngx-highlightjs';

@Component({
  selector: 'sb-mini-state-utility-docs',
  templateUrl: './mini-state-utility-docs.component.html',
  styleUrls: ['./mini-state-utility-docs.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [MatExpansionModule, MatTabsModule, HighlightModule]
})
export class MiniStateUtilityDocsComponent {
  // Example code snippets for documentation
  combineErrorsExample = `// Combine error objects from multiple MiniState instances
const combinedErrors = MiniStateUtility.combineErrors(state1, state2, state3);

// Use the combined signal in your template
<error-alert *ngIf="combinedErrors()">{{ combinedErrors() }}</error-alert>`;

  combineErrorMsgsExample = `// Combine error messages from multiple MiniState instances
const combinedErrorMsgs = MiniStateUtility.combineErrorMsgs(state1, state2, state3);

// Use the combined signal in your template
<error-alert *ngIf="combinedErrorMsgs()">{{ combinedErrorMsgs() }}</error-alert>`;

  combineSuccessMsgsExample = `// Combine success messages from multiple MiniState instances
const combinedSuccessMsgs = MiniStateUtility.combineSuccessMsgs(state1, state2, state3);

// Use the combined signal in your template
<success-toast *ngIf="combinedSuccessMsgs()">{{ combinedSuccessMsgs() }}</success-toast>`;

  combineLoadingExample = `// Combine loading states from multiple MiniState instances
const isLoading = MiniStateUtility.combineLoading(state1, state2, state3);

// Use the combined signal in your template
<loading-spinner *ngIf="isLoading()"></loading-spinner>`;

  combineDataExample = `// Combine data from multiple MiniState instances
const combinedData = MiniStateUtility.combineData(state1, state2, state3);

// Use the combined signal in your template
<div *ngIf="combinedData()">
  Latest data: {{ combinedData() }}
</div>`;
}