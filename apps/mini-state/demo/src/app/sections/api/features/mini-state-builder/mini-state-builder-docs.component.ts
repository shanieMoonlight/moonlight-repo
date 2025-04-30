import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTabsModule } from '@angular/material/tabs';
import { HighlightModule } from 'ngx-highlightjs';

@Component({
  selector: 'sb-mini-state-builder-docs',
  templateUrl: './mini-state-builder-docs.component.html',
  styleUrls: ['./mini-state-builder-docs.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [MatExpansionModule, MatTabsModule, HighlightModule]
})
export class MiniStateBuilderDocsComponent {
  // Core concept
  conceptExample = `// MiniStateBuilder provides a fluent API for creating MiniState instances
import { MiniStateBuilder } from '@spider-baby/mini-state';

// Create a MiniState without input
const counterState = MiniStateBuilder
  .Create(() => fetchCurrentCount())
  .setSuccessMsgFn((count) => \`Counter loaded: \${count}\`);
// Trigger immediately
counterState.trigger();

// Create a MiniState with input parameter
const userState = MiniStateBuilder
  .CreateWithInput((userId: string) => fetchUser(userId));
// Use later when needed
userState.trigger('user-123');`;

  // Create method
  createExample = `// Create a MiniState for operations that don't require input
const todosState = MiniStateBuilder
  .Create(() => todoService.getAllTodos());

// The created MiniState can be triggered without parameters
todosState.trigger();  // Calls todoService.getAllTodos()

// You can trigger it multiple times to refresh data
refreshButton.addEventListener('click', () => {
  todosState.trigger();  // Fetch fresh data
});`;

  // CreateWithInput method
  createWithInputExample = `// Create a MiniState for operations that require input
const userState = MiniStateBuilder
  .CreateWithInput((userId: string) => userService.getUser(userId));

// The created MiniState must be triggered with an input parameter
userState.trigger('user-123');  // Calls userService.getUser('user-123')

// You can trigger with different inputs for different data
userState.trigger('user-456');  // Now calls userService.getUser('user-456')`;

  // CreateWithObservableInput method
  createWithObservableInputExample = `// Create a MiniState that reacts to Observable inputs
import { ActivatedRoute } from '@angular/router';
import { map, filter } from 'rxjs/operators';

// Extract ID from route parameters
const id$ = this.route.paramMap.pipe(
  map(params => params.get('id') ?? undefined),
  filter((id): id is string => !!id)
);

// Create a MiniState that automatically triggers when the ID changes
const itemState = MiniStateBuilder.CreateWithObservableInput(
  id$,
  (id: string) => this.itemService.getById(id)
);

// No need to call trigger() - it happens automatically when id$ emits!`;

  // CreateWithSignalInput method
  createWithSignalInputExample = `// Create a MiniState that reacts to Signal inputs
import { signal } from '@angular/core';

// Create a signal for the filter criteria
const filterCriteria = signal({ status: 'active', page: 1 });

// Create a MiniState that automatically triggers when the signal changes
const itemsState = MiniStateBuilder.CreateWithSignalInput(
  filterCriteria,
  (criteria) => this.itemService.search(criteria)
);

// Change the signal to trigger a new search
function nextPage() {
  const current = filterCriteria();
  filterCriteria.set({ ...current, page: current.page + 1 });
  // State is automatically triggered with new criteria!
}`;

  // Final example (replacing build example)
  completeChainExample = `// MiniStateBuilder returns a fully configured MiniState
// You can chain methods directly onto the Create* methods

const todosState = MiniStateBuilder
  .Create(() => todoService.getAllTodos())
  .setSuccessMsgFn((todos) => \`Loaded \${todos.length} todos\`)
  // Returns a configured MiniState - no build() method needed
  .trigger(); // Optional: trigger immediately

// Internal cleanup is handled by DestroyRef that's injected
// automatically in the Create* methods, so you don't need to
// worry about calling unsubscribe manually`;

  // Updated basic example
  basicExample = `// Basic usage example with MiniStateBuilder
import { Component, inject } from '@angular/core';
import { MiniStateBuilder } from '@spider-baby/mini-state';
import { WeatherService } from './weather.service';

@Component({
  selector: 'app-weather',
  template: \`
    <h2>Current Weather</h2>
    @if(loading()) {
      <div>Loading weather data...</div>
    }
    
    @if(errorMsg()) {
      <div class="error">
        {{ errorMsg() }}
      </div>
    }
    
    @if(weather() && !loading()) {
      <div>
        <p>Temperature: {{ weather().temperature }}°C</p>
        <p>Conditions: {{ weather().conditions }}</p>
        <button (click)="refresh()">Refresh</button>
      </div>
    }
  \`
})
export class WeatherComponent {
  private weatherService = inject(WeatherService);
  
  // Create a MiniState for fetching weather data
  // MiniStateBuilder automatically injects DestroyRef for cleanup
  private weatherState = MiniStateBuilder
    .Create(() => this.weatherService.getCurrentWeather())
    .setSuccessMsgFn((weather) => 
      \`Weather updated: \${weather.temperature}°C, \${weather.conditions}\`
    );
  
  // Expose the state to the template
  protected weather = this.weatherState.data;
  protected loading = this.weatherState.loading;
  protected errorMsg = this.weatherState.errorMsg;
  
  constructor() {
    // Fetch weather on component initialization
    this.weatherState.trigger();
  }
  
  refresh() {
    this.weatherState.retrigger();
  }
}`;

  // Updated input example - remove build() references
  manualInputExample = `// Example with manual input trigger
import { Component, inject } from '@angular/core';
import { MiniStateBuilder } from '@spider-baby/mini-state';
import { UserService } from './user.service';

@Component({
  selector: 'app-user-profile',
  template: \`
    <h2>User Profile</h2>
    
    <!-- Manual ID input -->
    <div class="search-input">
      <input [(ngModel)]="userId" placeholder="Enter User ID">
      <button [disabled]="loading()" (click)="loadUser()">
        {{ loading() ? 'Loading...' : 'Load User' }}
      </button>
    </div>
    
    <!-- Error and success messages -->
    @if(errorMsg()) {
      <div class="error-message">{{ errorMsg() }}</div>
    }
    
    @if(successMsg()) {
      <div class="success-message">{{ successMsg() }}</div>
    }
    
    <!-- User data -->
    @if(user()) {
      <div class="user-profile">
        <h3>{{ user().name }}</h3>
        <p>Email: {{ user().email }}</p>
        <p>Role: {{ user().role }}</p>
      </div>
    }
  \`
})
export class UserProfileComponent {
  private userService = inject(UserService);
  
  userId = '';
  
  // Create a MiniState for manual user loading
  private userState = MiniStateBuilder
    .CreateWithInput((id: string) => this.userService.getUserById(id))
    .setSuccessMsgFn((id, user) => 
      \`User \${user.name} loaded successfully\`
    );
  
  // Expose the state to the template
  protected user = this.userState.data;
  protected loading = this.userState.loading;
  protected errorMsg = this.userState.errorMsg;
  protected successMsg = this.userState.successMsg;
  
  loadUser() {
    if (!this.userId.trim()) {
      this.userState.setErrorMsg('Please enter a user ID');
      return;
    }
    
    this.userState.trigger(this.userId);
  }
}`;

  observableInputExample = `// Example with automatic observable input trigger
import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MiniStateBuilder } from '@spider-baby/mini-state';
import { UserService } from './user.service';
import { map, filter } from 'rxjs/operators';

@Component({
  selector: 'app-user-detail',
  template: \`
    <h2>User Details</h2>
    
    <!-- Loading state -->
    @if(loading()) {
      <div class="loading">Loading user details...</div>
    }
    
    <!-- Error message -->
    @if(errorMsg()) {
      <div class="error-message">{{ errorMsg() }}</div>
    }
    
    <!-- User data loaded from route param -->
    @if(user()) {
      <div class="user-detail">
        <h3>{{ user().name }}</h3>
        <p>Email: {{ user().email }}</p>
        <p>Role: {{ user().role }}</p>
        <p>Member since: {{ user().joinDate | date }}</p>
        
        <h4>Activity</h4>
        <ul>
          @for(activity of user().recentActivity; track $index) {
            <li>{{ activity.date | date }}: {{ activity.action }}</li>
          }
        </ul>
      </div>
    }
    
    <button (click)="goToRandomUser()">Load Random User</button>
  \`
})
export class UserDetailComponent {
  private userService = inject(UserService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  
  // Extract ID from route parameters
  private userId$ = this.route.paramMap.pipe(
    map(params => params.get('userId') ?? undefined),
    filter((id): id is string => !!id)
  );
  
  // Create a MiniState that automatically triggers when route ID changes
  private userState = MiniStateBuilder.CreateWithObservableInput(
    // The observable input source
    this.userId$,
    // The function that loads data for each input value
    (id: string) => this.userService.getUserById(id)
  );
  
  // Expose the state to the template
  protected user = this.userState.data;
  protected loading = this.userState.loading;
  protected errorMsg = this.userState.errorMsg;
  
  // Navigate to a random user to demonstrate automatic triggering
  goToRandomUser() {
    const randomId = Math.floor(Math.random() * 100) + 1;
    this.router.navigate(['/users', randomId]);
    // No need to call trigger() - it happens automatically when route changes!
  }
}`;
}