import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTabsModule } from '@angular/material/tabs';
import { HighlightModule } from 'ngx-highlightjs';

@Component({
  selector: 'sb-mini-state-combined-docs',
  templateUrl: './mini-state-combined-docs.component.html',
  styleUrls: ['./mini-state-combined-docs.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [MatExpansionModule, MatTabsModule, HighlightModule]
})
export class MiniStateCombinedDocsComponent {
  // Core concept
  conceptExample = `// MiniStateCombined aggregates multiple MiniState instances
import { MiniStateCombined } from '@spider-baby/mini-state/utils';

// Basic usage - combine multiple states into one
const combinedState = MiniStateCombined.Combine(
  userDetailsState,
  userOrdersState,
  userPreferencesState
);

// Access the combined state through signals and observables
const loading = combinedState.loading; // Signal<boolean> - true if ANY state is loading
const errorMsg = combinedState.errorMsg; // Signal<string | undefined> - latest error message
const successMsg = combinedState.successMsg; // Signal<string | undefined> - latest success message`;

  // Combine static method
  combineExample = `// Create a combined state from multiple MiniState instances
const combinedState = MiniStateCombined.Combine(
  detailsState,
  updateState,
  deleteState
);

// The combined state provides signals and observables that aggregate the individual states
loading$ = combinedState.loading$;       // Observable<boolean> - true if ANY state is loading
loading = combinedState.loading;         // Signal<boolean> - true if ANY state is loading
errorMsg = combinedState.errorMsg;       // Signal<string | undefined> - latest error message
successMsg = combinedState.successMsg;   // Signal<string | undefined> - latest success message
data = combinedState.data;               // Signal<any> - data from the most recently updated state`;

  // Combine loaders static method
  combineLoadersExample = `// Create a signal that's true if any state is loading
const isLoading = MiniStateCombined.CombineLoaders(state1, state2, state3);

// Usage in templates
<loading-spinner *ngIf="isLoading()"></loading-spinner>

// Or in reactive code
effect(() => {
  if (isLoading()) {
    console.log('Loading in progress...');
  } else {
    console.log('All operations completed!');
  }
});`;

  // Combine error messages static method
  combineErrorMsgsExample = `// Create a signal with the latest error message from any state
const errorMsg = MiniStateCombined.CombineErrorMsgs(state1, state2, state3);

// Usage in templates
<error-alert *ngIf="errorMsg()">{{ errorMsg() }}</error-alert>

// The signal will contain the most recent error message
// If multiple errors occur, only the latest is shown`;

  // Combine success messages static method
  combineSuccessMsgsExample = `// Create a signal with the latest success message
const successMsg = MiniStateCombined.CombineSuccessMsgs(state1, state2, state3);

// Usage in templates
<success-toast *ngIf="successMsg()">{{ successMsg() }}</success-toast>

// When any state produces a success message, it will be available through this signal`;

  // Combine data static method
  combineDataExample = `// Create a signal that contains the latest data
const latestData = MiniStateCombined.CombineData(state1, state2, state3);

// This signal will update whenever any state produces new data
const data = latestData();  // Will contain the most recent data from any state

// Useful when multiple operations affect the same data model`;

  // Combine errors static method
  combineErrorsExample = `// Create a signal that contains the latest error object
const error = MiniStateCombined.CombineErrors(state1, state2, state3);

// This is more detailed than the error message signal
// It provides access to the actual error object for custom handling
if (error()) {
  const err = error();
  if (err instanceof HttpErrorResponse) {
    // Handle HTTP error specifically
  }
}`;

  // Complete usage example in a component
  completeExample = `import { Component, DestroyRef, computed, inject } from '@angular/core';
import { MiniState, MiniStateBuilder } from '@spider-baby/mini-state';
import { MiniStateCombined } from '@spider-baby/mini-state/utils';
import { UserService } from './user.service';
import { User } from './user.model';

@Component({
  selector: 'app-user-profile',
  template: \`
    <!-- Show a single loading indicator for any operation -->
    <div class="loading-overlay" *ngIf="loading()">
      <mat-spinner diameter="40"></mat-spinner>
    </div>
    
    <!-- Show the latest error message from any operation -->
    <mat-error *ngIf="errorMsg()">{{ errorMsg() }}</mat-error>
    
    <!-- Show the latest success message from any operation -->
    <div class="success-message" *ngIf="successMsg()">{{ successMsg() }}</div>
    
    <div class="profile-container" *ngIf="user()">
      <h2>{{ user().displayName }}</h2>
      
      <!-- User details -->
      <div class="user-details">
        <p>Email: {{ user().email }}</p>
        <p>Joined: {{ user().createdAt | date }}</p>
      </div>
      
      <!-- User actions -->
      <div class="user-actions">
        <button mat-button (click)="refreshUser()">Refresh</button>
        <button mat-raised-button color="primary" (click)="updateUser()">
          Update Profile
        </button>
        <button mat-raised-button color="warn" (click)="deleteUser()">
          Delete Account
        </button>
      </div>
    </div>
  \`
})
export class UserProfileComponent {
  private userService = inject(UserService);
  private destroyer = inject(DestroyRef);
  private userId = 'current-user-id'; // Typically from auth service
  
  // Create individual state objects for different operations
  private getUserState = MiniStateBuilder.CreateWithInput(
    (userId: string) => this.userService.getById(userId)
  );
  
  private updateState = MiniStateBuilder.CreateWithInput(
    (user: User) => this.userService.update(user)
  ).setSuccessMsgFn((user) => \`Profile for \${user.displayName} updated successfully!\`);
  
  private deleteState = MiniStateBuilder.CreateWithInput(
    (userId: string) => this.userService.delete(userId)
  ).setSuccessMsgFn(() => \`Account deleted successfully. You will be logged out.\`);
  
  // Combine all states for unified UI feedback
  private combinedState = MiniStateCombined.Combine(
    this.getUserState,
    this.updateState,
    this.deleteState
  );
  
  // Expose combined signals to the template
  protected loading = this.combinedState.loading;
  protected errorMsg = this.combinedState.errorMsg;
  protected successMsg = this.combinedState.successMsg;
  
  // User is only from getUserState, not combined
  protected user = this.getUserState.data;
  
  constructor() {
    // Load user on component initialization
    this.getUserState.trigger(this.userId);
    
    // Handle account deletion success
    this.deleteState.successMsg$
      .pipe(takeUntilDestroyed(this.destroyer))
      .subscribe(msg => {
        if (msg) {
          // Perform logout actions after successful deletion
          setTimeout(() => this.authService.logout(), 2000);
        }
      });
  }
  
  refreshUser() {
    this.getUserState.retrigger();
  }
  
  updateUser() {
    if (this.user()) {
      const updatedUser = {
        ...this.user()!,
        lastUpdated: new Date()
      };
      this.updateState.trigger(updatedUser);
    }
  }
  
  deleteUser() {
    if (confirm('Are you sure you want to delete your account? This cannot be undone.')) {
      this.deleteState.trigger(this.userId);
    }
  }
}`;
}