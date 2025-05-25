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
    
    <!-- Dashboard content -->
    <div class="dashboard-content">
      <div class="users-section">
        <h3>Users ({{ users()?.length || 0 }})</h3>
        <!-- Users content -->
      </div>
      
      <div class="projects-section">
        <h3>Projects ({{ projects()?.length || 0 }})</h3>
        <!-- Projects content -->
      </div>
      
      <div class="actions">
        <button (click)="refreshAll()">Refresh All</button>
        <button (click)="updateUser()">Update User</button>
        <button (click)="createProject()">Create Project</button>
      </div>
    </div>
  \`
})
export class DashboardComponent {
  private userService = inject(UserService);
  private projectService = inject(ProjectService);
  
  // Individual states for different operations
  private usersState = MiniStateBuilder.Create(
    () => this.userService.getAll()
  );
  
  private projectsState = MiniStateBuilder.Create(
    () => this.projectService.getAll()
  );
  
  private updateUserState = MiniStateBuilder.CreateWithInput(
    (user: User) => this.userService.update(user)
  ).setSuccessMsgFn((user) => \`User \${user.name} updated!\`);
  
  private createProjectState = MiniStateBuilder.CreateWithInput(
    (project: Project) => this.projectService.create(project)
  ).setSuccessMsgFn((project) => \`Project \${project.name} created!\`);
  
  // Combine all states for unified UI feedback
  protected combinedState = MiniStateCombined.Combine(
    this.usersState,
    this.projectsState,
    this.updateUserState,
    this.createProjectState
  );
  
  // Individual data access
  protected users = this.usersState.data;
  protected projects = this.projectsState.data;
  
  constructor() {
    this.refreshAll();
  }
  
  protected refreshAll() {
    this.usersState.trigger();
    this.projectsState.trigger();
  }
  
  protected updateUser() {
    const user = this.users()?.[0];
    if (user) {
      this.updateUserState.trigger({ ...user, name: user.name + ' (Updated)' });
    }
  }
  
  protected createProject() {
    this.createProjectState.trigger({
      id: 0,
      name: 'New Project ' + Date.now(),
      description: 'Auto-generated project'
    });
  }
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
