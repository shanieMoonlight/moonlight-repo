import { ChangeDetectionStrategy, Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatEverythingModule } from '@spider-baby/material-theming/utils';
import { MiniStateBuilder } from '@spider-baby/mini-state';
import { debounceTime, distinctUntilChanged, filter, map, tap } from 'rxjs';
import { Album } from '../../data/album';
import { DummyAlbumIoService } from '../../io/dummy/dummy-album-io.service';
import { MainDemoHeaderComponent } from '../../ui/demo-header/demo-header.component';
import { SbCodeTabsTsHtmlComponentCodeComponent } from '@spider-baby/ui-code-samples';


///#############################################//

const TS_CODE = `
//Example using MiniState intialized with MiniStateBuilder
//and using a custom service to fetch data
//Just using if statements to demonstrate the functionality clearer
@Component({
  selector: 'sb-main-demo-search',
  imports: [
    MatEverythingModule,
    MainDemoHeaderComponent,
    RouterModule,
    ReactiveFormsModule
  ],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainDemoSearchComponent {

  private _ioService = inject(DummyAlbumIoService);
  private destroyRef = inject(DestroyRef);

  //- - - - - - - - - - - - - //

  protected _searchControl = new FormControl('')
  protected _searchTerm$ = this._searchControl.valueChanges
    .pipe(
      map(term => term?.trim() ?? ''),
      filter((term): term is string => term !== null),
      filter(term => term == '' || term.length > 2), //'' for clear search and >2 for regular search
      distinctUntilChanged(),
      tap(term => console.log('Search term:', term)),
      debounceTime(300)
    )

  // Create a MiniState for album search
  private userState = MiniStateBuilder.CreateWithObservableInput(
    this._searchTerm$, //<-- Observable Input
    (term: string) => this._ioService.search(term),   // Load users based on search term
    [],// Initial empty array
  ).setOnSuccessFn((term: string, users: Album[]) =>  // Success message function
    users.length > 0
      ? \`Found \${users.length} users matching "\${term}"\`
      : undefined)

      
  // Track if a search has been performed
  protected _noDataMessage = computed(() =>
    this.userState.prevInput() && !this.errorMsg() && !this.users()?.length
      ? 'No users found matching your search criteria.'
      : undefined)


  // Expose signals to the template
  protected users = this.userState.data;
  protected loading = this.userState.loading;
  protected errorMsg = this.userState.errorMsg;
  protected successMsg = this.userState.successMsg;

  //----------------------------//

  constructor() {
    // Listen for errors and handle them
    this.userState.errorMsg$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(error => {
        if (error) {
          console.error('Search error:', error);
          // Could log to error monitoring service here
        }
      })
  }

  //----------------------------//

  // Clear the search results
  clearSearch = () =>
    this._searchControl.reset()


}`

///#############################################//

const HTML_CODE = `
  
//Not using input triggered popups (like SbMatNotificationsModalComponent) 
//just using if statements to demonstrate the functionality clearer

<sb-main-demo-header/>


<div class="search-container">
  <h2>User Search</h2>
  
  <!-- Search input -->
  <div class="search-form">
    <mat-form-field>
      <mat-label>Search Users</mat-label>
      <input matInput      
       [formControl]="_searchControl"
       placeholder="Enter name or email">
    </mat-form-field>
    <button mat-raised-button 
            class="primary" 
            [matTooltip]="'Refresh data with no filtering'"
            [disabled]="loading() || !_searchControl.value" 
            (click)="clearSearch()">
      Clear
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
    <h3>Search Results</h3>
    <div class="results">
      @for(user of users(); track user.id) {
        <mat-card>
          <mat-card-header>
            <mat-card-title>{{ user.title }}</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <p>{{ user.description }}</p>
          </mat-card-content>
          <mat-card-actions>
            <button mat-button [routerLink]="['/detail', user.id]">
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
`

///#############################################//

//Example using MiniState intialized with MiniStateBuilder
// and using a custom service to fetch data
//Not using input triggered popups (like SbMatNotificationsModalComponent) for demonstration purposes
// and to keep the example simple
@Component({
  selector: 'sb-main-demo-search',
  imports: [
    MatEverythingModule,
    MainDemoHeaderComponent,
    RouterModule,
    ReactiveFormsModule,
    SbCodeTabsTsHtmlComponentCodeComponent
  ],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainDemoSearchComponent {

  private _ioService = inject(DummyAlbumIoService);
  private destroyRef = inject(DestroyRef);

  //- - - - - - - - - - - - - //

  protected _searchControl = new FormControl('')
  protected _searchTerm$ = this._searchControl.valueChanges
    .pipe(
      map(term => term?.trim() ?? ''),
      filter((term): term is string => term !== null),
      filter(term => term == '' || term.length > 2), //'' for clear search and >2 for regular search
      distinctUntilChanged(),
      tap(term => console.log('Search term:', term)),
      debounceTime(300)
    )

  // Create a MiniState for album search
  private userState = MiniStateBuilder.CreateWithObservableInput(
    this._searchTerm$, //<-- Observable Input
    (term: string) => this._ioService.getAllFiltered(term),   // Load users based on search term
    [],// Initial empty array
  ).setOnSuccessFn((term: string, users: Album[]) =>  // Success message function
    users.length > 0
      ? `Found ${users.length} users matching "${term}"`
      : undefined)


  // Track if a search has been performed
  protected _noDataMessage = computed(() =>
    this.userState.prevInput() && !this.errorMsg() && !this.users()?.length
      ? 'No users found matching your search criteria.'
      : undefined)


  // Expose signals to the template
  protected users = this.userState.data;
  protected loading = this.userState.loading;
  protected errorMsg = this.userState.errorMsg;
  protected successMsg = this.userState.successMsg;

  //----------------------------//

  constructor() {
    // Listen for errors and handle them
    this.userState.errorMsg$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(error => {
        if (error) {
          console.error('Search error:', error);
          // Could log to error monitoring service here
        }
      })
  }

  //----------------------------//

  // Clear the search results
  clearSearch = () =>
    this._searchControl.reset()

  //--------------------------//

  protected _tsCode = signal(TS_CODE);

  protected _htmlCode = signal(HTML_CODE);

}//Cls
