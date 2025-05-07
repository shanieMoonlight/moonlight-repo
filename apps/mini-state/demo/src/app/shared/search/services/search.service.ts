import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { devConsole } from '@spider-baby/dev-console';
import * as lunr from 'lunr';
import { BehaviorSubject, catchError, combineLatest, debounceTime, distinctUntilChanged, filter, ignoreElements, map, of, shareReplay, Subject, switchMap, tap } from 'rxjs';

//######################################################//

export interface SearchDocument {
  id: string;
  title: string;
  content: string;
  description: string;
  route: string;
}

//======================================================//

export class SearchResult {
  constructor(
    public document: SearchDocument,
    public score: number
  ) { }
}

//######################################################//

const DOC_JSON = '/search/search-documents.json'
const IDX_JSON = '/search/search-index.json'

//######################################################//

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  private http = inject(HttpClient)

  //-------------------------------//

  private _loadErrorSub$ = new Subject<Error>();
  error$ = this._loadErrorSub$.asObservable()
  error = toSignal(this._loadErrorSub$)
  errorMsg$ = this._loadErrorSub$.pipe(
    map((error) => error.message || 'Unknown error occurred')
  )
  errorMsg = toSignal(this.errorMsg$);

  //- - - - - - - - - - - - - - - -//

  private _isLoading$ = new BehaviorSubject<boolean>(true);
  isLoading$ = this._isLoading$.asObservable()
  isLoading = toSignal(this.isLoading$);

  //- - - - - - - - - - - - - - - -//

  private documents$ = this.http.get<Record<string, SearchDocument>>(DOC_JSON).pipe(
    tap(() => this._isLoading$.next(false)),
    catchError(error => this.handleLoadError(error)),
  )

  //- - - - - - - - - - - - - - - -//

  private _searchIndex$ = this.http.get<any>(IDX_JSON).pipe(
    map((indexData) => lunr.Index.load(indexData)),
    catchError(error => this.handleLoadError(error)),
  )
  readonly searchIndex$ = this._searchIndex$
  readonly searchIndex = toSignal(this._searchIndex$);


  //- - - - - - - - - - - - - - - -//

  private _searchTerm$ = new BehaviorSubject<string>('');
  readonly searchTerm$ = this._searchTerm$.pipe(
    debounceTime(300),
    distinctUntilChanged(),
    shareReplay(1)
  );
  readonly searchTerms = toSignal(this._searchTerm$);

  readonly searchResults$ = combineLatest([this.searchTerm$, this._searchIndex$, this.documents$]).pipe(
    filter((data): data is [string, lunr.Index, Record<string, SearchDocument>] => {
      const [term, searchIndex, documents] = data;
      return !!term && !!searchIndex && !!documents;
    }),
    tap(() => this._isLoading$.next(true)),
    map(([term, searchIndex, documents]) => this.performSearch(term, searchIndex, documents)),
    tap(() => this._isLoading$.next(false)),
    tap((X) => console.log(X))
  )
  searchResults = toSignal(this.searchResults$)


  //-------------------------------//

  search = (term: string): void =>
    this._searchTerm$.next(term);

  //-------------------------------//

  private performSearch(term: string, searchIndex: lunr.Index, documents: Record<string, SearchDocument>): SearchResult[] {
    if (!term.trim() || !searchIndex)
      return [];

    try {
      devConsole.log('Performing search:', term, searchIndex, documents);
      const results = searchIndex.search(term);
      console.log('Search results:', results.map(result => new SearchResult(documents[result.ref], result.score)))
      return results.map(result => new SearchResult(documents[result.ref], result.score))
        .filter(result => !!result.document); // Filter out undefined documents

        

    } catch (e) {
      console.error('Search error:', e);
      return []
    }
  }

  //-------------------------------//

  private handleLoadError(error: Error) {
    console.error('Search index loading error:', error);
    this._loadErrorSub$.next(error);
    this._isLoading$.next(false);
    return of(null);
  }

  //-------------------------------//


}//Cls