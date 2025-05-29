// MiniStateCombined example
export const CombinedStatesExample = `// Combining multiple states for unified UI feedback
import { Component, inject } from '@angular/core';
import { MiniStateBuilder } from '@spider-baby/mini-state';
import { MiniStateCombined } from '@spider-baby/mini-state/utils';
import { UserService, ProjectService } from './services';

@Component({
  selector: 'app-dashboard',
  template: \`
    <!-- Unified loading indicator -->
    @if (combinedState.loading()) {
      <div class="global-loader">Loading...</div>
    }
    
    <!-- Unified error handling -->
    @if (combinedState.errorMsg()) {
      <div class="error-banner">{{ combinedState.errorMsg() }}</div>
    }
    
    <!-- Unified success messages -->
    @if (combinedState.successMsg()) {
      <div class="success-banner">{{ combinedState.successMsg() }}</div>
    }
    
    <!-- Form content -->
    <div class="dashboard-content">
      <h2>User Detail</h2>
      <button mat-raised-button color="primary" (click)="refresh()">
        <mat-icon>refresh</mat-icon> Refresh Data
      </button>
      
    <sb-user-form
        [user]="_user()"
        (edit)="edit($event)" />
      
      <div class="actions">
        <button (click)="refreshAll()">Refresh All</button>
        <button (click)="updateUser()">Update User</button>
        <button (click)="createProject()">Create Project</button>
      </div>
    </div>
  \`
})
export class DashboardComponent {

// MiniStateCombined allows you to unify multiple MiniState instances for coordinated UI feedback.
// Instead of managing loading states, errors, and success messages from each state individually,
// you can combine them into a single state object that aggregates all the feedback signals.
// This is perfect for dashboards or complex views where multiple async operations need unified UI indicators.
// The combined state will show loading as true if ANY of the individual states are loading,
// display the most recent error or success message, and coordinate all feedback seamlessly.


  private _ioService = inject(UserService)
  private _actRoute = inject(ActivatedRoute)
  private _router = inject(Router)

  //- - - - - - - - - - - - - //

  private _id$ = this._actRoute.paramMap.pipe(
    map((params: ParamMap) => params.get('id') ?? undefined),
    filter((id: string | undefined): id is string => !!id)
  )

  //- - - - - - - - - - - - - //  

  private _itemState = MiniStateBuilder.CreateWithObservableInput(
    this._id$,
    (id: string) => this._ioService.getById(id))

  private _editState = MiniStateBuilder
    .CreateWithInput((user: User) => this._ioService.update(user))
    .setSuccessMsgFn((user: User) => \`User \${user.title} updated successfully!\`)

  private _combinedState = MiniStateCombined.Combine(
    this._itemState,
    this._editState)

  protected _user = computed(() => this._combinedState.data() ?? [])
  protected _successMsg = this._combinedState.successMsg
  protected _errorMsg = this._combinedState.errorMsg
  protected _loading = this._combinedState.loading

  //--------------------------//

  protected edit = (user: User) =>
    this._editState.trigger(user)


  protected refresh = () =>
    this._itemState.retrigger()

}`;

