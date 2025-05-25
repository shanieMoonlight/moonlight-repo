// Basic MiniState usage example
export const BasicMiniStateExample = `// Basic data fetching with MiniState
import { Component, inject } from '@angular/core';
import { MiniStateBuilder } from '@spider-baby/mini-state';
import { UserService } from './user.service';

@Component({
  selector: 'app-user-list',
  template: \`
    @if (loading()) {
      <div>Loading users...</div>
    }
    
    @if (errorMsg()) {
      <div class="error">{{ errorMsg() }}</div>
    }
    
    @for (user of users(); track user.id) {
      <div class="user-card">{{ user.name }}</div>
    }
    
    <button (click)="refresh()">Refresh</button>
  \`
})
export class UserListComponent {
  private userService = inject(UserService);
  
  private state = MiniStateBuilder.Create(
    () => this.userService.getAll()
  );
  
  // Expose signals to template
  protected users = this.state.data;
  protected loading = this.state.loading;
  protected errorMsg = this.state.errorMsg;
  
  constructor() {
    // Load data when component initializes
    this.state.trigger();
  }
  
  protected refresh() {
    this.state.retrigger();
  }
}`;

// MiniState with input parameters
export const MiniStateWithInputExample = `// MiniState with search functionality
import { Component, inject, signal } from '@angular/core';
import { MiniStateBuilder } from '@spider-baby/mini-state';
import { UserService } from './user.service';

@Component({
  selector: 'app-user-search',
  template: \`
    <input 
      [value]="searchTerm()"
      (input)="updateSearch($event)"
      placeholder="Search users...">
    
    <button 
      (click)="search()" 
      [disabled]="loading()">
      Search
    </button>
    
    @if (loading()) {
      <div>Searching...</div>
    }
    
    @if (results(); as users) {
      <div>Found {{ users.length }} users</div>
      @for (user of users; track user.id) {
        <div>{{ user.name }} - {{ user.email }}</div>
      }
    }
  \`
})
export class UserSearchComponent {
  private userService = inject(UserService);
  
  protected searchTerm = signal('');
  
  private searchState = MiniStateBuilder.CreateWithInput(
    (term: string) => this.userService.search(term)
  );
  
  protected results = this.searchState.data;
  protected loading = this.searchState.loading;
  protected errorMsg = this.searchState.errorMsg;
  
  protected updateSearch(event: Event) {
    const input = event.target as HTMLInputElement;
    this.searchTerm.set(input.value);
  }
  
  protected search() {
    this.searchState.trigger(this.searchTerm());
  }
}`;

// Reactive MiniState with observables
export const ReactiveMiniStateExample = `// MiniState that reacts to route parameters
import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MiniStateBuilder } from '@spider-baby/mini-state';
import { map, filter } from 'rxjs/operators';
import { UserService } from './user.service';

@Component({
  selector: 'app-user-detail',
  template: \`
    @if (loading()) {
      <div>Loading user details...</div>
    }
    
    @if (user(); as userData) {
      <div class="user-details">
        <h2>{{ userData.name }}</h2>
        <p>{{ userData.email }}</p>
        <p>{{ userData.bio }}</p>
      </div>
    }
    
    @if (errorMsg()) {
      <div class="error">{{ errorMsg() }}</div>
    }
  \`
})
export class UserDetailComponent {
  private route = inject(ActivatedRoute);
  private userService = inject(UserService);
  
  // Extract user ID from route parameters
  private userId$ = this.route.paramMap.pipe(
    map(params => params.get('id')),
    filter((id): id is string => !!id)
  );
  
  // Auto-trigger when route changes
  private userState = MiniStateBuilder.CreateWithObservableInput(
    this.userId$,
    (id: string) => this.userService.getById(id)
  );
  
  protected user = this.userState.data;
  protected loading = this.userState.loading;
  protected errorMsg = this.userState.errorMsg;
}`;

// MiniCrudState example
export const MiniCrudStateExample = `// Complete CRUD operations with MiniCrudState
import { Component, inject, signal } from '@angular/core';
import { MiniCrudState } from '@spider-baby/mini-state';
import { UserService } from './user.service';

interface User {
  id: number;
  name: string;
  email: string;
}

@Component({
  selector: 'app-user-crud',
  template: \`
    <!-- Add new user form -->
    <div class="add-user-form">
      <input 
        [value]="newUserName()"
        (input)="updateNewUserName($event)"
        placeholder="Name">
      <input 
        [value]="newUserEmail()"
        (input)="updateNewUserEmail($event)"
        placeholder="Email">
      <button (click)="addUser()" [disabled]="loading()">
        Add User
      </button>
    </div>
    
    <!-- Loading indicator -->
    @if (loading()) {
      <div>Processing...</div>
    }
    
    <!-- Success/Error messages -->
    @if (successMsg()) {
      <div class="success">{{ successMsg() }}</div>
    }
    @if (errorMsg()) {
      <div class="error">{{ errorMsg() }}</div>
    }
    
    <!-- Users list -->
    @for (user of users(); track user.id) {
      <div class="user-item">
        <span>{{ user.name }} - {{ user.email }}</span>
        <button (click)="editUser(user)">Edit</button>
        <button (click)="deleteUser(user)">Delete</button>
      </div>
    }
  \`
})
export class UserCrudComponent {
  private userService = inject(UserService);
  
  protected newUserName = signal('');
  protected newUserEmail = signal('');
  
  // CRUD state with automatic data synchronization
  private crudState = MiniCrudState.Create(
    () => this.userService.getAll(),
    (item1: User, item2: User) => item1.id === item2.id // equality function
  )
  .setAddState(
    (user: User) => this.userService.create(user),
    (user) => \`User \${user.name} created successfully!\`
  )
  .setUpdateState(
    (user: User) => this.userService.update(user),
    (user) => \`User \${user.name} updated successfully!\`
  )
  .setDeleteState(
    (user: User) => this.userService.delete(user.id),
    (user) => \`User \${user.name} deleted successfully!\`
  );
  
  protected users = this.crudState.data;
  protected loading = this.crudState.loading;
  protected errorMsg = this.crudState.errorMsg;
  protected successMsg = this.crudState.successMsg;
  
  constructor() {
    // Load initial data
    this.crudState.trigger();
  }
  
  protected updateNewUserName(event: Event) {
    const input = event.target as HTMLInputElement;
    this.newUserName.set(input.value);
  }
  
  protected updateNewUserEmail(event: Event) {
    const input = event.target as HTMLInputElement;
    this.newUserEmail.set(input.value);
  }
  
  protected addUser() {
    const newUser: User = {
      id: 0, // Server will assign
      name: this.newUserName(),
      email: this.newUserEmail()
    };
    
    this.crudState.triggerAdd(newUser);
    this.newUserName.set('');
    this.newUserEmail.set('');
  }
  
  protected editUser(user: User) {
    const updatedUser = { ...user, name: user.name + ' (Updated)' };
    this.crudState.triggerUpdate(updatedUser);
  }
  
  protected deleteUser(user: User) {
    this.crudState.triggerDelete(user);
  }
}`;
