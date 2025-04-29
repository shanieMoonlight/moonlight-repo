import { ChangeDetectionStrategy, Component, DestroyRef, computed, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MiniState } from '@spider-baby/mini-state';
import { UserService } from './user.service';
import { User } from './user.model';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTabsModule } from '@angular/material/tabs';
import { HighlightModule } from 'ngx-highlightjs';
import { MatFormField, MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatProgressBar, MatProgressBarModule } from '@angular/material/progress-bar';
import { MatCardModule } from '@angular/material/card';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'sb-user-search',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    MatProgressBarModule,
    MatCardModule,
    RouterModule
  ],
  template: `
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
      @if(!!users()?.length) {
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
      @if(searchPerformed() && users()?.length) {
        <div class="empty-state">
          No users found matching your search criteria.
        </div>
      }
    </div>
  `
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
    this.destroyRef,
    // Initial empty array
    [],
  ).setOnSuccessFn((term: string, users: User[]) =>  // Success message function
    users.length > 0
      ? `Found ${users.length} users matching "${term}"`
      : undefined)



  // Track if a search has been performed
  protected searchPerformed = computed(() => 
    // Return true if we have either loaded data or had an error
    !!this.userState.data()?.length || !!this.userState.errorMsg()
 );



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
      console.log('Please enter a search term');
      return;
    }

    this.userState.trigger(this.searchTerm);
  }



  // Clear the search results
  clearSearch() {
    this.searchTerm = '';
  }

  
}