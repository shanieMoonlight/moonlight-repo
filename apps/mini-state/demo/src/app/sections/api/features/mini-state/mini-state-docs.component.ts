import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTabsModule } from '@angular/material/tabs';
import { HighlightModule } from 'ngx-highlightjs';

@Component({
  selector: 'sb-mini-state-docs',
  templateUrl: './mini-state-docs.component.html',
  styleUrls: ['./mini-state-docs.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [MatExpansionModule, MatTabsModule, HighlightModule]
})
export class MiniStateDocsComponent {
  // Core concept
  conceptExample = `// MiniState is the core class for managing async operations
import { MiniState } from '@spider-baby/mini-state';

// Create a MiniState for loading users
const userState = new MiniState<string, User[]>(
  (filter: string) => userService.search(filter)
);

// Access the state through signals and observables
const users = userState.data;       // Signal<User[]>
const loading = userState.loading;  // Signal<boolean>
const errorMsg = userState.errorMsg; // Signal<string | undefined>

// Trigger the operation to load data
userState.trigger('search term');

// Retry the last operation with the same input
userState.retrigger();`;

  // Constructor
  constructorExample = `// Basic constructor for a MiniState
const userState = new MiniState<string, User[]>(
  // The trigger function that performs the async operation
  (searchTerm: string) => userService.search(searchTerm),
  
  // Optional: Initial data value (empty array in this case)
  [],
  
  // Optional: Function to generate success messages
  (searchTerm: string, users: User[]) => 
    \`Found \${users.length} users matching "\${searchTerm}"\`,
    
  // Optional: Function to call when trigger() is invoked
  (searchTerm: string) => {
    console.log('Searching for:', searchTerm);
    analytics.track('user_search', { term: searchTerm });
  }
);`;

  // Properties
  propertiesExample = `// Access data from the state
const users = userState.data();        // Current value of the data signal
const isLoading = userState.loading(); // Current loading state
const error = userState.errorMsg();    // Current error message if any

// Observable versions for RxJS operations
userState.data$.subscribe(users => {
  console.log('Users updated:', users);
});

userState.loading$.subscribe(isLoading => {
  console.log('Loading state changed:', isLoading);
});

userState.errorMsg$.subscribe(error => {
  if (error) console.error('Error occurred:', error);
});

userState.successMsg$.subscribe(msg => {
  if (msg) console.log('Success:', msg);
});`;

  // Methods
  triggerExample = `// Trigger the operation with new input
userState.trigger('new search term');

// Re-trigger the operation with the same input as last time
userState.retrigger();

// Reset error and success messages
userState.resetMessages();

// Use method chaining
userState
  .resetMessages()
  .trigger('new search');`;

  // Configuration methods
  configurationExample = `// Set a function to generate success messages
userState.setSuccessMsgFn(
  (input: string, output: User[]) => 
    \`Found \${output.length} users matching "\${input}"\`
);

// Set a function to call when trigger() is invoked
userState.setOnTriggerFn(
  (input: string) => {
    console.log('Searching for:', input);
    analytics.track('user_search', { term: input });
  }
);`;

  // Data manipulation
  dataManipulationExample = `// Manually set the data without triggering an operation
userState.setData([
  { id: 1, name: 'John Doe' },
  { id: 2, name: 'Jane Smith' }
]);

// Manually update the data using a callback function
userState.updateData(currentUsers => {
  return currentUsers.filter(user => user.isActive);
});`;

  // Error handling
  errorHandlingExample = `// Set an error message manually
userState.setErrorMsg('Failed to load users due to network error');

// Reset just the error message
userState.resetErrorMsg();

// Handle errors in the async operation
try {
  const result = await apiCall();
  return result;
} catch (error) {
  // The MiniState will automatically capture this error
  // and update the errorMsg signal
  throw error;
}`;

  // Complete usage example in a component
  completeExample = `import { Component, DestroyRef, computed, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MiniState } from '@spider-baby/mini-state';
import { UserService } from './user.service';
import { User } from './user.model';

@Component({
  selector: 'app-user-search',
  template: \`
    <div class="search-container">
      <h2>User Search</h2>
      
      <!-- Search input -->
      <div class="search-form">
        <mat-form-field>
          <mat-label>Search Users</mat-label>
          <input matInput [(ngModel)]="searchTerm" placeholder="Enter name or email">
        </mat-form-field>
        <button mat-raised-button color="primary" 
                [disabled]="loading()" 
                (click)="search()">
          Search
        </button>
      </div>
      
      <!-- Loading state -->
      @if(loading()) {
        <mat-progress-bar mode="indeterminate"></mat-progress-bar>
      }
      
      <!-- Error message -->
      @if(errorMsg()) {
        <div class="error-message">
          {{ errorMsg() }}
        </div>
      }
      
      <!-- Success message -->
      @if(successMsg()) {
        <div class="success-message">
          {{ successMsg() }}
        </div>
      }
      
      <!-- Results -->
      @if(users() && users().length > 0) {
        <div class="results">
          <h3>Search Results</h3>
          @for(user of users(); track user.id) {
            <mat-card>
              <mat-card-header>
                <mat-card-title>{{ user.name }}</mat-card-title>
                <mat-card-subtitle>{{ user.email }}</mat-card-subtitle>
              </mat-card-header>
              <mat-card-content>
                <p>{{ user.bio }}</p>
              </mat-card-content>
              <mat-card-actions>
                <button mat-button [routerLink]="['/users', user.id]">
                  View Profile
                </button>
              </mat-card-actions>
            </mat-card>
          }
        </div>
      }
      
      <!-- Empty state -->
      @if(searchPerformed() && users().length === 0) {
        <div class="empty-state">
          No users found matching your search criteria.
        </div>
      }
    </div>
  \`
})
export class UserSearchComponent {
  private userService = inject(UserService);
  private destroyRef = inject(DestroyRef);
  
  // Search state
  searchTerm = '';
  
  // Create a MiniState for user search
  private userState = new MiniState<string, User[]>(
    // Load users based on search term
    (term: string) => this.userService.searchUsers(term),
    
    // Initial empty array
    [],
    
    // Success message function
    (term: string, users: User[]) => 
      users.length > 0 
        ? \`Found \${users.length} users matching "\${term}"\` 
        : undefined
  );
  
  // Track if a search has been performed
  private searchPerformed = computed(() => {
    // Return true if we have either loaded data or had an error
    return this.userState.data().length > 0 || !!this.userState.errorMsg();
  });
  
  // Expose signals to the template
  protected users = this.userState.data;
  protected loading = this.userState.loading;
  protected errorMsg = this.userState.errorMsg;
  protected successMsg = this.userState.successMsg;
  
  constructor() {
    // Listen for errors and handle them
    this.userState.errorMsg$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(error => {
        if (error) {
          console.error('Search error:', error);
          // Could log to error monitoring service here
        }
      });
  }
  
  // Search users based on the current search term
  search() {
    if (!this.searchTerm.trim()) {
      this.userState.setErrorMsg('Please enter a search term');
      return;
    }
    
    this.userState.resetMessages();
    this.userState.trigger(this.searchTerm);
  }
  
  // Clear the search results
  clearSearch() {
    this.searchTerm = '';
    this.userState.setData([]);
    this.userState.resetMessages();
  }
}`
}