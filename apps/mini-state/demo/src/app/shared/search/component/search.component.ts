import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterModule } from '@angular/router';
import { SearchService } from '../services/search.service';
import {MatProgressBarModule} from '@angular/material/progress-bar';

@Component({
  selector: 'sb-search',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    RouterModule,
    MatProgressBarModule
  ],
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

  private searchService = inject(SearchService)

  //- - - - - - - - - - - - - - - -//

  searchTerm = '';
  searchResults$ = this.searchService.searchResults$;
  searchResults = this.searchService.searchResults;
  isLoading$ = this.searchService.isLoading$;
  isLoading = this.searchService.isLoading;
  error = this.searchService.errorMsg

  //-------------------------------//

  ngOnInit(): void {
    this.searchService.searchTerm$.subscribe(term => {
      this.searchTerm = term;
    });
  }

  //-------------------------------//
  
  onSearch(): void {
    this.searchService.search(this.searchTerm);
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.searchService.search('');
  }

  highlightMatches(text: string, searchTerm: string): string {
    if (!searchTerm || !text) {
      return text;
    }

    // Simple highlighting - in a production app you might want something more sophisticated
    const regex = new RegExp(`(${searchTerm})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
  }


}