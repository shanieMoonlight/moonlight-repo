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
  completeExample = `import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { SbMatNotificationsModalComponent } from '@spider-baby/mat-notifications';
import { MatEverythingModule } from '@spider-baby/material-theming/utils';
import { MiniCrudState } from '@spider-baby/mini-state';
import { User } from '../../data/user';
import { UserService } from '../../services/user.service';
import { UserFormModalComponent, NewUserDialogData } from '../../ui/user/form-modal/form-modal.component';
import { DataTableComponent } from '../../ui/table/data-table.component';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [
    MatEverythingModule,
    DataTableComponent,
    SbMatNotificationsModalComponent,
    ReactiveFormsModule
  ],
  template: \`
    <div class="content-container">
      <div class="search-form">
        <mat-form-field>
          <mat-label>Search Users</mat-label>
          <input matInput      
           [formControl]="_searchControl"
           placeholder="Enter name or email">
        </mat-form-field>
        <div class="btns">
          <button mat-raised-button 
            class="primary" 
            [matTooltip]="'Search data'"
            [disabled]="_loading() || !_searchControl.value" 
            (click)="filterData(_searchControl.value!)">
            Search
          </button>
          <button mat-raised-button 
            class="primary" 
            [matTooltip]="'Refresh data with no filtering'"
            [disabled]="_loading() || !_searchControl.value" 
            (click)="clearSearch()">
            Clear
          </button>
        </div>
      </div>
      
      <sb-data-table 
        [data]="_data()" 
        [displayColumns]="displayColumns()"
        [isLoading]="_loading()" 
        [includeActions]="true"
        [title]="'User Management'"
        [emptyMessage]="'No users found. Try refreshing the data.'"
        [loadingMessage]="'Loading users...'"
        [itemName]="'user'"
        [iconName]="'person'"
        [canAddItem]="true"
        (refresh)="refresh()"
        (addItem)="openAddUserDialog()"
        (editItem)="openEditUserDialog($event)"
        (deleteItem)="onDeleteUser($event)"/>
    </div>

    <sb-notifications-modal-mat
      [errorMsg]="_errorMsg()"
      [successMsg]="_successMsg()" 
      [isLoading]="_loading()" 
      [loadingMessage]="'Loading users...'"/>
  \`,
  styleUrl: './user-management.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserManagementComponent {

  private _dialog = inject(MatDialog);
  private _userService = inject(UserService);

  //- - - - - - - - - - - - - //

  protected displayColumns = signal(['id', 'name', 'email', 'role']);
  
  protected _searchControl = new FormControl('');

  //- - - - - - - - - - - - - //

  private _crudState = MiniCrudState
    .Create<string | undefined, User>((searchTerm) => this._userService.getAllFiltered(searchTerm))
    .setAddState(
      (user: User) => this._userService.create(user),
      (user) => \`User \${user.name} added successfully!\`
    )
    .setUpdateState(
      (user: User) => this._userService.update(user),
      (user) => \`User \${user.name} updated successfully!\`
    )
    .setDeleteState(
      (user: User) => this._userService.delete(user.id!),
      (user) => \`User \${user.name} deleted successfully\`
    )
    .trigger(''); // Trigger immediately with no filter

  protected _data = computed(() => this._crudState.data() ?? []);
  protected _successMsg = this._crudState.successMsg;
  protected _errorMsg = this._crudState.errorMsg;
  protected _loading = this._crudState.loading;

  //--------------------------//

  protected refresh = () =>
    this._crudState.trigger('');

  protected onDeleteUser = (user: User) =>
    this._crudState.triggerDelete(user);

  // Clear the search results
  protected clearSearch() {
    this._searchControl.reset();
    this.refresh();
  }

  protected filterData = (searchTerm?: string) =>
    this._crudState.trigger(searchTerm);

  protected openAddUserDialog = () =>
    this.openUserDialog()
      .afterClosed()
      .subscribe((user) => {
        if (user) {
          this._crudState.triggerAdd(user);
        }
      });

  protected openEditUserDialog = (user: User) =>
    this.openUserDialog(user)
      .afterClosed()
      .subscribe((updatedUser) => {
        if (updatedUser) {
          this._crudState.triggerUpdate(updatedUser);
        }
      });

  //--------------------------//

  private openUserDialog(user?: User): MatDialogRef<UserFormModalComponent, User | undefined> {
    return this._dialog.open(UserFormModalComponent, {
      width: '600px',
      data: new NewUserDialogData(user),
    });
  }
}`;
}