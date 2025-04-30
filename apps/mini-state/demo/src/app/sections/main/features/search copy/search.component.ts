import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatEverythingModule } from '@spider-baby/material-theming/utils';
import { MiniState } from '@spider-baby/mini-state';
import { Album } from '../../data/album';
import { DummyAlbumIoService } from '../../io/dummy/dummy-album-io.service';
import { MainDemoHeaderComponent } from '../../ui/demo-header/demo-header.component';


///#############################################//

const TS_CODE = `import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { MiniStateBuilder } from '@spider-baby/mini-state';
import { DummyAlbumIoService } from '../../io/dummy/dummy-album-io.service';

@Component({
  selector: 'sb-main-demo-search',
  templateUrl: './search.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainDemoSearchComponent {

  private _ioService = inject(DummyAlbumIoService);
  

  protected _state = MiniStateBuilder
    .Create(() => this._ioService.getAll())
    .trigger();//Trigger immediately

  protected _data = computed(() => this._state.data() ?? []);


  protected refresh = () =>
    this._state.trigger();

}`

///#############################################//

const HTML_CODE = `
  
<div class='content-container'>
  <sb-data-table 
    [data]="_data()" 
    [displayColumns]="_displayColumns()"
    [isLoading]="_loading()" 
    [includeActions]="false"
    [title]="'Album Collection'"
    [emptyMessage]="'No albums found. Try refreshing the data.'"
    [loadingMessage]="'Loading albums...'"
    [itemName]="'album'"
    [iconName]="'album'"
    (refresh)="refresh()"/>
</div>


<sb-notifications-modal-mat
    [errorMsg]="_errorMsg()"
    [successMsg]="_successMsg()" 
    [isLoading]="_loading()" 
    [loadingMessage]="'Loading albums...'"/>
`

///#############################################//

//Example using MiniState intialized with constructor instead of Builder
// and using a custom service to fetch data
//Not using inpu triggered popups (like SbMatNotificationsModalComponent) for demonstration purposes
// and to keep the example simple

@Component({
  selector: 'sb-main-demo-search',
  imports: [
    MatEverythingModule,
    CommonModule,
    MainDemoHeaderComponent,
    RouterModule,
    FormsModule
  ],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainDemoSearchComponent {

  private _albumService = inject(DummyAlbumIoService);
  private destroyRef = inject(DestroyRef);

  //- - - - - - - - - - - - - //

  // Search state
  searchTerm = '';

  // Create a MiniState for user search
  private userState = new MiniState<string, Album[]>(
    // Load users based on search term
    (term: string) => this._albumService.search(term),
    this.destroyRef,
    // Initial empty array
    [],
  ).setOnSuccessFn((term: string, users: Album[]) =>  // Success message function
    users.length > 0
      ? `Found ${users.length} users matching "${term}"`
      : undefined)


  // Track if a search has been performed
  protected _noDataMessage = computed(() =>
    this.userState.wasTriggered() && !this.errorMsg() && !this.users()?.length
      ? 'No users found matching your search criteria.'
      : undefined)


  // Expose signals to the template
  protected users = this.userState.data;
  protected loading = this.userState.loading;
  protected errorMsg = this.userState.errorMsg;
  protected successMsg = this.userState.successMsg;

  //- - - - - - - - - - - - - //


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

  //- - - - - - - - - - - - - //


  // Search users based on the current search term
  search() {
    if (!this.searchTerm.trim()) {
      console.log('Please enter a search term');
      return;
    }

    this.userState.trigger(this.searchTerm);
  }


  // Clear the search results
  clearSearch = () =>
    this.searchTerm = '';


}//Cls