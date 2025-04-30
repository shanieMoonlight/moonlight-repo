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

  // Create a MiniState for album search
  private albumState = new MiniState<string, Album[]>(
    // Load albums based on search term
    (term: string) => this._albumService.getAllFiltered(term),
    this.destroyRef,
    // Initial empty array
    [],
  ).setOnSuccessFn((term: string, albums: Album[]) =>  // Success message function
    albums.length > 0
      ? `Found ${albums.length} albums matching "${term}"`
      : undefined)


  // Track if a search has been performed
  protected _noDataMessage = computed(() =>
    this.albumState.wasTriggered() && !this.errorMsg() && !this.albums()?.length
      ? 'No albums found matching your search criteria.'
      : undefined)


  // Expose signals to the template
  protected albums = this.albumState.data;
  protected loading = this.albumState.loading;
  protected errorMsg = this.albumState.errorMsg;
  protected successMsg = this.albumState.successMsg;

  //- - - - - - - - - - - - - //


  constructor() {
    // Listen for errors and handle them
    this.albumState.errorMsg$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(error => {
        if (error) {
          console.error('Search error:', error);
          // Could log to error monitoring service here
        }
      })
  }

  //- - - - - - - - - - - - - //


  // Search albums based on the current search term
  search() {
    if (!this.searchTerm.trim()) {
      console.log('Please enter a search term');
      return;
    }

    this.albumState.trigger(this.searchTerm);
  }


  // Clear the search results
  clearSearch = () =>
    this.searchTerm = '';


}//Cls