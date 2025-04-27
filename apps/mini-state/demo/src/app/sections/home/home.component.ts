import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { HighlightModule } from 'ngx-highlightjs';
import { HomeDemoComponent } from './home-demo/home-demo.component';

@Component({
  selector: 'sb-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    RouterModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatDividerModule,
    HighlightModule,
    HomeDemoComponent
  ]
})
export class HomeComponent {
  // Code snippets for the home page
  basicExample = `// Create a MiniState for user data
const userState = new MiniState<string, User>(
  (userId) => userService.getUser(userId)
);

// Use signal-based state in your template
@if(loading()) {
  <loading-spinner></loading-spinner>
}

@if(errorMsg()) {
  <error-alert>{{ errorMsg() }}</error-alert>
}

@if(user()) {
  <user-profile [user]="user()"></user-profile>
}`;

  builderExample = `// Create a state with the fluent builder API
const userState = MiniStateBuilder
  .CreateWithInput((userId: string) => userService.getUser(userId))
  .setInitialData(null)
  .setSuccessMsgFn((userId, user) => 
    \`User \${user.name} loaded successfully!\`)
  .build();

// Trigger the state
userState.trigger('user-123');`;

  crudExample = `// CRUD operations made easy
const userCrudState = MiniCrudState.Create(
  (filter) => userService.getAll(filter)
)
.setAddState(
  (user) => userService.create(user),
  (user) => \`User \${user.name} created!\`
)
.setUpdateState(
  (user) => userService.update(user),
  (user) => \`User \${user.name} updated!\`
)
.setDeleteState(
  (user) => userService.delete(user.id),
  (user) => \`User \${user.name} deleted!\`
);`;

  // Features to highlight
  features = [
    {
      title: 'Signals-Based State',
      description: 'Built on Angular signals for reactive, fine-grained updates with optimal performance',
      icon: 'bolt'
    },
    {
      title: 'Simplified Error Handling',
      description: 'Automatic error capture and exposure through signals and observables',
      icon: 'error_outline'
    },
    {
      title: 'Built-in Loading State',
      description: 'Track loading states with zero boilerplate',
      icon: 'hourglass_empty'
    },
    {
      title: 'Success Messaging',
      description: 'Generate and display operation success messages easily',
      icon: 'check_circle_outline'
    },
    {
      title: 'CRUD Operations',
      description: 'Specialized support for collections with add, update, and delete operations',
      icon: 'list_alt'
    },
    {
      title: 'Utilities for Combining States',
      description: 'Combine multiple states for unified loading, error, and success handling',
      icon: 'merge_type'
    }
  ];
}
