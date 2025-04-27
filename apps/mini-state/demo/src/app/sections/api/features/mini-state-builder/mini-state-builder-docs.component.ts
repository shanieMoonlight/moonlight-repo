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
  .setSuccessMsgFn((count) => \`Counter loaded: \${count}\`)
  .build();

// Create a MiniState with input
const userState = MiniStateBuilder
  .CreateWithInput((userId: string) => fetchUser(userId))
  .setSuccessMsgFn((userId, user) => \`User \${user.name} loaded\`)
  .build();`;

  // Create method
  createExample = `// Create a MiniState for operations that don't require input
const todosState = MiniStateBuilder
  .Create(() => todoService.getAllTodos())
  .build();

// The created MiniState can be triggered without parameters
todosState.trigger();  // Calls todoService.getAllTodos()`;

  // CreateWithInput method
  createWithInputExample = `// Create a MiniState for operations that require input
const userState = MiniStateBuilder
  .CreateWithInput((userId: string) => userService.getUser(userId))
  .build();

// The created MiniState must be triggered with an input parameter
userState.trigger('user-123');  // Calls userService.getUser('user-123')`;

  // setInitialData method
  setInitialDataExample = `// Set the initial data value for the state
const todosState = MiniStateBuilder
  .Create(() => todoService.getAllTodos())
  .setInitialData([])  // Start with an empty array
  .build();`;

  // setSuccessMsgFn method
  setSuccessMsgFnExample = `// Set a function to generate success messages
const userState = MiniStateBuilder
  .CreateWithInput((userId: string) => userService.getUser(userId))
  .setSuccessMsgFn((userId, user) => {
    if (user) {
      return \`User \${user.name} loaded successfully\`;
    }
    return undefined;  // Return undefined for no message
  })
  .build();`;

  // setOnTriggerFn method
  setOnTriggerFnExample = `// Set a function to be called when trigger() is invoked
const searchState = MiniStateBuilder
  .CreateWithInput((term: string) => searchService.search(term))
  .setOnTriggerFn((term) => {
    console.log('Search triggered:', term);
    analytics.track('search', { term });
  })
  .build();`;

  // build method
  buildExample = `// The build() method finalizes the builder and returns a MiniState instance
const state = MiniStateBuilder
  .Create(() => fetchData())
  .setInitialData([])
  .setSuccessMsgFn((data) => \`Loaded \${data.length} items\`)
  .setOnTriggerFn(() => console.log('Fetch triggered'))
  .build();  // Returns the configured MiniState`;

  // Complete usage examples
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
  private weatherState = MiniStateBuilder
    .Create(() => this.weatherService.getCurrentWeather())
    .setInitialData(null)
    .setSuccessMsgFn((weather) => 
      \`Weather updated: \${weather.temperature}°C, \${weather.conditions}\`
    )
    .build();
  
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

  inputExample = `// Example with input parameter
import { Component, inject } from '@angular/core';
import { MiniStateBuilder } from '@spider-baby/mini-state';
import { UserService } from './user.service';
import { User } from './user.model';

@Component({
  selector: 'app-user-profile',
  template: \`
    <div class="user-search">
      <h2>User Profile</h2>
      
      <div class="search-input">
        <input [(ngModel)]="userId" placeholder="Enter User ID">
        <button [disabled]="loading()" (click)="loadUser()">
          {{ loading() ? 'Loading...' : 'Load User' }}
        </button>
      </div>
      
      @if(errorMsg()) {
        <div class="error-message">
          {{ errorMsg() }}
        </div>
      }
      
      @if(successMsg()) {
        <div class="success-message">
          {{ successMsg() }}
        </div>
      }
      
      @if(user()) {
        <div class="user-profile">
          <h3>{{ user().name }}</h3>
          <p>Email: {{ user().email }}</p>
          <p>Role: {{ user().role }}</p>
        </div>
      }
    </div>
  \`
})
export class UserProfileComponent {
  private userService = inject(UserService);
  
  userId = '';
  
  // Create a MiniState for loading user data
  private userState = MiniStateBuilder
    .CreateWithInput((id: string) => this.userService.getUserById(id))
    .setSuccessMsgFn((id, user) => 
      user ? \`User \${user.name} loaded successfully\` : undefined
    )
    .setOnTriggerFn((id) => {
      console.log(\`Loading user with ID: \${id}\`);
      this.analytics.trackEvent('user_profile_view', { userId: id });
    })
    .build();
  
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
    
    this.userState.resetMessages();
    this.userState.trigger(this.userId);
  }
}`;
}