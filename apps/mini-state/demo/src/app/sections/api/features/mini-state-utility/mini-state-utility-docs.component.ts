import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTabsModule } from '@angular/material/tabs';
import { HighlightModule } from 'ngx-highlightjs';

//##############################################//

// Example code snippets as constants
const COMBINE_ERRORS_EXAMPLE = `// Combine error objects from multiple MiniState instances
const combinedErrors = MiniStateUtility.combineErrors(state1, state2, state3);

// Use the combined signal in your template
@if(combinedErrors()) {
  <error-alert>{{ combinedErrors() }}</error-alert>
}`;

const COMBINE_ERROR_MSGS_EXAMPLE = `// Combine error messages from multiple MiniState instances
const combinedErrorMsgs = MiniStateUtility.combineErrorMsgs(state1, state2, state3);

// Use the combined signal in your template
@if(combinedErrorMsgs()) {
  <error-alert>{{ combinedErrorMsgs() }}</error-alert>
}`;

const COMBINE_SUCCESS_MSGS_EXAMPLE = `// Combine success messages from multiple MiniState instances
const combinedSuccessMsgs = MiniStateUtility.combineSuccessMsgs(state1, state2, state3);

// Use the combined signal in your template
@if(combinedSuccessMsgs()) {
  <success-toast>{{ combinedSuccessMsgs() }}</success-toast>
}`;

const COMBINE_LOADING_EXAMPLE = `// Combine loading states from multiple MiniState instances
const isLoading = MiniStateUtility.combineLoading(state1, state2, state3);

// Use the combined signal in your template
@if(isLoading()) {
  <loading-spinner></loading-spinner>
}`;

const COMBINE_DATA_EXAMPLE = `// Combine data from multiple MiniState instances
const combinedData = MiniStateUtility.combineData(state1, state2, state3);

// Use the combined signal in your template
@if(combinedData()) {
  <div>
    Latest data: {{ combinedData() }}
  </div>
}`;

//##############################################//

@Component({
  selector: 'sb-mini-state-utility-docs',
  templateUrl: './mini-state-utility-docs.component.html',
  styleUrls: ['./mini-state-utility-docs.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [MatExpansionModule, MatTabsModule, HighlightModule]
})
export class MiniStateUtilityDocsComponent {
  // Signal-based code examples derived from the constants
  protected combineErrorsExample = computed(() => COMBINE_ERRORS_EXAMPLE);
  protected combineErrorMsgsExample = computed(() => COMBINE_ERROR_MSGS_EXAMPLE);
  protected combineSuccessMsgsExample = computed(() => COMBINE_SUCCESS_MSGS_EXAMPLE);
  protected combineLoadingExample = computed(() => COMBINE_LOADING_EXAMPLE);
  protected combineDataExample = computed(() => COMBINE_DATA_EXAMPLE);
}