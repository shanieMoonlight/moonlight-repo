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

The library exposes a compact CRUD helper (currently exported as `MiniCrudState`) and a small builder utility. You can create a CRUD state either directly from existing `MiniState` instances or via the builder helpers.

Direct usage (create from existing `MiniState` instances):

```typescript
// create per-operation MiniState instances (examples)
const getAllState = MiniStateBuilder.Create(() => this.userService.getAll());
const addState = MiniStateBuilder.CreateWithInput((u: User) => this.userService.create(u));
const updateState = MiniStateBuilder.CreateWithInput((u: User) => this.userService.update(u));
const deleteState = MiniStateBuilder.CreateWithInput((u: User) => this.userService.delete(u.id));

const userCrud = MiniCrudState.Create(getAllState, addState, updateState, deleteState);

// Use the state
userCrud.triggerGetAll(new UserFilter());
userCrud.triggerAdd(newUser);
userCrud.triggerUpdate(updatedUser);
userCrud.triggerDelete(userToDelete);
```

Or use the fluent `MiniCrudStateBuilder` to assemble and build in one flow:

```typescript
userCrud = MiniCrudStateBuilder
  .Create(() => this.userService.getAll())
  .setAddState((u: User) => this.userService.create(u))
  .setUpdateState((u: User) => this.userService.update(u))
  .setDeleteState((u: User) => this.userService.delete(u.id))
  .buildAndTrigger();//Trigger immediately;

userCrud.triggerAdd(newUser);
```

With filtering
```typescript
crudState = MiniCrudStateBuilder
    .Create<string | undefined, Product>((searchTerm) => this._productService.getAllFiltered(searchTerm))
    .setAddState(
        (product) => this._productService.create(product),
        (product) => `Product  ${product.title} added!`)
      .setUpdateState(
        (product) => this._productService.update(product),
        (product) => `⭐⭐⭐\r\n Product ${product.title} updated successfully! \r\n⭐⭐⭐`)
      .setDeleteState(
        (product) => this._productService.delete(product.id!),
        (product) => `Product ${product.title} deleted successfully 🗑️`)
        .buildAndTrigger(undefined)//Trigger immediately with no search filter;
```

### Combining Multiple States

`MiniStateCombined` and `MiniStateUtility` are included in the main package and provide convenient helpers to aggregate loading, error and data signals/observables across multiple `MiniState` instances.

```typescript
import { MiniStateCombined } from '@spider-baby/mini-state';

const getAllState = MiniStateBuilder.Create(() => this.userService.getAll());
const updateState = MiniStateBuilder.CreateWithInput((user: User) => this.userService.update(user));

const combined = MiniStateCombined.Combine(getAllState, updateState);

@if (combined.loading()) {
  <loading-indicator/>
}

@if (combined.errorMsg()) {
  <error-message>{{ combined.errorMsg() }}</error-message>
}
```

### Using MiniStateUtility for Complex State Combinations

`MiniStateUtility` provides programmatic helpers when you need to combine observables or signals from many `MiniState` instances.

```typescript
import { MiniStateUtility } from '@spider-baby/mini-state';

const isLoading = MiniStateUtility.combineLoading(state1, state2, state3);
const combinedErrorMsgs = MiniStateUtility.combineErrorMsgs(state1, state2, state3);
const combinedData = MiniStateUtility.combineData(state1, state2, state3);

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
- **MiniStateBuilder**: Factory for creating `MiniState` instances (`Create`, `CreateWithInput`, `CreateWithObservableInput`, `CreateWithSignalInput`)
- **MiniCrudState**: Compact helper for CRUD collections (exposed as `MiniCrudState` with a static `Create` factory)
- **MiniCrudStateBuilder**: Fluent builder for assembling CRUD state instances
- **MiniStateCombined**: Combine multiple `MiniState` instances into unified signals/observables
- **MiniStateUtility**: Utility functions for combining loading, errors, messages, and data

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

- `@spider-baby/mini-state`: Core library with `MiniState`, `MiniStateBuilder`, `MiniCrudState`, `MiniCrudStateBuilder`, `MiniStateCombined`, and `MiniStateUtility` (all exported from the package root)
  
  

## Changes
[CHANGELOG.md](https://github.com/shanieMoonlight/moonlight-repo/blob/master/libs/packages/%40spider-baby/mini-state/CHANGELOG.md)

## License

MIT
