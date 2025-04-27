# MiniState

A lightweight, reactive state management library for Angular applications that simplifies handling async operations.

[![npm version](https://img.shields.io/npm/v/@spider-baby/mini-state.svg)](https://www.npmjs.com/package/@spider-baby/mini-state)
[![license](https://img.shields.io/npm/l/@spider-baby/mini-state.svg)](LICENSE)

## Overview

MiniState is a simple yet powerful state management solution for Angular applications, designed to handle:
- Async operation states (loading, success, error)
- Data fetching and updates
- UI feedback (loading indicators, success/error messages)
- Component-level state management without the complexity of global state libraries

Perfect for when NgRx feels like overkill but you still want clean, reactive patterns for managing component state.

## Installation

```bash
npm install @spider-baby/mini-state
```

## Key Features

- 🔄 **Reactive Patterns**: Built with RxJS and Angular Signals for seamless reactive architecture
- 🎯 **Focused Purpose**: Handles async operation states with minimal boilerplate
- 🧩 **Modular Design**: Core `MiniState` augmented by specialized extensions like `MiniCrudState`
- 🔌 **Simple Integration**: Works with any service that returns Observables
- 📊 **Efficient State Tracking**: Automatic handling of loading states, errors, and success messages
- 🔗 **Reactive Triggers**: Auto-trigger operations from route params, signals, and other observables
- 🧬 **Combinable States**: Easily combine multiple operations with `MiniStateCombined`

## Basic Usage

### Simple Data Fetching

```typescript
import { Component, inject, DestroyRef } from '@angular/core';
import { MiniStateBuilder } from '@spider-baby/mini-state';
import { UserService } from './user.service';

@Component({
  selector: 'app-user-list',
  template: `
    <div *ngIf="loading()">Loading users...</div>
    <div *ngIf="errorMsg()">{{ errorMsg() }}</div>
    <div *ngFor="let user of users()">{{ user.name }}</div>
    <button (click)="refresh()">Refresh</button>
  `
})
export class UserListComponent {
  private userService = inject(UserService);
  private destroyer = inject(DestroyRef);
  
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
  (id: string) => this.userService.getById(id),
  this.destroyRef
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
import { MiniStateCombined } from '@spider-baby/mini-state/utils';

// Create individual states
const getAllState = MiniStateBuilder.Create(
  () => this.userService.getAll()
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
<loading-indicator *ngIf="combinedState.loading()"></loading-indicator>
<error-message *ngIf="combinedState.errorMsg()">{{ combinedState.errorMsg() }}</error-message>
```

## Documentation

For detailed API documentation, see the [API docs](https://github.com/your-repo/mini-state/docs) (coming soon).

## Packages

- `@spider-baby/mini-state`: Core library with MiniState, MiniStateBuilder, and MiniCrudState
- `@spider-baby/mini-state/utils`: Utilities for combining and aggregating multiple state instances

## License

MIT
