import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import * as lunr from 'lunr';
import { BehaviorSubject, combineLatest, debounceTime, distinctUntilChanged, filter, map, shareReplay, switchMap, tap } from 'rxjs';

//######################################################//

export interface SearchDocument {
  id: string;
  title: string;
  content: string;
  description: string;
  route: string;
}

//======================================================//

export interface SearchResult {
  document: SearchDocument;
  score: number;
}

//######################################################//

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  private http = inject(HttpClient)

  //-------------------------------//

  private searchIndex: lunr.Index | null = null;
  private documents: Record<string, SearchDocument> = {};

  private documents$ = combineLatest([
    this.http.get<any>('/search/search-index.json'),
    this.http.get<Record<string, SearchDocument>>('/search/search-documents.json')
  ]).pipe(
    tap(() => this._isLoading$.next(false))
  )

  private _searchIndex$ = this.documents$.pipe(
    map(([indexData]) => lunr.Index.load(indexData))
  )
  readonly searchIndex$ = this._searchIndex$
  // searchIndex = toSignal(this._searchIndex$);
  

  private _searchTerm$ = new BehaviorSubject<string>('');
  readonly searchTerm$ = this._searchTerm$.pipe(
    debounceTime(300),
    distinctUntilChanged(),
    shareReplay(1)
  );
  searchTerms = toSignal(this._searchTerm$);
  

  searchResults$ = this.searchTerm$.pipe(
    filter(term => !!term && !!this.searchIndex),
    map(term => this.performSearch(term)),
  )
  searchResults = toSignal(this.searchResults$);


  private _isLoading$ = new BehaviorSubject<boolean>(true);
  isLoading$ = this._isLoading$.asObservable()
  isLoading = toSignal(this.isLoading$);

  //-------------------------------//

  constructor() {
    this.initializeSearch();
  }

  //-------------------------------//

  search = (term: string): void =>
    this._searchTerm$.next(term);

  //-------------------------------//

  private initializeSearch(): void {
    this._isLoading$.next(true);

    combineLatest([
      this.http.get<any>('/search/search-index.json'),
      this.http.get<Record<string, SearchDocument>>('/search/search-documents.json')
    ]).subscribe({
      next: ([indexData, documents]) => {
        this.searchIndex = lunr.Index.load(indexData);
        this.documents = documents;
        this._isLoading$.next(false);

        // // Perform initial search if there's a term
        // if (this._searchTerm$.value)
        //   this.performSearch(this._searchTerm$.value);

      },
      error: (err) => {
        console.error('Failed to load search index', err);
        this._isLoading$.next(false);
      }
    });

    // Subscribe to search terms changes
    // this._searchTerm$.pipe(
    //   switchMap(term => {
    //     this.performSearch(term);
    //     return [];
    //   })
    // ).subscribe();
  }

  //-------------------------------//

  private performSearch(term: string): SearchResult[] {

    if (!term.trim() || !this.searchIndex)
      return [];

    try {
      const results = this.searchIndex.search(term);
      return results.map(result => ({
        document: this.documents[result.ref],
        score: result.score
      })).filter(result => result.document); // Filter out undefined documents

    } catch (e) {
      console.error('Search error:', e);
      return []
    }
  }


}//Cls