import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTabsModule } from '@angular/material/tabs';
import { HighlightModule } from 'ngx-highlightjs';
import { SeoService } from '@spider-baby/utils-seo';
import { Router } from '@angular/router';

//##############################################//


// Core concept
const CONCEPT_EXAMPLE = `// MiniState is the core class for managing async operations
import { MiniState } from '@spider-baby/mini-state';
import { DestroyRef, inject } from '@angular/core';

// Create a MiniState for loading users
const destroyRef = inject(DestroyRef);
const userState = new MiniState<string, User[]>(
  (filter: string) => userService.search(filter),
  destroyRef
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
const CONSTRUCTOR_EXAMPLE = `// Basic constructor for a MiniState

  destroyer = inject(DestroyRef); 

const userState = new MiniState<string, User[]>(
  // The trigger function that performs the async operation
  (searchTerm: string) => userService.search(searchTerm),
  
  // DestroyRef for cleanup
  destroyer, 

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
const PROPERTIES_EXAMPLE = `// Access data from the state
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
const TRIGGER_EXAMPLE = `// Trigger the operation with new input
userState.trigger('new search term');

// Re-trigger the operation with the same input as last time
userState.retrigger();

// Reset error and success messages
userState.resetMessagesAndLoading();

// Use method chaining
userState
  .resetMessagesAndLoading()
  .trigger('new search');`;

// Configuration methods
const CONFIGURATION_EXAMPLE = `// Set a function to generate success messages
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
const DATA_MANIPULATION_EXAMPLE = `// Manually set the data without triggering an operation
userState.setData([
  { id: 1, name: 'John Doe' },
  { id: 2, name: 'Jane Smith' }
]);

// Manually update the data using a callback function
userState.updateData(currentUsers => {
  return currentUsers.filter(user => user.isActive);
});`;

// Error handling
const ERROR_HANDLING_EXAMPLE = `// Set an error message manually
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
const COMPLETE_EXAMPLE = `import { Component, DestroyRef, computed, inject } from '@angular/core';
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
      <input matInput 
        [(ngModel)]="searchTerm" 
        placeholder="Enter name or email">
    </mat-form-field>
    <button mat-raised-button color="primary" 
            [disabled]="loading()" 
            (click)="search()">
      Search
    </button>
  </div>
  
  <!-- Loading state -->
  @if(loading()) {
    <mat-progress-bar mode="indeterminate"/>
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
  @if(!!albums()?.length) {
    <h3>Search Results</h3>
    <div class="results">
      @for(album of albums(); track album.id) {
        <mat-card>
          <mat-card-header>
            <mat-card-title>{{ album.title }}</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <p>{{ album.description }}</p>
          </mat-card-content>
          <mat-card-actions>
            <button mat-button [routerLink]="['/detail', album.id]">
              View Album
            </button>
          </mat-card-actions>
        </mat-card>
      }
    </div>
  }
  
  <!-- Empty state -->
  @if(_noDataMessage()) {
    <div class="empty-state">
      {{_noDataMessage()}}
    </div>
  }
</div>
  \`
})
export class MainDemoSearchComponent {

  private _albumService = inject(DummyAlbumIoService);
  private destroyRef = inject(DestroyRef);

  //- - - - - - - - - - - - - //

  // Search state
  searchTerm = '';

  // Create a MiniState for album search
  private albumState = new MiniState<string, Album[]>(
    // Load albums based on search term
    (term: string) => this._albumService.search(term),
    this.destroyRef,
    // Initial empty array
    [],
  ).setOnSuccessFn((term: string, albums: Album[]) =>  // Success message function
    albums.length > 0
      ? \`Found \${albums.length} albums matching "\${term}"\`
      : undefined)


  // Track if a search has been performed
  protected _noDataMessage = computed(() =>
    this.albumState.wasTriggered() && !this.errorMsg() && !this.albums()?.length
      ? 'No albums found matching your search criteria.'
      : undefined)


  // Expose signals to the template
  protected albums = this.albumState.data;
  protected loading = this.albumState.loading;
  protected errorMsg = this.albumState.errorMsg;
  protected successMsg = this.albumState.successMsg;

  //- - - - - - - - - - - - - //


  constructor() {
    // Listen for errors and handle them
    this.albumState.errorMsg$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(error => {
        if (error) {
          console.error('Search error:', error);
          // Could log to error monitoring service here
        }
      })
  }

  //- - - - - - - - - - - - - //


  // Search albums based on the current search term
  search() {
    if (!this.searchTerm.trim()) {
      console.log('Please enter a search term');
      return;
    }

    this.albumState.trigger(this.searchTerm);
  }


  // Clear the search results
  clearSearch = () =>
    this.searchTerm = '';


}//Cls`;

// Success message function example
const SUCCESS_MSG_FN_EXAMPLE = `// Set a function to generate success messages
const userState = new MiniState<User, User>(
  (user: User) => userService.update(user)
);

// Add a success message function
userState.setSuccessMsgFn((user, updatedUser) => 
  \`User \${user.name} updated successfully!\`
);

// Or with a conditional message
userState.setSuccessMsgFn((user, updatedUser) => {
  if (user.isNewUser) {
    return \`Welcome, \${user.name}! Your account has been created.\`;
  }
  return \`User \${user.name} was updated successfully.\`;
});`;

// Error message function example
const ERROR_MSG_FN_EXAMPLE = `// Set a custom error message handler
userState.setErrorMsgFn(error => {
  // Check for specific error types
  if (error.status === 401) {
    return 'Your session has expired. Please log in again.';
  }
  if (error.status === 403) {
    return 'You do not have permission to perform this action.';
  }
  
  // Fall back to default error message
  return error.message || 'An unexpected error occurred.';
});`;

// Success data processor function example
const SUCCESS_DATA_PROCESSOR_FN_EXAMPLE = `// Process data before storing it
userState.setSuccessDataProcessorFn(
  (input, output, prevInput, prevOutput) => {
    // Only update specific properties
    return {
      ...(prevOutput || {}), // Keep previous data as base
      ...output,             // Apply new data
      lastUpdated: new Date() // Add custom property
    };
  }
);

// Example: Append to an array of results
const searchState = new MiniState<string, User[]>(
  (query) => userService.search(query)
);

// Process search results
searchState.setSuccessDataProcessorFn(
  (query, newResults, prevQuery, prevResults = []) => {
    // For pagination: append new results to existing ones
    if (query === prevQuery + ' page=2') {
      return [...prevResults, ...newResults];
    }
    // For new search: replace results
    return newResults;
  }
);`;

// On success function example
const ON_SUCCESS_FN_EXAMPLE = `// Navigate after successful user creation
const createUserState = new MiniState<User, User>(
  (user) => userService.create(user)
);

// Set an action to execute after success
createUserState.setOnSuccessFn((user, createdUser) => {
  console.log('User created successfully:', createdUser);
  router.navigate(['/users', createdUser.id]);
});

// Real-world example: After successful login
loginState.setOnSuccessFn((credentials, user) => {
  // Store auth token
  authService.setToken(user.token);
  
  // Redirect based on user role
  if (user.isAdmin) {
    router.navigate(['/admin-dashboard']);
  } else {
    router.navigate(['/user-dashboard']);
  }
});`;

// On error function example
const ON_ERROR_FN_EXAMPLE = `// Handle authentication failures
loginState.setOnErrorFn((credentials, error) => {
  // Track failed login attempts
  authService.recordFailedAttempt(credentials.username);
  
  // Redirect to password reset if too many failures
  if (error.failedAttempts > 3) {
    router.navigate(['/reset-password'], { 
      queryParams: { username: credentials.username } 
    });
  }
});

// Another example: Redirect to error page for critical errors
dataState.setOnErrorFn((input, error) => {
  if (error.critical) {
    errorService.logCriticalError(error);
    router.navigate(['/system-error'], { 
      state: { errorCode: error.code }
    });
  }
});`;

// On trigger function example
const ON_TRIGGER_FN_EXAMPLE = `// Log analytics before performing operation
userState.setOnTriggerFn(user => {
  analytics.trackEvent('user_update_started', {
    userId: user.id,
    timestamp: new Date()
  });
});

// Another example: Validate input before operation
formSubmitState.setOnTriggerFn(formData => {
  // Final validation before submitting
  if (!formData.termsAccepted) {
    alert('You must accept the terms before continuing.');
    throw new Error('Terms not accepted');
  }
  
  // Prepare data for submission
  formData.submittedAt = new Date().toISOString();
});`;

//##############################################//

@Component({
  selector: 'sb-mini-state-docs',
  templateUrl: './mini-state-docs.component.html',
  styleUrls: ['./mini-state-docs.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [MatExpansionModule, MatTabsModule, HighlightModule]
})
export class MiniStateDocsComponent implements OnInit {
  private _seoService = inject(SeoService);
  private _router = inject(Router);

  //- - - - - - - - - - - - - - -//
  
  conceptExample = signal(CONCEPT_EXAMPLE);
  constructorExample = signal(CONSTRUCTOR_EXAMPLE);
  propertiesExample = signal(PROPERTIES_EXAMPLE);
  triggerExample = signal(TRIGGER_EXAMPLE);
  configurationExample = signal(CONFIGURATION_EXAMPLE);
  dataManipulationExample = signal(DATA_MANIPULATION_EXAMPLE);
  errorHandlingExample = signal(ERROR_HANDLING_EXAMPLE);
  completeExample = signal(COMPLETE_EXAMPLE);
  successMsgFnExample = signal(SUCCESS_MSG_FN_EXAMPLE);
  errorMsgFnExample = signal(ERROR_MSG_FN_EXAMPLE);
  successDataProcessorFnExample = signal(SUCCESS_DATA_PROCESSOR_FN_EXAMPLE);
  onSuccessFnExample = signal(ON_SUCCESS_FN_EXAMPLE);
  onErrorFnExample = signal(ON_ERROR_FN_EXAMPLE);
  onTriggerFnExample = signal(ON_TRIGGER_FN_EXAMPLE);

  //-----------------------------//

  ngOnInit() {
    // Set SEO metadata
    this._seoService.updateMetadata({
      title: 'API MiniState | Core Class for Async State Management',
      description: 'MiniState is the core class for managing async operations with automatic handling of loading states, errors, and success messages in Angular applications.',
      url: this._router.url,
      keywords: ['API', 'Angular', 'State Management', 'MiniState', 'Async Operations', 'Loading States', 'Error Handling']
    });
  }
  
}