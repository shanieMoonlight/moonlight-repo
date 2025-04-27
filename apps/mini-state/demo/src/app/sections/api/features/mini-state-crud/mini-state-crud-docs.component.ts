import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTabsModule } from '@angular/material/tabs';
import { HighlightModule } from 'ngx-highlightjs';

@Component({
  selector: 'sb-mini-state-crud-docs',
  templateUrl: './mini-state-crud-docs.component.html',
  styleUrls: ['./mini-state-crud-docs.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [MatExpansionModule, MatTabsModule, HighlightModule]
})
export class MiniStateCrudDocsComponent {
  // Core concept
  conceptExample = `// MiniCrudState extends MiniState to handle CRUD operations
import { MiniCrudState } from '@spider-baby/mini-state';

// Create a CRUD state for a collection of items
const userCrudState = MiniCrudState.Create(
  (filter) => userService.getAll(filter)
);

// Configure add/update/delete operations
userCrudState
  .setAddState(
    // Add operation API call
    (user) => userService.create(user),
    // Success message generator
    (user) => \`User \${user.name} created successfully!\`
  )
  .setUpdateState(
    // Update operation API call
    (user) => userService.update(user),
    // Success message generator
    (user) => \`User \${user.name} updated successfully!\`
  )
  .setDeleteState(
    // Delete operation API call
    (user) => userService.delete(user.id),
    // Success message generator 
    (user) => \`User \${user.name} deleted successfully!\`
  );

// Use the state for various operations
userCrudState.trigger({}); // Get all users (with empty filter)
userCrudState.triggerAdd(newUser); // Create a user
userCrudState.triggerUpdate(updatedUser); // Update a user
userCrudState.triggerDelete(userToDelete); // Delete a user`;

  // Create method
  createExample = `// Create a MiniCrudState instance
const productCrudState = MiniCrudState.Create(
  (filter: ProductFilter) => productService.getAll(filter)
);

// The Create method returns a fully configured MiniCrudState instance
// It initializes the collection with an empty array ([])`;

  // Method examples
  setAddStateExample = `// Configure the add operation
userCrudState.setAddState(
  // Add operation function - returns the created item from the API
  (user: User) => userService.create(user),
  
  // Optional: Success message function
  (user: User, createdUser: User) => 
    \`User \${createdUser?.name || user.name} created successfully!\`,
  
  // Optional: Function to call when add is triggered
  (user: User) => {
    console.log('Creating user:', user);
    analytics.track('user_create_started');
  }
);

// The added item is automatically appended to the data array`;

  setUpdateStateExample = `// Configure the update operation
userCrudState.setUpdateState(
  // Update operation function - returns the updated item
  (user: User) => userService.update(user),
  
  // Optional: Success message function
  (user: User, updatedUser: User) => 
    \`User \${updatedUser?.name || user.name} updated successfully!\`,
  
  // Optional: Function to call when update is triggered
  (user: User) => {
    console.log('Updating user:', user);
    analytics.track('user_update_started');
  }
);

// The updated item automatically replaces the matching item in the array`;

  setDeleteStateExample = `// Configure the delete operation
userCrudState.setDeleteState(
  // Delete operation function
  (user: User) => userService.delete(user.id),
  
  // Success message function (required for delete)
  (user: User, result: any) => 
    \`User \${user.name} deleted successfully!\`,
  
  // Optional: Function to call when delete is triggered
  (user: User) => {
    console.log('Deleting user:', user);
    analytics.track('user_delete_started');
  }
);

// The deleted item is automatically removed from the array`;

  setEqualsFnExample = `// By default, items are compared by their 'id' property
// You can customize this behavior with setEqualsFn

// Example: comparing items by a composite key
userCrudState.setEqualsFn((item1, item2) => 
  item1?.orgId === item2?.orgId && item1?.userId === item2?.userId
);`;

  // Complete usage example
  completeExample = `import { Component, DestroyRef, computed, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MiniCrudState } from '@spider-baby/mini-state';
import { UserService } from './user.service';
import { User, UserFilter } from './user.model';

@Component({
  selector: 'app-user-management',
  template: \`
    <div class="user-management">
      <!-- Header with actions -->
      <div class="header">
        <h2>User Management</h2>
        <div class="actions">
          <button mat-raised-button color="primary" (click)="openAddUserDialog()">
            Add User
          </button>
          <button mat-button (click)="refresh()">Refresh</button>
        </div>
      </div>
      
      <!-- Filters -->
      <div class="filters">
        <mat-form-field>
          <mat-label>Search</mat-label>
          <input matInput [(ngModel)]="searchTerm" placeholder="Search users...">
        </mat-form-field>
        <button mat-button (click)="applyFilters()">Apply</button>
      </div>
      
      <!-- User Table -->
      <div class="table-container">
        <mat-progress-bar *ngIf="loading()" mode="indeterminate"></mat-progress-bar>
        <table mat-table [dataSource]="users()">
          <!-- Name Column -->
          <ng-container matColumnDef="name">
            <th mat-header-cell *matHeaderCellDef>Name</th>
            <td mat-cell *matCellDef="let user">{{ user.name }}</td>
          </ng-container>
          
          <!-- Email Column -->
          <ng-container matColumnDef="email">
            <th mat-header-cell *matHeaderCellDef>Email</th>
            <td mat-cell *matCellDef="let user">{{ user.email }}</td>
          </ng-container>
          
          <!-- Actions Column -->
          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef>Actions</th>
            <td mat-cell *matCellDef="let user">
              <button mat-icon-button (click)="editUser(user)">
                <mat-icon>edit</mat-icon>
              </button>
              <button mat-icon-button color="warn" (click)="deleteUser(user)">
                <mat-icon>delete</mat-icon>
              </button>
            </td>
          </ng-container>
          
          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
        </table>
        
        <!-- Empty state -->
        <div *ngIf="!loading() && users().length === 0" class="empty-state">
          No users found. Try adjusting your filters or add a new user.
        </div>
      </div>
    </div>
  \`
})
export class UserManagementComponent {
  private userService = inject(UserService);
  private snackBar = inject(MatSnackBar);
  private destroyRef = inject(DestroyRef);
  
  // Table configuration
  displayedColumns = ['name', 'email', 'actions'];
  
  // Filter state
  searchTerm = '';
  
  // Create the CRUD state for users
  private userCrudState = MiniCrudState.Create<UserFilter, User>(
    (filter: UserFilter) => this.userService.getAll(filter)
  )
  .setAddState(
    (user: User) => this.userService.create(user),
    (user: User) => \`User \${user.name} created successfully!\`
  )
  .setUpdateState(
    (user: User) => this.userService.update(user),
    (user: User) => \`User \${user.name} updated successfully!\`
  )
  .setDeleteState(
    (user: User) => this.userService.delete(user.id),
    (user: User) => \`User \${user.name} deleted successfully!\`
  );
  
  // Expose state to the template
  users = this.userCrudState.data;
  loading = this.userCrudState.loading;
  
  constructor() {
    // Initial data load
    this.loadUsers();
    
    // Show success/error messages with snackbar
    this.userCrudState.successMsg$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(msg => {
        if (msg) this.snackBar.open(msg, 'Close', { duration: 3000 });
      });
      
    this.userCrudState.errorMsg$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(msg => {
        if (msg) this.snackBar.open(msg, 'Error', { 
          duration: 5000,
          panelClass: 'error-snackbar'
        });
      });
  }
  
  // Load users with current filters
  loadUsers() {
    const filter: UserFilter = {
      searchTerm: this.searchTerm
    };
    this.userCrudState.trigger(filter);
  }
  
  // Refresh the user list
  refresh() {
    this.userCrudState.retrigger();
  }
  
  // Apply search filters
  applyFilters() {
    this.loadUsers();
  }
  
  // Open dialog to add a new user
  openAddUserDialog() {
    const dialogRef = this.dialog.open(UserFormDialogComponent);
    
    dialogRef.afterClosed().subscribe(newUser => {
      if (newUser) {
        this.userCrudState.triggerAdd(newUser);
      }
    });
  }
  
  // Edit an existing user
  editUser(user: User) {
    const dialogRef = this.dialog.open(UserFormDialogComponent, {
      data: { user }
    });
    
    dialogRef.afterClosed().subscribe(updatedUser => {
      if (updatedUser) {
        this.userCrudState.triggerUpdate(updatedUser);
      }
    });
  }
  
  // Delete a user
  deleteUser(user: User) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { 
        title: 'Delete User',
        message: \`Are you sure you want to delete \${user.name}?\`
      }
    });
    
    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.userCrudState.triggerDelete(user);
      }
    });
  }
}`;
}