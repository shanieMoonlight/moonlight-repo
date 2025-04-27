# @spider-baby/mini-state/utils

Secondary entry point of `@spider-baby/mini-state`. It can be used by importing from `@spider-baby/mini-state/utils`.

## Overview

This package provides utility classes for working with multiple MiniState instances, allowing you to combine and aggregate their states for unified UI feedback.

## Key Components

### MiniStateCombined

`MiniStateCombined` takes multiple MiniState instances and provides a unified interface to their combined states.

```typescript
import { MiniStateCombined } from '@spider-baby/mini-state/utils';

// Create a combined state from multiple MiniState instances
const combinedState = MiniStateCombined.Combine(
  getAllState,
  updateState,
  deleteState
);

// Access the combined states through signals and observables
loading$ = combinedState.loading$;       // Observable<boolean>
loading = combinedState.loading;         // Signal<boolean>
errorMsg = combinedState.errorMsg;       // Signal<string | undefined>
successMsg = combinedState.successMsg;   // Signal<string | undefined>
```

#### Static Utility Methods

MiniStateCombined also provides static methods for specific state combinations:

```typescript
// Get a signal that's true if any state is loading
const isLoading = MiniStateCombined.CombineLoaders(state1, state2);

// Get a signal with the latest error message
const errorMsg = MiniStateCombined.CombineErrorMsgs(state1, state2);

// Get a signal with the latest success message
const successMsg = MiniStateCombined.CombineSuccessMsgs(state1, state2);

// Get a signal with the latest data
const latestData = MiniStateCombined.CombineData(state1, state2);

// Get a signal with the latest error object
const error = MiniStateCombined.CombineErrors(state1, state2);
```

### MsUtility

Lower-level utility class used internally by MiniStateCombined, but also available for direct use:

```typescript
import { MsUtility } from '@spider-baby/mini-state/utils';

// Combine loading states into an Observable
const loading$ = MsUtility.combineLoading$(state1, state2);

// Combine loading states into a Signal
const loading = MsUtility.combineLoading(state1, state2);

// Similar methods available for error messages, success messages, data, etc.
```

## Example: Unified UI Feedback

```typescript
@Component({
  selector: 'app-user-management',
  template: `
    <!-- Show a single loading indicator for any operation -->
    <loading-spinner *ngIf="loading()"></loading-spinner>
    
    <!-- Show the latest error message from any operation -->
    <error-alert *ngIf="errorMsg()">{{ errorMsg() }}</error-alert>
    
    <!-- Show the latest success message from any operation -->
    <success-toast *ngIf="successMsg()">{{ successMsg() }}</success-toast>
    
    <!-- User list and actions here -->
  `
})
export class UserManagementComponent {
  private getAllState = /* MiniState for fetching users */;
  private updateState = /* MiniState for updating a user */;
  private deleteState = /* MiniState for deleting a user */;
  
  private combinedState = MiniStateCombined.Combine(
    this.getAllState, 
    this.updateState, 
    this.deleteState
  );
  
  // Expose the combined signals to the template
  protected loading = this.combinedState.loading;
  protected errorMsg = this.combinedState.errorMsg;
  protected successMsg = this.combinedState.successMsg;
}
```

## Installation

This package is automatically installed as part of `@spider-baby/mini-state`.

```bash
npm install @spider-baby/mini-state
```

## Usage

Import the utilities from the secondary entry point:

```typescript
import { MiniStateCombined, MsUtility } from '@spider-baby/mini-state/utils';
```
