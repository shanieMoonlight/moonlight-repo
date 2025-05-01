# @spider-baby/mini-state/utils

Secondary entry point of `@spider-baby/mini-state` providing utilities for combining multiple state instances. Import from `@spider-baby/mini-state/utils`.

[![npm version](https://img.shields.io/npm/v/@spider-baby/mini-state.svg)](https://www.npmjs.com/package/@spider-baby/mini-state)
[![license](https://img.shields.io/npm/l/@spider-baby/mini-state.svg)](LICENSE)

## Overview

This package provides powerful utility classes for working with multiple MiniState instances, allowing you to combine and aggregate their states for unified UI feedback. This is especially useful when:

- You need a single loading spinner for multiple operations
- You want to display the latest error or success message from any operation
- You want to simplify your component templates by unifying state across operations

## Key Components

### MiniStateCombined

A high-level utility class that combines multiple MiniState instances to provide a unified view of their states.

```typescript
import { MiniStateCombined } from '@spider-baby/mini-state/utils';
import { MiniStateBuilder } from '@spider-baby/mini-state';

// Create individual states for different operations
const listState = MiniStateBuilder.Create(
  () => this.userService.getUsers()
);

const updateState = MiniStateBuilder.CreateWithInput(
  (user: User) => this.userService.updateUser(user)
);

// Combine them for unified UI feedback
const combinedState = MiniStateCombined.Combine(
  listState,
  updateState
);

// Access unified states with signals
loading = combinedState.loading;         // true if ANY state is loading
errorMsg = combinedState.errorMsg;       // latest error message from ANY state
successMsg = combinedState.successMsg;   // latest success message from ANY state
```

#### Features of MiniStateCombined

- **Unified loading state** - `loading` signal is true if any operation is in progress
- **Latest error message** - `errorMsg` signal shows the most recent error from any operation
- **Latest success message** - `successMsg` signal shows the most recent success from any operation
- **Observable and Signal APIs** - Access states through both Signals and Observables
- **Static convenience methods** - Additional methods for specific combinations

#### Static Utility Methods

MiniStateCombined provides convenient static methods for specific state combinations:

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

### MiniStateUtility

Lower-level utility class that provides fine-grained control over combining different aspects of MiniState instances. This class is used internally by MiniStateCombined but is also available for direct use.

```typescript
import { MiniStateUtility } from '@spider-baby/mini-state/utils';

// Combine loading states into a Signal
const isLoading = MiniStateUtility.combineLoading(state1, state2, state3);

// Combine loading states into an Observable
const loading$ = MiniStateUtility.combineLoading$(state1, state2, state3);

// Combine error messages into a Signal
const errorMsg = MiniStateUtility.combineErrorMsgs(state1, state2, state3);

// Combine success messages into a Signal
const successMsg = MiniStateUtility.combineSuccessMsgs(state1, state2, state3);

// Combine data from multiple states
const latestData = MiniStateUtility.combineData(state1, state2, state3);

// Combine error objects from multiple states
const error = MiniStateUtility.combineErrors(state1, state2, state3);
```

## Real-world Examples

### Unified UI Feedback in a CRUD Component

```typescript
@Component({
  selector: 'app-user-management',
  template: `
    <!-- Single loading indicator for any operation -->
    @if (loading()) {
      <div class="overlay">
        <loading-spinner/>
      </div>
    }
    
    <!-- Latest error message from any operation -->
    @if (errorMsg()) {
      <error-alert>
        {{ errorMsg() }}
      </error-alert>
    }
    
    <!-- Latest success message from any operation -->
    @if (successMsg()) {
      <success-toast>
        {{ successMsg() }}
      </success-toast>
    }
    
    <!-- User list -->
    <user-list 
      [users]="users()" 
      (edit)="editUser($event)"
      (delete)="deleteUser($event)">
    </user-list>
    
    <!-- Action buttons -->
    <button (click)="refreshList()">Refresh</button>
    <button (click)="createUser()">Add User</button>
  `
})
export class UserManagementComponent {
  private userService = inject(UserService);
  private destroyRef = inject(DestroyRef);
  
  // Create states for each operation
  private listState = MiniStateBuilder.Create(
    () => this.userService.getAll(),
    this.destroyRef
  );
  
  private updateState = MiniStateBuilder.CreateWithInput(
    (user: User) => this.userService.update(user),
    this.destroyRef
  ).setSuccessMsgFn(
    (user) => `User ${user.name} updated successfully`
  );
  
  private deleteState = MiniStateBuilder.CreateWithInput(
    (id: number) => this.userService.delete(id),
    this.destroyRef
  ).setSuccessMsgFn(
    (id) => `User deleted successfully`
  );
  
  // Combine all states for unified UI feedback
  private combinedState = MiniStateCombined.Combine(
    this.listState,
    this.updateState,
    this.deleteState
  );
  
  // Expose the combined signals to the template
  protected loading = this.combinedState.loading;
  protected errorMsg = this.combinedState.errorMsg;
  protected successMsg = this.combinedState.successMsg;
  
  // Expose data from the list state
  protected users = this.listState.data;
  
  constructor() {
    // Load initial data
    this.refreshList();
    
    // Refresh the list after successful updates or deletes
    this.updateState.success$.pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(() => this.refreshList());
    
    this.deleteState.success$.pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(() => this.refreshList());
  }
  
  refreshList() {
    this.listState.trigger();
  }
  
  editUser(user: User) {
    this.updateState.trigger(user);
  }
  
  deleteUser(id: number) {
    this.deleteState.trigger(id);
  }
}
```

### Granular Control with MiniStateUtility

```typescript
@Component({
  selector: 'app-dashboard',
  template: `
    <!-- Combine just the loading states from specific operations -->
    @if (criticalOperationsLoading()) {
      <top-bar-loader/>
    }
    
    <!-- Show errors only from data-loading operations -->
    @if (dataLoadingError()) {
      <error-banner>
        {{ dataLoadingError() }}
      </error-banner>
    }
    
    <!-- Dashboard content here -->
  `
})
export class DashboardComponent {
  private userState = /* MiniState for users */;
  private projectState = /* MiniState for projects */;
  private notificationState = /* MiniState for notifications */;
  private profileUpdateState = /* MiniState for profile updates */;
  
  // Combine loading states for critical operations only
  protected criticalOperationsLoading = MiniStateUtility.combineLoading(
    this.userState,
    this.projectState
  );
  
  // Combine error messages only from data-loading operations
  protected dataLoadingError = MiniStateUtility.combineErrorMsgs(
    this.userState,
    this.projectState,
    this.notificationState
  );
  
  // Other component logic...
}
```

## API Reference

### MiniStateCombined

**Static Methods:**

- `Combine(...states)`: Creates a new MiniStateCombined instance from multiple MiniState instances
- `CombineLoaders(...states)`: Creates a signal that's true if any state is loading
- `CombineErrorMsgs(...states)`: Creates a signal with the latest error message
- `CombineSuccessMsgs(...states)`: Creates a signal with the latest success message
- `CombineData(...states)`: Creates a signal with the latest data
- `CombineErrors(...states)`: Creates a signal with the latest error object

**Instance Properties:**

- `loading`: Signal<boolean> - true if any combined state is loading
- `loading$`: Observable<boolean> - emits when loading state changes
- `errorMsg`: Signal<string | undefined> - latest error message
- `errorMsg$`: Observable<string | undefined> - emits new error messages
- `successMsg`: Signal<string | undefined> - latest success message
- `successMsg$`: Observable<string | undefined> - emits new success messages
- `data`: Signal<any | undefined> - latest data from any state
- `data$`: Observable<any | undefined> - emits new data
- `error`: Signal<any> - latest error object
- `error$`: Observable<any> - emits new error objects

### MiniStateUtility

**Static Methods:**

- `combineLoading(...states)`: Signal<boolean> that's true if any state is loading
- `combineLoading$(...states)`: Observable<boolean> that emits loading state changes
- `combineErrorMsgs(...states)`: Signal<string | undefined> with the latest error message
- `combineErrorMsgs$(...states)`: Observable<string | undefined> that emits error messages
- `combineSuccessMsgs(...states)`: Signal<string | undefined> with the latest success message
- `combineSuccessMsgs$(...states)`: Observable<string | undefined> that emits success messages
- `combineData<T>(...states)`: Signal<T | undefined> with the latest data
- `combineData$<T>(...states)`: Observable<T | undefined> that emits data
- `combineErrors(...states)`: Signal<any> with the latest error object
- `combineErrors$(...states)`: Observable<any> that emits error objects

## Installation

This package is automatically installed as part of `@spider-baby/mini-state`.

```bash
npm install @spider-baby/mini-state
```

## Usage

Import the utilities from the secondary entry point:

```typescript
import { MiniStateCombined, MiniStateUtility } from '@spider-baby/mini-state/utils';
```

## License

MIT