// MiniStateUtility example
export const StateUtilityExample = `// Advanced state combination with MiniStateUtility
import { Component, inject } from '@angular/core';
import { MiniStateBuilder } from '@spider-baby/mini-state';
import { MiniStateUtility } from '@spider-baby/mini-state/utils';

@Component({
  selector: 'app-granular-control',
  template: \`
    <!-- Critical operations loader only -->
    @if (criticalLoading()) {
      <div class="critical-loader">Critical operations in progress...</div>
    }
    
    <!-- Data loading errors only -->
    @if (dataError()) {
      <div class="data-error">Data loading failed: {{ dataError() }}</div>
    }
    
    <!-- All success messages -->
    @if (anySuccess()) {
      <div class="success">{{ anySuccess() }}</div>
    }
    
    <!-- Background operations indicator -->
    @if (backgroundLoading()) {
      <div class="bg-indicator">Background sync...</div>
    }
  \`
})
export class GranularControlComponent {
// MiniStateUtility provides granular control over combining specific aspects of multiple MiniState instances.
// While MiniStateCombined creates a unified state combining all signals, MiniStateUtility lets you selectively combine
// only the loading states, error messages, or success messages you need for different UI scenarios.
// This gives you fine-grained control - you can show critical loading states separately from background operations,
// combine errors from data-fetching states while ignoring sync errors, or create custom UI feedback patterns.
// Perfect for complex applications where different operations require different visual treatment.



  private dataService = inject(DataService);
  
  // Critical operations (affect main UI)
  private usersState = MiniStateBuilder.Create(
    () => this.dataService.getUsers()
  );
  
  private settingsState = MiniStateBuilder.Create(
    () => this.dataService.getSettings()
  );
  
  // Background operations (don't block UI)
  private syncState = MiniStateBuilder.Create(
    () => this.dataService.syncData()
  ).setSuccessMsgFn(() => 'Data synced successfully');
  
  private logState = MiniStateBuilder.Create(
    () => this.dataService.sendLogs()
  );
  
  // Granular state combinations
  protected criticalLoading = MiniStateUtility.combineLoading(
    this.usersState,
    this.settingsState
  );
  
  protected dataError = MiniStateUtility.combineErrorMsgs(
    this.usersState,
    this.settingsState
  );
  
  protected backgroundLoading = MiniStateUtility.combineLoading(
    this.syncState,
    this.logState
  );
  
  protected anySuccess = MiniStateUtility.combineSuccessMsgs(
    this.usersState,
    this.settingsState,
    this.syncState,
    this.logState
  );
}`;

// Advanced configuration example
export const AdvancedConfigExample = `// Advanced MiniState configuration with custom handlers
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MiniStateBuilder } from '@spider-baby/mini-state';
import { NotificationService } from './notification.service';

@Component({
  selector: 'app-advanced-config',
  template: \`
    @if (loading()) {
      <div class="loader">{{ loadingMessage() }}</div>
    }
    
    @if (data(); as items) {
      <div>Loaded {{ items.length }} items</div>
    }
  \`
})
export class AdvancedConfigComponent {
  private dataService = inject(DataService);
  private router = inject(Router);
  private notifications = inject(NotificationService);
  
  protected loadingMessage = signal('Preparing...');
  
  private dataState = MiniStateBuilder.CreateWithInput(
    (filter: DataFilter) => this.dataService.getData(filter)
  )
  // Custom loading message
  .setOnTriggerFn((filter) => {
    this.loadingMessage.set(\`Loading data for \${filter.category}...\`);
  })
  // Custom success handling
  .setSuccessMsgFn((filter, data) => 
    \`Successfully loaded \${data.length} \${filter.category} items\`
  )
  .setOnSuccessFn((filter, data) => {
    // Custom logic after success
    this.notifications.show('Data loaded successfully');
    
    // Navigate if no data found
    if (data.length === 0) {
      setTimeout(() => this.router.navigate(['/empty']), 1000);
    }
  })
  // Custom error handling
  .setErrorMsgFn((error) => {
    if (error.status === 404) {
      return 'No data found for your request';
    }
    return \`Failed to load data: \${error.message}\`;
  })
  .setOnErrorFn((filter, error) => {
    // Custom error logic
    this.notifications.showError('Failed to load data');
    
    // Navigate to error page on critical errors
    if (error.status >= 500) {
      this.router.navigate(['/error']);
    }
  })
  // Process data before storing
  .setSuccessDataProcessorFn((filter, newData, prevFilter, prevData) => {
    // Merge with previous data if appending
    if (filter.append && prevData) {
      return [...prevData, ...newData];
    }
    return newData;
  });
  
  protected data = this.dataState.data;
  protected loading = this.dataState.loading;
  protected errorMsg = this.dataState.errorMsg;
  protected successMsg = this.dataState.successMsg;
}`;
