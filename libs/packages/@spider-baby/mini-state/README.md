# MiniState

A lightweight, reactive state management library for Angular applications that simplifies handling async operations.

[![npm version](https://img.shields.io/npm/v/@spider-baby/mini-state.svg)](https://www.npmjs.com/package/@spider-baby/mini-state)
[![license](https://img.shields.io/npm/l/@spider-baby/mini-state.svg)](LICENSE)
[![Angular Compatibility](https://img.shields.io/badge/Angular-18%2B-brightgreen)](https://www.npmjs.com/package/@spider-baby/mini-state)

## Overview

MiniState is a simple yet powerful state management solution for Angular applications, designed to handle:
- Async operation states (loading, success, error)
- Data fetching and updates
- UI feedback (loading indicators, success/error messages)
- Component-level state management without the complexity of global state libraries
- Signal-based state management compatible with Angular's latest features

Perfect for when NgRx feels like overkill but you still want clean, reactive patterns for managing component state.

## Installation

```bash
npm install @spider-baby/mini-state
```

Compatible with Angular 18 and 19.

## Key Features

- 🔄 **Reactive Patterns**: Built with RxJS and Angular Signals for seamless reactive architecture
- 🎯 **Focused Purpose**: Handles async operation states with minimal boilerplate
- 🧩 **Modular Design**: Core `MiniState` augmented by specialized extensions like `MiniCrudState`
- 🔌 **Simple Integration**: Works with any service that returns Observables
- 📊 **Efficient State Tracking**: Automatic handling of loading states, errors, and success messages
- 🔗 **Reactive Triggers**: Auto-trigger operations from route params, signals, and other observables
- 🧬 **Combinable States**: Easily combine multiple operations with `MiniStateCombined` and `MiniStateUtility`

## Basic Usage

### Simple Data Fetching

```typescript
import { Component, inject } from '@angular/core';
import { MiniStateBuilder } from '@spider-baby/mini-state';
import { UserService } from './user.service';

@Component({
  selector: 'app-user-list',
  template: `
    @if (loading()) {
      <div>Loading users...</div>
    }
    
    @if (errorMsg()) {
      <div>{{ errorMsg() }}</div>
    }
    
    @for (user of users(); track user.id) {
      <div>{{ user.name }}</div>
    }
    
    <button (click)="refresh()">Refresh</button>
  `
})
export class UserListComponent {
  private userService = inject(UserService);
  
  private state = MiniStateBuilder.Create(
    () => this.userService.getAll(),
    []  // Optional initial value
  );
  
  // Expose signals to template
  protected users = this.state.data;
  protected loading = this.state.loading;
  protected errorMsg = this.state.errorMsg;
  
  constructor() {
    // Trigger data load when component initializes
    this.state.trigger();
  }
  
  protected refresh() {
    this.state.retrigger();
  }
}
```

### With Input Parameters

```typescript
private searchState = MiniStateBuilder.CreateWithInput(
  (term: string) => this.userService.search(term)
);

// Trigger a search
this.searchState.trigger('search term');
```

### Automatically React to Route Parameters

```typescript
private userId$ = this.route.paramMap.pipe(
  map(params => params.get('id')),
  filter((id): id is string => !!id)
);

private userState = MiniStateBuilder.CreateWithObservableInput(
  this.userId$,
  (id: string) => this.userService.getById(id)
);
```

## Advanced Features

### CRUD Operations with MiniCrudState

```typescript
private userCrudState = MiniCrudState.Create(
  (filter: UserFilter) => this.userService.getAll(filter)
)
.setAddState(
  (user: User) => this.userService.create(user),
  (user, result) => `User ${user.name} created successfully!`
)
.setUpdateState(
  (user: User) => this.userService.update(user),
  (user, result) => `User ${user.name} updated successfully!`
)
.setDeleteState(
  (user: User) => this.userService.delete(user.id),
  (user, result) => `User ${user.name} deleted successfully!`
);

// Use the state
userCrudState.trigger(new UserFilter()); // Get all users
userCrudState.triggerAdd(newUser);        // Create user
userCrudState.triggerUpdate(updatedUser); // Update user
userCrudState.triggerDelete(userToDelete); // Delete user
```

### Combining Multiple States

```typescript
import { MiniStateCombined } from '@spider-baby/mini-state';

// Create individual states
const getAllState = MiniStateBuilder.Create(
  () => this.userService.getAll(),
  []
);
const updateState = MiniStateBuilder.CreateWithInput(
  (user: User) => this.userService.update(user)
);

// Combine for unified loading/error handling
const combinedState = MiniStateCombined.Combine(
  getAllState,
  updateState
);

// In template
@if (combinedState.loading()) {
  <loading-indicator/>
}

@if (combinedState.errorMsg()) {
  <error-message>{{ combinedState.errorMsg() }}</error-message>
}
```

### Using MiniStateUtility for Complex State Combinations

```typescript
import { MiniStateUtility } from '@spider-baby/mini-state';

// Combine loading states from multiple state instances
const isLoading = MiniStateUtility.combineLoading(state1, state2, state3);

// Combine error messages
const combinedErrorMsgs = MiniStateUtility.combineErrorMsgs(state1, state2, state3);

// Combine data
const combinedData = MiniStateUtility.combineData(state1, state2, state3);

// Use in template
@if (isLoading()) {
  <loading-spinner/>
}

@if (combinedErrorMsgs()) {
  <error-alert>{{ combinedErrorMsgs() }}</error-alert>
}
```

## API Documentation

### Core Classes

- **MiniState**: Base class that manages state for an async operation
- **MiniStateBuilder**: Factory for creating MiniState instances with different configurations
- **MiniCrudState**: Extended MiniState for CRUD operations
- **MiniStateCombined**: Combines multiple MiniState instances for unified state management
- **MiniStateUtility**: Utility class with static methods for combining state properties

### MiniState Methods

- `trigger(input)`: Starts the async operation with the given input
- `retrigger()`: Repeats the last operation with the same input
- `setSuccessMsgFn()`: Sets a function to generate success messages
- `setOnSuccessFn()`: Sets a function to execute after successful operations
- `setErrorMsgFn()`: Sets a function to generate error messages
- `setOnErrorFn()`: Sets a function to execute when errors occur
- `resetMessagesAndLoading()`: Manually clears all messages and resets loading state

### MiniStateUtility Methods

- `combineErrors`: Combines error objects from multiple states
- `combineErrorMsgs`: Combines error messages from multiple states
- `combineSuccessMsgs`: Combines success messages from multiple states
- `combineLoading`: Combines loading states from multiple states
- `combineData`: Combines data from multiple states

## Packages

- `@spider-baby/mini-state`: Core library with MiniState, MiniStateBuilder, and MiniCrudState
  
  

## Changes
[CHANGELOG.md](https://github.com/shanieMoonlight/moonlight-repo/blob/master/libs/packages/%40spider-baby/mini-state/CHANGELOG.md)

## License

MIT
