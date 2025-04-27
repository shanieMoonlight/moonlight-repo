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
@if(combinedErrors()) {
  <error-alert>{{ combinedErrors() }}</error-alert>
}`;

  combineErrorMsgsExample = `// Combine error messages from multiple MiniState instances
const combinedErrorMsgs = MiniStateUtility.combineErrorMsgs(state1, state2, state3);

// Use the combined signal in your template
@if(combinedErrorMsgs()) {
  <error-alert>{{ combinedErrorMsgs() }}</error-alert>
}`;

  combineSuccessMsgsExample = `// Combine success messages from multiple MiniState instances
const combinedSuccessMsgs = MiniStateUtility.combineSuccessMsgs(state1, state2, state3);

// Use the combined signal in your template
@if(combinedSuccessMsgs()) {
  <success-toast>{{ combinedSuccessMsgs() }}</success-toast>
}`;

  combineLoadingExample = `// Combine loading states from multiple MiniState instances
const isLoading = MiniStateUtility.combineLoading(state1, state2, state3);

// Use the combined signal in your template
@if(isLoading()) {
  <loading-spinner></loading-spinner>
}`;

  combineDataExample = `// Combine data from multiple MiniState instances
const combinedData = MiniStateUtility.combineData(state1, state2, state3);

// Use the combined signal in your template
@if(combinedData()) {
  <div>
    Latest data: {{ combinedData() }}
  </div>
}`;
}