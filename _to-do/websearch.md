# Web Search & Lazy Loading Implementation Guide for Angular Applications

## Overview

This document provides a comprehensive guide to implementing both search functionality and lazy loading in Angular applications, covering client-side search, build-time indexing, and viewport-based component loading. The examples are tailored for Firebase hosting with prerendered static pages and modern Angular features.

## Table of Contents

1. [Lazy Loading Solutions](#lazy-loading-solutions)
2. [Build-Time Search Indexing (Lunr.js)](#build-time-search-indexing-lunrjs)
3. [Client-Side Search (Fuse.js)](#client-side-search-fusejs)
4. [Hybrid Search Approach](#hybrid-search-approach)
5. [Advanced Tagging & Filtering System](#advanced-tagging--filtering-system)
6. [Animation Strategies](#animation-strategies)
7. [Meta Tag Management for Search](#meta-tag-management-for-search)
8. [Performance Considerations](#performance-considerations)
9. [Implementation Recommendations](#implementation-recommendations)

---

## Lazy Loading Solutions

### 1. Angular @defer Blocks (Angular 17+)
Modern declarative approach for lazy loading components with built-in loading states.

```html
<!-- Basic defer with viewport trigger -->
@defer (on viewport) {
  <app-blog-card [post]="post" />
} @placeholder {
  <div class="skeleton-card">Loading...</div>
}

<!-- Advanced defer with multiple triggers and states -->
@defer (on viewport; prefetch on idle) {
  <app-blog-card [post]="post" />
} @loading (minimum 500ms) {
  <mat-spinner diameter="40"></mat-spinner>
} @placeholder {
  <div class="placeholder-card">
    <div class="skeleton-title"></div>
    <div class="skeleton-content"></div>
  </div>
} @error {
  <div class="error-card">Failed to load content</div>
}

<!-- In a loop with staggered loading -->
@for (post of posts; track post.id) {
  @defer (on viewport) {
    <app-blog-card [post]="post" />
  } @placeholder {
    <div class="skeleton-card" 
         [style.animation-delay]="(i * 100) + 'ms'">
      Loading...
    </div>
  }
}
```

**Pros:**
- Declarative and clean syntax
- Built-in loading states management
- Automatic prefetching options
- Type-safe and performant
- Native Angular support

**Cons:**
- Requires Angular 17+
- May have compatibility issues in some edge cases
- Less control over custom loading behavior

### 2. Custom LazyRenderDirective with Intersection Observer

**Structural Directive Approach (Recommended):**
```typescript
@Directive({
  selector: '[appLazyRender]',
  standalone: true
})
export class LazyRenderDirective implements OnInit, OnDestroy {
  private observer?: IntersectionObserver;
  private isVisible = false;
  
  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef
  ) {}

  ngOnInit() {
    // Create placeholder element
    this.createPlaceholder();
    
    // Set up intersection observer
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !this.isVisible) {
          this.loadContent();
          this.observer?.disconnect();
        }
      });
    }, {
      rootMargin: '50px', // Load 50px before entering viewport
      threshold: 0.1
    });

    // Observe the placeholder
    const placeholder = this.viewContainer.element.nativeElement;
    this.observer.observe(placeholder);
  }

  private createPlaceholder() {
    // Create placeholder view
    this.viewContainer.createEmbeddedView(this.templateRef, {
      $implicit: false, // loaded = false
      loading: true
    });
  }

  private loadContent() {
    this.isVisible = true;
    this.viewContainer.clear();
    
    // Create actual content view
    this.viewContainer.createEmbeddedView(this.templateRef, {
      $implicit: true, // loaded = true
      loading: false
    });
  }

  ngOnDestroy() {
    this.observer?.disconnect();
  }
}
```

**Usage Example:**
```html
<!-- In component template -->
<div *appLazyRender="let loaded; let loading = loading" 
     class="blog-card-container">
  
  <app-blog-card 
    *ngIf="loaded; else placeholder" 
    [post]="post"
    [@fadeInUp]>
  </app-blog-card>
  
  <ng-template #placeholder>
    <div class="skeleton-card" 
         [class.loading]="loading"
         [@pulseAnimation]>
      <div class="skeleton-title"></div>
      <div class="skeleton-content"></div>
      <div class="skeleton-footer"></div>
    </div>
  </ng-template>
</div>
```

### 3. CSS-Based Lazy Visibility Directive
Simpler approach using CSS transitions with Intersection Observer.

```typescript
@Directive({
  selector: '[appLazyVisible]',
  standalone: true
})
export class LazyVisibleDirective implements OnInit, OnDestroy {
  private observer?: IntersectionObserver;

  constructor(private element: ElementRef<HTMLElement>) {}

  ngOnInit() {
    // Set initial invisible state
    const el = this.element.nativeElement;
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('fade-in');
          this.observer?.disconnect();
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '20px'
    });

    this.observer.observe(el);
  }

  ngOnDestroy() {
    this.observer?.disconnect();
  }
}
```

**CSS Styles:**
```scss
.fade-in {
  opacity: 1 !important;
  transform: translateY(0) !important;
}

// Enhanced with staggered animation
.blog-grid {
  .blog-card {
    &:nth-child(1) { transition-delay: 0.1s; }
    &:nth-child(2) { transition-delay: 0.2s; }
    &:nth-child(3) { transition-delay: 0.3s; }
    &:nth-child(4) { transition-delay: 0.4s; }
    &:nth-child(5) { transition-delay: 0.5s; }
    &:nth-child(6) { transition-delay: 0.6s; }
  }
}
```

### 4. Deferred Grid Component for Lists
Specialized component for handling large lists with lazy loading.

```typescript
@Component({
  selector: 'app-deferred-grid',
  template: `
    <div class="deferred-grid" [class]="gridClass">
      @for (item of visibleItems(); track item.id) {
        <div class="grid-item" 
             appLazyVisible
             [style.animation-delay]="getAnimationDelay($index)">
          <ng-container 
            [ngTemplateOutlet]="itemTemplate"
            [ngTemplateOutletContext]="{$implicit: item, index: $index}">
          </ng-container>
        </div>
      }
      
      <!-- Load more trigger -->
      <div #loadMoreTrigger 
           class="load-more-trigger"
           *ngIf="hasMore()">
        <mat-spinner diameter="40"></mat-spinner>
      </div>
    </div>
  `,
  standalone: true,
  imports: [CommonModule, LazyVisibleDirective, MatProgressSpinnerModule]
})
export class DeferredGridComponent<T> implements OnInit, AfterViewInit {
  @Input() items = input.required<T[]>();
  @Input() itemTemplate = input.required<TemplateRef<any>>();
  @Input() batchSize = input(6);
  @Input() gridClass = input('');
  
  @ViewChild('loadMoreTrigger') loadMoreTrigger!: ElementRef;
  
  visibleItems = signal<T[]>([]);
  hasMore = computed(() => this.visibleItems().length < this.items().length);
  
  private observer?: IntersectionObserver;

  ngOnInit() {
    // Load initial batch
    this.loadMoreItems();
  }

  ngAfterViewInit() {
    if (this.loadMoreTrigger) {
      this.setupInfiniteScroll();
    }
  }

  private setupInfiniteScroll() {
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && this.hasMore()) {
          this.loadMoreItems();
        }
      });
    });

    this.observer.observe(this.loadMoreTrigger.nativeElement);
  }

  private loadMoreItems() {
    const currentLength = this.visibleItems().length;
    const newItems = this.items().slice(currentLength, currentLength + this.batchSize());
    this.visibleItems.update(items => [...items, ...newItems]);
  }

  getAnimationDelay(index: number): string {
    return `${(index % this.batchSize()) * 100}ms`;
  }

  ngOnDestroy() {
    this.observer?.disconnect();
  }
}
```

**Usage:**
```html
<app-deferred-grid 
  [items]="blogPosts"
  [itemTemplate]="blogCardTemplate"
  [batchSize]="6"
  gridClass="blog-grid">
</app-deferred-grid>

<ng-template #blogCardTemplate let-post let-index="index">
  <app-blog-card [post]="post"></app-blog-card>
</ng-template>
```

---

---

## Build-Time Search Indexing (Lunr.js)

### Current Implementation Status
✅ **Already configured in package.json**
- Lunr.js dependency: `"lunr": "^2.3.9"`
- Search index generation script: `"generate-search-index": "node scripts/mini-state/generate-lunr-search-index.js"`
- Build with search: `"build:with-search": "npm run prerender && npm run generate-search-index"`

### How It Works
Lunr.js creates a search index at build time by parsing prerendered HTML files and extracting searchable content.

### Example Implementation

#### 1. Search Index Generation Script
```javascript
// scripts/mini-state/generate-lunr-search-index.js
const lunr = require('lunr');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');
const glob = require('glob');

async function generateSearchIndex() {
  const distPath = 'dist/apps/mini-state/demo/browser';
  const htmlFiles = glob.sync(`${distPath}/**/*.html`);
  
  const documents = [];
  
  for (const file of htmlFiles) {
    const html = fs.readFileSync(file, 'utf8');
    const $ = cheerio.load(html);
    
    // Extract meta information
    const title = $('title').text() || $('meta[property="og:title"]').attr('content');
    const description = $('meta[name="description"]').attr('content') || 
                       $('meta[property="og:description"]').attr('content');
    const keywords = $('meta[name="keywords"]').attr('content');
    
    // Extract content from specific selectors
    const content = $('main, article, .content, .post-content').text();
    
    // Extract tags from data attributes or classes
    const tags = [];
    $('[data-tags]').each((i, el) => {
      const elTags = $(el).attr('data-tags').split(',');
      tags.push(...elTags);
    });
    
    const url = file.replace(distPath, '').replace('/index.html', '') || '/';
    
    documents.push({
      id: url,
      title: title,
      description: description,
      content: content,
      keywords: keywords,
      tags: tags.join(' '),
      url: url
    });
  }
  
  // Create Lunr index
  const idx = lunr(function () {
    this.ref('id');
    this.field('title', { boost: 10 });
    this.field('description', { boost: 5 });
    this.field('keywords', { boost: 8 });
    this.field('tags', { boost: 6 });
    this.field('content');
    
    documents.forEach(doc => this.add(doc));
  });
  
  // Save index and documents
  const searchData = {
    index: idx,
    documents: documents.reduce((acc, doc) => {
      acc[doc.id] = doc;
      return acc;
    }, {})
  };
  
  fs.writeFileSync(
    `${distPath}/assets/search-index.json`,
    JSON.stringify(searchData)
  );
  
  console.log(`Generated search index with ${documents.length} documents`);
}

generateSearchIndex().catch(console.error);
```

#### 2. Angular Search Service
```typescript
// libs/shared/services/search.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import * as lunr from 'lunr';

export interface SearchResult {
  id: string;
  title: string;
  description: string;
  url: string;
  tags: string[];
  score: number;
}

export interface SearchIndex {
  index: any;
  documents: Record<string, any>;
}

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private searchIndex$ = new BehaviorSubject<lunr.Index | null>(null);
  private documents: Record<string, any> = {};
  private isIndexLoaded = false;

  constructor(private http: HttpClient) {}

  async loadSearchIndex(): Promise<void> {
    if (this.isIndexLoaded) return;

    try {
      const searchData = await this.http.get<SearchIndex>('/assets/search-index.json').toPromise();
      const index = lunr.Index.load(searchData.index);
      this.documents = searchData.documents;
      this.searchIndex$.next(index);
      this.isIndexLoaded = true;
    } catch (error) {
      console.error('Failed to load search index:', error);
    }
  }

  search(query: string): Observable<SearchResult[]> {
    return this.searchIndex$.pipe(
      map(index => {
        if (!index || !query.trim()) return [];

        const results = index.search(query);
        return results.map(result => ({
          ...this.documents[result.ref],
          score: result.score
        }));
      })
    );
  }

  searchWithFilters(query: string, tags?: string[]): Observable<SearchResult[]> {
    return this.search(query).pipe(
      map(results => {
        if (!tags || tags.length === 0) return results;
        
        return results.filter(result => 
          tags.some(tag => result.tags.includes(tag))
        );
      })
    );
  }
}
```

#### 3. Search Component
```typescript
// libs/shared/components/search/search.component.ts
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { SearchService, SearchResult } from '../../services/search.service';

@Component({
  selector: 'app-search',
  template: `
    <div class="search-container">
      <mat-form-field appearance="outline" class="search-field">
        <mat-label>Search...</mat-label>
        <input matInput [formControl]="searchControl" placeholder="Enter search terms">
        <mat-icon matSuffix>search</mat-icon>
      </mat-form-field>
      
      <div class="filter-chips" *ngIf="availableTags.length > 0">
        <mat-chip-listbox [(ngModel)]="selectedTags" multiple>
          <mat-chip-option *ngFor="let tag of availableTags" [value]="tag">
            {{tag}}
          </mat-chip-option>
        </mat-chip-listbox>
      </div>
      
      <div class="search-results" *ngIf="searchResults.length > 0">
        <mat-card *ngFor="let result of searchResults" class="result-card" 
                  (click)="navigateTo(result.url)">
          <mat-card-header>
            <mat-card-title>{{result.title}}</mat-card-title>
            <mat-card-subtitle>Score: {{result.score | number:'1.2-2'}}</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <p>{{result.description}}</p>
            <div class="tags">
              <mat-chip *ngFor="let tag of result.tags">{{tag}}</mat-chip>
            </div>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .search-container { padding: 20px; }
    .search-field { width: 100%; }
    .result-card { 
      margin: 10px 0; 
      cursor: pointer;
      transition: transform 0.2s;
    }
    .result-card:hover { transform: translateY(-2px); }
    .tags { margin-top: 10px; }
    .filter-chips { margin: 10px 0; }
  `]
})
export class SearchComponent implements OnInit {
  searchControl = new FormControl('');
  searchResults: SearchResult[] = [];
  selectedTags: string[] = [];
  availableTags = ['angular', 'firebase', 'tutorial', 'guide', 'api'];

  constructor(
    private searchService: SearchService,
    private router: Router
  ) {}

  async ngOnInit() {
    await this.searchService.loadSearchIndex();
    
    this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(query => this.searchService.searchWithFilters(query, this.selectedTags))
    ).subscribe(results => {
      this.searchResults = results;
    });
  }

  navigateTo(url: string) {
    this.router.navigate([url]);
  }
}
```

---

## Client-Side Search (Fuse.js)

### Installation
```bash
npm install fuse.js
npm install @types/fuse.js --save-dev
```

### How It Works
Fuse.js provides fuzzy search capabilities on the client side, perfect for dynamic content or when you need flexible search options.

### Example Implementation

#### 1. Fuse.js Search Service
```typescript
// libs/shared/services/fuse-search.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import Fuse from 'fuse.js';
import { Observable, BehaviorSubject } from 'rxjs';

export interface SearchableContent {
  id: string;
  title: string;
  description: string;
  content: string;
  tags: string[];
  category: string;
  url: string;
  lastModified: string;
}

@Injectable({
  providedIn: 'root'
})
export class FuseSearchService {
  private fuse: Fuse<SearchableContent> | null = null;
  private searchResults$ = new BehaviorSubject<Fuse.FuseResult<SearchableContent>[]>([]);

  private fuseOptions: Fuse.IFuseOptions<SearchableContent> = {
    keys: [
      { name: 'title', weight: 0.3 },
      { name: 'description', weight: 0.2 },
      { name: 'content', weight: 0.2 },
      { name: 'tags', weight: 0.2 },
      { name: 'category', weight: 0.1 }
    ],
    threshold: 0.3, // Lower = more strict
    distance: 100,
    includeScore: true,
    includeMatches: true,
    minMatchCharLength: 2,
    ignoreLocation: true
  };

  constructor(private http: HttpClient) {}

  async loadContent(): Promise<void> {
    try {
      const content = await this.http.get<SearchableContent[]>('/assets/searchable-content.json').toPromise();
      this.fuse = new Fuse(content, this.fuseOptions);
    } catch (error) {
      console.error('Failed to load searchable content:', error);
    }
  }

  search(query: string): Observable<Fuse.FuseResult<SearchableContent>[]> {
    if (!this.fuse || !query.trim()) {
      this.searchResults$.next([]);
      return this.searchResults$.asObservable();
    }

    const results = this.fuse.search(query);
    this.searchResults$.next(results);
    return this.searchResults$.asObservable();
  }

  searchWithCategory(query: string, category?: string): Observable<Fuse.FuseResult<SearchableContent>[]> {
    if (!this.fuse || !query.trim()) {
      this.searchResults$.next([]);
      return this.searchResults$.asObservable();
    }

    let results = this.fuse.search(query);
    
    if (category) {
      results = results.filter(result => result.item.category === category);
    }

    this.searchResults$.next(results);
    return this.searchResults$.asObservable();
  }

  getCategories(): string[] {
    if (!this.fuse) return [];
    return [...new Set(this.fuse.getIndex().docs.map(doc => doc.category))];
  }

  getTags(): string[] {
    if (!this.fuse) return [];
    const allTags = this.fuse.getIndex().docs.flatMap(doc => doc.tags);
    return [...new Set(allTags)];
  }
}
```

#### 2. Advanced Search Component with Filters
```typescript
// libs/shared/components/advanced-search/advanced-search.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { FuseSearchService, SearchableContent } from '../../services/fuse-search.service';
import Fuse from 'fuse.js';

@Component({
  selector: 'app-advanced-search',
  template: `
    <div class="advanced-search">
      <form [formGroup]="searchForm" class="search-form">
        <mat-form-field appearance="outline" class="search-input">
          <mat-label>Search</mat-label>
          <input matInput formControlName="query" placeholder="Enter search terms...">
          <mat-icon matSuffix>search</mat-icon>
        </mat-form-field>

        <mat-form-field appearance="outline" class="category-select">
          <mat-label>Category</mat-label>
          <mat-select formControlName="category">
            <mat-option value="">All Categories</mat-option>
            <mat-option *ngFor="let cat of categories" [value]="cat">{{cat}}</mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline" class="tags-select">
          <mat-label>Tags</mat-label>
          <mat-select formControlName="tags" multiple>
            <mat-option *ngFor="let tag of availableTags" [value]="tag">{{tag}}</mat-option>
          </mat-select>
        </mat-form-field>
      </form>

      <div class="search-results" *ngIf="searchResults.length > 0">
        <div class="results-count">
          Found {{searchResults.length}} results
        </div>
        
        <mat-card *ngFor="let result of searchResults" class="result-card">
          <mat-card-header>
            <mat-card-title>
              <a [routerLink]="result.item.url">{{result.item.title}}</a>
            </mat-card-title>
            <mat-card-subtitle>
              <mat-chip-listbox>
                <mat-chip>{{result.item.category}}</mat-chip>
                <mat-chip *ngFor="let tag of result.item.tags">{{tag}}</mat-chip>
              </mat-chip-listbox>
              <span class="score">Score: {{result.score | number:'1.2-2'}}</span>
            </mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <p [innerHTML]="highlightMatches(result.item.description, result.matches)"></p>
            <div class="matches" *ngIf="result.matches && result.matches.length > 0">
              <strong>Matches found in:</strong>
              <span *ngFor="let match of result.matches" class="match-field">
                {{match.key}}
              </span>
            </div>
          </mat-card-content>
        </mat-card>
      </div>

      <div class="no-results" *ngIf="searchForm.get('query')?.value && searchResults.length === 0">
        <mat-icon>search_off</mat-icon>
        <p>No results found for "{{searchForm.get('query')?.value}}"</p>
      </div>
    </div>
  `,
  styles: [`
    .advanced-search { padding: 20px; }
    .search-form { 
      display: flex; 
      gap: 15px; 
      margin-bottom: 20px;
      flex-wrap: wrap;
    }
    .search-input { flex: 2; min-width: 250px; }
    .category-select, .tags-select { flex: 1; min-width: 150px; }
    .result-card { 
      margin-bottom: 15px;
      transition: transform 0.2s;
    }
    .result-card:hover { transform: translateY(-2px); }
    .results-count { 
      margin-bottom: 15px; 
      font-weight: 500;
      color: #666;
    }
    .score { 
      margin-left: 10px; 
      font-size: 0.8em;
      color: #999;
    }
    .matches { 
      margin-top: 10px; 
      font-size: 0.9em;
    }
    .match-field { 
      background: #e3f2fd; 
      padding: 2px 6px; 
      border-radius: 3px; 
      margin: 0 5px;
    }
    .no-results { 
      text-align: center; 
      padding: 40px;
      color: #666;
    }
    .highlight { 
      background-color: yellow; 
      font-weight: bold; 
    }
  `]
})
export class AdvancedSearchComponent implements OnInit {
  searchForm: FormGroup;
  searchResults: Fuse.FuseResult<SearchableContent>[] = [];
  categories: string[] = [];
  availableTags: string[] = [];

  constructor(
    private fb: FormBuilder,
    private fuseSearchService: FuseSearchService
  ) {
    this.searchForm = this.fb.group({
      query: [''],
      category: [''],
      tags: [[]]
    });
  }

  async ngOnInit() {
    await this.fuseSearchService.loadContent();
    this.categories = this.fuseSearchService.getCategories();
    this.availableTags = this.fuseSearchService.getTags();

    this.searchForm.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(formValue => {
      this.performSearch(formValue);
    });
  }

  private performSearch(formValue: any) {
    const { query, category, tags } = formValue;
    
    if (!query.trim()) {
      this.searchResults = [];
      return;
    }

    this.fuseSearchService.searchWithCategory(query, category).subscribe(results => {
      // Additional filtering by tags if selected
      if (tags && tags.length > 0) {
        this.searchResults = results.filter(result => 
          tags.some((tag: string) => result.item.tags.includes(tag))
        );
      } else {
        this.searchResults = results;
      }
    });
  }

  highlightMatches(text: string, matches?: Fuse.FuseResultMatch[]): string {
    if (!matches) return text;
    
    let highlightedText = text;
    matches.forEach(match => {
      if (match.key === 'description') {
        match.indices.forEach(([start, end]) => {
          const before = text.substring(0, start);
          const highlighted = text.substring(start, end + 1);
          const after = text.substring(end + 1);
          highlightedText = before + `<span class="highlight">${highlighted}</span>` + after;
        });
      }
    });
    
    return highlightedText;
  }
}
```

---

## Hybrid Search Approach

### When to Use
- Large content libraries with dynamic search requirements
- Need both fast initial search and detailed filtering
- Want to leverage build-time optimization with runtime flexibility

### Implementation Strategy
```typescript
// libs/shared/services/hybrid-search.service.ts
import { Injectable } from '@angular/core';
import { SearchService } from './search.service'; // Lunr.js service
import { FuseSearchService } from './fuse-search.service';
import { Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HybridSearchService {
  constructor(
    private lunrSearch: SearchService,
    private fuseSearch: FuseSearchService
  ) {}

  async initialize() {
    await Promise.all([
      this.lunrSearch.loadSearchIndex(),
      this.fuseSearch.loadContent()
    ]);
  }

  // Use Lunr for initial broad search, Fuse for refinement
  hybridSearch(query: string, useAdvancedFiltering = false): Observable<any[]> {
    if (!useAdvancedFiltering) {
      // Fast Lunr search for simple queries
      return this.lunrSearch.search(query);
    }

    // Advanced Fuse search for complex queries
    return this.fuseSearch.search(query).pipe(
      map(results => results.map(r => r.item))
    );
  }

  // Combine both search engines for comprehensive results
  combinedSearch(query: string): Observable<any[]> {
    return combineLatest([
      this.lunrSearch.search(query),
      this.fuseSearch.search(query)
    ]).pipe(
      map(([lunrResults, fuseResults]) => {
        // Merge and deduplicate results
        const combined = [...lunrResults];
        fuseResults.forEach(fuseResult => {
          if (!combined.find(lr => lr.url === fuseResult.item.url)) {
            combined.push({
              ...fuseResult.item,
              score: fuseResult.score || 0
            });
          }
        });
        
        // Sort by relevance score
        return combined.sort((a, b) => (b.score || 0) - (a.score || 0));
      })
    );
  }
}
```

---

## Advanced Tagging & Filtering System

### 1. Enhanced Blog Post Interface
```typescript
interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  author: string;
  publishDate: Date;
  lastModified: Date;
  
  // Advanced tagging system
  tags: string[];
  category: BlogCategory;
  difficulty: DifficultyLevel;
  readingTime: number;
  series?: string;
  prerequisites?: string[];
  
  // SEO and metadata
  metaDescription: string;
  slug: string;
  featuredImage?: string;
  socialImage?: string;
  
  // Analytics
  viewCount: number;
  likes: number;
  shares: number;
}

type BlogCategory = 
  | 'tutorial' 
  | 'guide' 
  | 'news' 
  | 'opinion' 
  | 'case-study'
  | 'review'
  | 'reference';

type DifficultyLevel = 
  | 'beginner' 
  | 'intermediate' 
  | 'advanced'
  | 'expert';
```

### 2. Smart Filter Service with Angular Signals
```typescript
@Injectable({ providedIn: 'root' })
export class SmartFilterService {
  // Filter state signals
  searchQuery = signal('');
  selectedTags = signal<string[]>([]);
  selectedCategories = signal<BlogCategory[]>([]);
  selectedDifficulty = signal<DifficultyLevel[]>([]);
  sortBy = signal<SortOption>('date-desc');
  dateRange = signal<DateRange | null>(null);
  
  // Posts data
  allPosts = signal<BlogPost[]>([]);
  
  // Computed filtered results
  filteredPosts = computed(() => {
    const posts = this.allPosts();
    const query = this.searchQuery().toLowerCase().trim();
    const tags = this.selectedTags();
    const categories = this.selectedCategories();
    const difficulty = this.selectedDifficulty();
    const range = this.dateRange();
    
    let filtered = posts.filter(post => {
      // Text search
      const matchesQuery = !query || 
        post.title.toLowerCase().includes(query) ||
        post.content.toLowerCase().includes(query) ||
        post.tags.some(tag => tag.toLowerCase().includes(query));
      
      // Tag filtering
      const matchesTags = tags.length === 0 || 
        tags.some(tag => post.tags.includes(tag));
      
      // Category filtering
      const matchesCategory = categories.length === 0 || 
        categories.includes(post.category);
      
      // Difficulty filtering
      const matchesDifficulty = difficulty.length === 0 || 
        difficulty.includes(post.difficulty);
      
      // Date range filtering
      const matchesDate = !range || 
        (post.publishDate >= range.start && post.publishDate <= range.end);
      
      return matchesQuery && matchesTags && matchesCategory && 
             matchesDifficulty && matchesDate;
    });
    
    // Apply sorting
    return this.sortPosts(filtered, this.sortBy());
  });
  
  // Computed analytics
  filterStats = computed(() => {
    const filtered = this.filteredPosts();
    const total = this.allPosts().length;
    
    return {
      totalResults: filtered.length,
      totalPosts: total,
      filteredPercentage: total > 0 ? (filtered.length / total) * 100 : 0,
      averageReadingTime: filtered.reduce((acc, post) => acc + post.readingTime, 0) / filtered.length || 0
    };
  });

  // Available filter options (computed from data)
  availableTags = computed(() => {
    const tags = new Set<string>();
    this.allPosts().forEach(post => post.tags.forEach(tag => tags.add(tag)));
    return Array.from(tags).sort();
  });

  // Filter actions
  updateSearchQuery(query: string) {
    this.searchQuery.set(query);
  }

  toggleTag(tag: string) {
    this.selectedTags.update(tags => 
      tags.includes(tag) 
        ? tags.filter(t => t !== tag)
        : [...tags, tag]
    );
  }

  toggleCategory(category: BlogCategory) {
    this.selectedCategories.update(categories =>
      categories.includes(category)
        ? categories.filter(c => c !== category)
        : [...categories, category]
    );
  }

  setSortBy(sort: SortOption) {
    this.sortBy.set(sort);
  }

  setDateRange(range: DateRange | null) {
    this.dateRange.set(range);
  }

  clearAllFilters() {
    this.searchQuery.set('');
    this.selectedTags.set([]);
    this.selectedCategories.set([]);
    this.selectedDifficulty.set([]);
    this.dateRange.set(null);
  }

  private sortPosts(posts: BlogPost[], sortBy: SortOption): BlogPost[] {
    return [...posts].sort((a, b) => {
      switch (sortBy) {
        case 'date-desc':
          return b.publishDate.getTime() - a.publishDate.getTime();
        case 'date-asc':
          return a.publishDate.getTime() - b.publishDate.getTime();
        case 'title-asc':
          return a.title.localeCompare(b.title);
        case 'reading-time':
          return a.readingTime - b.readingTime;
        case 'popularity':
          return (b.viewCount + b.likes) - (a.viewCount + a.likes);
        default:
          return 0;
      }
    });
  }
}

type SortOption = 'date-desc' | 'date-asc' | 'title-asc' | 'reading-time' | 'popularity';
interface DateRange { start: Date; end: Date; }
```

### 3. Advanced Filter UI Component
```typescript
@Component({
  selector: 'app-advanced-filter-panel',
  template: `
    <div class="filter-panel" [class.collapsed]="isCollapsed()">
      <!-- Search Header -->
      <div class="search-header">
        <mat-form-field appearance="outline" class="search-input">
          <mat-label>Search posts...</mat-label>
          <input matInput 
                 [value]="filterService.searchQuery()"
                 (input)="updateSearch($event)"
                 placeholder="Search by title, content, or tags"
                 #searchInput>
          <mat-icon matSuffix>search</mat-icon>
          <button matSuffix 
                  mat-icon-button 
                  *ngIf="filterService.searchQuery()"
                  (click)="clearSearch()">
            <mat-icon>clear</mat-icon>
          </button>
        </mat-form-field>
        
        <button mat-icon-button 
                (click)="toggleCollapse()"
                class="collapse-toggle">
          <mat-icon>{{isCollapsed() ? 'expand_more' : 'expand_less'}}</mat-icon>
        </button>
      </div>

      <!-- Filter Stats -->
      <div class="filter-stats" *ngIf="!isCollapsed()">
        <div class="stats-cards">
          <div class="stat-card">
            <span class="stat-value">{{filterService.filterStats().totalResults}}</span>
            <span class="stat-label">Results</span>
          </div>
          <div class="stat-card">
            <span class="stat-value">{{filterService.filterStats().averageReadingTime | number:'1.0-0'}}</span>
            <span class="stat-label">Avg. Reading Time</span>
          </div>
        </div>
      </div>

      <!-- Expandable Filters -->
      <div class="filter-sections" *ngIf="!isCollapsed()">
        
        <!-- Tag Cloud -->
        <div class="filter-section">
          <h4>Tags</h4>
          <div class="tag-cloud">
            <mat-chip-set>
              <mat-chip-option 
                *ngFor="let tag of filterService.availableTags(); trackBy: trackByTag"
                [selected]="filterService.selectedTags().includes(tag)"
                (click)="filterService.toggleTag(tag)"
                [class]="getTagClass(tag)">
                {{tag}}
                <span class="tag-count">({{getTagCount(tag)}})</span>
              </mat-chip-option>
            </mat-chip-set>
          </div>
        </div>

        <!-- Categories -->
        <div class="filter-section">
          <h4>Categories</h4>
          <mat-button-toggle-group 
            multiple
            [value]="filterService.selectedCategories()"
            (change)="updateCategories($event.value)">
            <mat-button-toggle value="tutorial">
              <mat-icon>school</mat-icon>
              Tutorial
            </mat-button-toggle>
            <mat-button-toggle value="guide">
              <mat-icon>map</mat-icon>
              Guide
            </mat-button-toggle>
            <mat-button-toggle value="news">
              <mat-icon>newspaper</mat-icon>
              News
            </mat-button-toggle>
            <mat-button-toggle value="opinion">
              <mat-icon>comment</mat-icon>
              Opinion
            </mat-button-toggle>
          </mat-button-toggle-group>
        </div>

        <!-- Difficulty Level -->
        <div class="filter-section">
          <h4>Difficulty</h4>
          <mat-chip-listbox 
            [(ngModel)]="selectedDifficulty"
            multiple>
            <mat-chip-option value="beginner">
              <mat-icon>sentiment_very_satisfied</mat-icon>
              Beginner
            </mat-chip-option>
            <mat-chip-option value="intermediate">
              <mat-icon>sentiment_satisfied</mat-icon>
              Intermediate
            </mat-chip-option>
            <mat-chip-option value="advanced">
              <mat-icon>sentiment_neutral</mat-icon>
              Advanced
            </mat-chip-option>
          </mat-chip-listbox>
        </div>

        <!-- Sort Options -->
        <div class="filter-section">
          <h4>Sort By</h4>
          <mat-radio-group 
            [value]="filterService.sortBy()"
            (change)="filterService.setSortBy($event.value)">
            <mat-radio-button value="date-desc">Newest First</mat-radio-button>
            <mat-radio-button value="date-asc">Oldest First</mat-radio-button>
            <mat-radio-button value="title-asc">Alphabetical</mat-radio-button>
            <mat-radio-button value="reading-time">Reading Time</mat-radio-button>
            <mat-radio-button value="popularity">Most Popular</mat-radio-button>
          </mat-radio-group>
        </div>

        <!-- Actions -->
        <div class="filter-actions">
          <button mat-stroked-button 
                  (click)="filterService.clearAllFilters()"
                  class="clear-button">
            <mat-icon>clear_all</mat-icon>
            Clear All Filters
          </button>
          
          <button mat-flat-button 
                  color="primary"
                  (click)="saveFilterPreset()"
                  class="save-button">
            <mat-icon>bookmark</mat-icon>
            Save Filter
          </button>
        </div>
      </div>
    </div>
  `,
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatButtonToggleModule,
    MatRadioModule
  ]
})
export class AdvancedFilterPanelComponent {
  isCollapsed = signal(false);
  
  constructor(public filterService: SmartFilterService) {}

  updateSearch(event: Event) {
    const target = event.target as HTMLInputElement;
    this.filterService.updateSearchQuery(target.value);
  }

  clearSearch() {
    this.filterService.updateSearchQuery('');
  }

  toggleCollapse() {
    this.isCollapsed.update(collapsed => !collapsed);
  }

  updateCategories(categories: BlogCategory[]) {
    this.filterService.selectedCategories.set(categories);
  }

  getTagClass(tag: string): string {
    const count = this.getTagCount(tag);
    if (count > 10) return 'tag-hot';
    if (count > 5) return 'tag-popular';
    return 'tag-normal';
  }

  getTagCount(tag: string): number {
    return this.filterService.allPosts()
      .filter(post => post.tags.includes(tag)).length;
  }

  trackByTag(index: number, tag: string): string {
    return tag;
  }

  saveFilterPreset() {
    // Implementation for saving user filter preferences
    console.log('Saving filter preset...');
  }
}
```

---

## Animation Strategies

### 1. Staggered Loading Animations
Create smooth, performant animations for content loading.

```scss
// Base animation keyframes
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-40px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

// Grid layout with staggered animations
.blog-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
  padding: 1rem;

  .blog-card {
    opacity: 0;
    animation: fadeInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
    
    // Staggered delays for grid items
    &:nth-child(1) { animation-delay: 0.1s; }
    &:nth-child(2) { animation-delay: 0.15s; }
    &:nth-child(3) { animation-delay: 0.2s; }
    &:nth-child(4) { animation-delay: 0.25s; }
    &:nth-child(5) { animation-delay: 0.3s; }
    &:nth-child(6) { animation-delay: 0.35s; }
    
    // For larger grids, use modulo-based delays
    @for $i from 7 through 24 {
      &:nth-child(#{$i}) { 
        animation-delay: #{0.1 + (($i - 1) % 6) * 0.05}s; 
      }
    }
  }
}

// Search results animation
.search-results {
  .result-item {
    opacity: 0;
    animation: slideInLeft 0.4s ease forwards;
    
    &:nth-child(odd) { animation-delay: 0.1s; }
    &:nth-child(even) { animation-delay: 0.2s; }
    
    &:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
  }
}

// Filter panel animations
.filter-panel {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  
  &.collapsed {
    .filter-sections {
      max-height: 0;
      overflow: hidden;
      transition: max-height 0.3s ease-out;
    }
  }
  
  .filter-sections {
    max-height: 1000px;
    transition: max-height 0.3s ease-in;
  }
}

// Tag cloud animation
.tag-cloud {
  .mat-mdc-chip {
    transition: all 0.2s ease;
    
    &:hover {
      transform: scale(1.05);
    }
    
    &.mat-mdc-chip-selected {
      animation: scaleIn 0.2s ease;
    }
  }
}
```

### 2. Loading State Animations
Beautiful skeleton loaders and loading states.

```scss
// Skeleton loading animation
@keyframes skeleton-loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.6;
  }
}

.skeleton-card {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1rem;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      90deg,
      transparent 25%,
      rgba(255, 255, 255, 0.5) 50%,
      transparent 75%
    );
    background-size: 200% 100%;
    animation: skeleton-loading 1.5s infinite;
  }
  
  .skeleton-element {
    background: linear-gradient(
      90deg, 
      #e2e8f0 25%, 
      #f1f5f9 50%, 
      #e2e8f0 75%
    );
    background-size: 200% 100%;
    animation: skeleton-loading 1.5s infinite;
    border-radius: 6px;
    
    &.skeleton-title {
      height: 1.5rem;
      width: 75%;
      margin-bottom: 1rem;
    }
    
    &.skeleton-subtitle {
      height: 1rem;
      width: 50%;
      margin-bottom: 0.5rem;
    }
    
    &.skeleton-content {
      height: 1rem;
      width: 100%;
      margin-bottom: 0.5rem;
      
      &:last-child {
        width: 60%;
      }
    }
    
    &.skeleton-image {
      height: 200px;
      width: 100%;
      margin-bottom: 1rem;
    }
  }
}

// Loading spinner with custom animation
.loading-spinner {
  .custom-spinner {
    width: 40px;
    height: 40px;
    border: 3px solid #f3f3f3;
    border-top: 3px solid #3498db;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
```

### 3. Angular Animations for State Transitions

```typescript
// animations.ts
import { 
  trigger, 
  state, 
  style, 
  transition, 
  animate,
  query,
  stagger,
  keyframes
} from '@angular/animations';

export const blogAnimations = [
  // Fade in up animation
  trigger('fadeInUp', [
    transition(':enter', [
      style({ opacity: 0, transform: 'translateY(30px)' }),
      animate('600ms cubic-bezier(0.4, 0, 0.2, 1)', 
        style({ opacity: 1, transform: 'translateY(0)' })
      )
    ])
  ]),

  // Staggered list animation
  trigger('staggeredList', [
    transition('* => *', [
      query(':enter', [
        style({ opacity: 0, transform: 'translateY(30px)' }),
        stagger(100, [
          animate('600ms cubic-bezier(0.4, 0, 0.2, 1)',
            style({ opacity: 1, transform: 'translateY(0)' })
          )
        ])
      ], { optional: true })
    ])
  ]),

  // Search results animation
  trigger('searchResults', [
    transition('* => *', [
      query(':enter', [
        style({ opacity: 0, transform: 'translateX(-20px)' }),
        stagger(50, [
          animate('400ms ease',
            style({ opacity: 1, transform: 'translateX(0)' })
          )
        ])
      ], { optional: true }),
      query(':leave', [
        animate('300ms ease',
          style({ opacity: 0, transform: 'translateX(20px)' })
        )
      ], { optional: true })
    ])
  ]),

  // Filter panel toggle
  trigger('filterToggle', [
    state('collapsed', style({ height: '0px', opacity: 0 })),
    state('expanded', style({ height: '*', opacity: 1 })),
    transition('collapsed <=> expanded', [
      animate('300ms cubic-bezier(0.4, 0, 0.2, 1)')
    ])
  ]),

  // Card hover effect
  trigger('cardHover', [
    state('default', style({ transform: 'scale(1)' })),
    state('hovered', style({ transform: 'scale(1.03)' })),
    transition('default <=> hovered', [
      animate('200ms cubic-bezier(0.4, 0, 0.2, 1)')
    ])
  ])
];

// Usage in component
@Component({
  selector: 'app-blog-list',
  template: `
    <div class="blog-container" [@staggeredList]>
      <app-blog-card 
        *ngFor="let post of posts; trackBy: trackByPost"
        [post]="post"
        [@fadeInUp]
        [@cardHover]="post.isHovered ? 'hovered' : 'default'"
        (mouseenter)="post.isHovered = true"
        (mouseleave)="post.isHovered = false">
      </app-blog-card>
    </div>
  `,
  animations: blogAnimations
})
export class BlogListComponent {
  posts = signal<BlogPost[]>([]);

  trackByPost(index: number, post: BlogPost): string {
    return post.id;
  }
}
```

---

### Challenge with Prerendering
Angular Universal prerendering creates static HTML files, but meta tags need to be set at build time, not runtime.

### Solution: Build-Time Meta Tag Injection

#### 1. Content Metadata Extraction
```javascript
// scripts/shared/extract-content-metadata.js
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

function extractContentMetadata(htmlContent, url) {
  const $ = cheerio.load(htmlContent);
  
  // Extract existing meta tags
  const title = $('title').text();
  const description = $('meta[name="description"]').attr('content');
  const keywords = $('meta[name="keywords"]').attr('content');
  
  // Extract content-based metadata
  const headings = [];
  $('h1, h2, h3').each((i, el) => {
    headings.push($(el).text().trim());
  });
  
  // Extract tags from data attributes
  const tags = [];
  $('[data-tag]').each((i, el) => {
    tags.push($(el).attr('data-tag'));
  });
  
  // Extract content length and reading time
  const textContent = $('main, article, .content').text();
  const wordCount = textContent.split(/\s+/).length;
  const readingTime = Math.ceil(wordCount / 200); // Average reading speed
  
  return {
    url,
    title,
    description,
    keywords: keywords ? keywords.split(',') : [],
    tags,
    headings,
    wordCount,
    readingTime,
    lastModified: new Date().toISOString()
  };
}

module.exports = { extractContentMetadata };
```

#### 2. Enhanced Search Index with Metadata
```javascript
// scripts/mini-state/generate-enhanced-search-index.js
const { extractContentMetadata } = require('../shared/extract-content-metadata');

async function generateEnhancedSearchIndex() {
  const distPath = 'dist/apps/mini-state/demo/browser';
  const htmlFiles = glob.sync(`${distPath}/**/*.html`);
  
  const documents = [];
  const metadata = [];
  
  for (const file of htmlFiles) {
    const html = fs.readFileSync(file, 'utf8');
    const url = file.replace(distPath, '').replace('/index.html', '') || '/';
    
    // Extract comprehensive metadata
    const meta = extractContentMetadata(html, url);
    metadata.push(meta);
    
    // Create search document
    const $ = cheerio.load(html);
    const content = $('main, article, .content').text();
    
    documents.push({
      id: url,
      title: meta.title,
      description: meta.description,
      content: content,
      keywords: meta.keywords.join(' '),
      tags: meta.tags.join(' '),
      headings: meta.headings.join(' '),
      url: url,
      wordCount: meta.wordCount,
      readingTime: meta.readingTime
    });
  }
  
  // Generate Lunr index
  const idx = lunr(function () {
    this.ref('id');
    this.field('title', { boost: 10 });
    this.field('description', { boost: 8 });
    this.field('keywords', { boost: 7 });
    this.field('tags', { boost: 6 });
    this.field('headings', { boost: 5 });
    this.field('content');
    
    documents.forEach(doc => this.add(doc));
  });
  
  // Save search data and metadata separately
  const searchData = {
    index: idx,
    documents: documents.reduce((acc, doc) => {
      acc[doc.id] = doc;
      return acc;
    }, {})
  };
  
  fs.writeFileSync(
    `${distPath}/assets/search-index.json`,
    JSON.stringify(searchData)
  );
  
  fs.writeFileSync(
    `${distPath}/assets/content-metadata.json`,
    JSON.stringify(metadata)
  );
  
  console.log(`Generated enhanced search index with ${documents.length} documents`);
}
```

#### 3. Angular Meta Tag Service
```typescript
// libs/shared/services/meta-tag.service.ts
import { Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';

interface ContentMetadata {
  url: string;
  title: string;
  description: string;
  keywords: string[];
  tags: string[];
  headings: string[];
  wordCount: number;
  readingTime: number;
  lastModified: string;
}

@Injectable({
  providedIn: 'root'
})
export class MetaTagService {
  private metadataCache: Record<string, ContentMetadata> = {};

  constructor(
    private meta: Meta,
    private title: Title,
    private http: HttpClient
  ) {}

  async loadMetadata(): Promise<void> {
    try {
      const metadata = await this.http.get<ContentMetadata[]>('/assets/content-metadata.json').toPromise();
      this.metadataCache = metadata.reduce((acc, item) => {
        acc[item.url] = item;
        return acc;
      }, {} as Record<string, ContentMetadata>);
    } catch (error) {
      console.error('Failed to load content metadata:', error);
    }
  }

  setMetaTagsForUrl(url: string): void {
    const metadata = this.metadataCache[url];
    if (!metadata) return;

    // Set title
    this.title.setTitle(metadata.title);

    // Set basic meta tags
    this.meta.updateTag({ name: 'description', content: metadata.description });
    this.meta.updateTag({ name: 'keywords', content: metadata.keywords.join(', ') });

    // Set Open Graph tags
    this.meta.updateTag({ property: 'og:title', content: metadata.title });
    this.meta.updateTag({ property: 'og:description', content: metadata.description });
    this.meta.updateTag({ property: 'og:url', content: url });

    // Set Twitter Card tags
    this.meta.updateTag({ name: 'twitter:title', content: metadata.title });
    this.meta.updateTag({ name: 'twitter:description', content: metadata.description });

    // Set custom tags for search
    this.meta.updateTag({ name: 'content:tags', content: metadata.tags.join(', ') });
    this.meta.updateTag({ name: 'content:reading-time', content: metadata.readingTime.toString() });
    this.meta.updateTag({ name: 'content:word-count', content: metadata.wordCount.toString() });
  }

  getMetadataForUrl(url: string): ContentMetadata | null {
    return this.metadataCache[url] || null;
  }
}
```

---

## Performance Considerations

### 1. Index Size Management
- **Lunr.js**: Typically 10-20% of original content size
- **Fuse.js**: Stores full content, can be larger
- **Recommendation**: Use compression and lazy loading

### 2. Loading Strategies
```typescript
// Lazy load search only when needed
const loadSearch = () => import('./search.service').then(m => m.SearchService);

// Progressive loading
class SearchManager {
  async initializeBasicSearch() {
    // Load lightweight index first
    await this.lunrSearch.loadSearchIndex();
  }

  async initializeAdvancedSearch() {
    // Load comprehensive search after basic is ready
    await this.fuseSearch.loadContent();
  }
}
```

### 3. Caching Strategy
```typescript
// Service worker caching for search assets
const SEARCH_CACHE = 'search-assets-v1';

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(SEARCH_CACHE).then(cache => {
      return cache.addAll([
        '/assets/search-index.json',
        '/assets/content-metadata.json',
        '/assets/searchable-content.json'
      ]);
    })
  );
});
```

---

## Implementation Recommendations

### For Static Content (Recommended: Lunr.js)
✅ **Use when:**
- Content is primarily static
- Build-time indexing is acceptable
- Need fast search performance
- SEO is important

### For Dynamic Content (Recommended: Fuse.js)
✅ **Use when:**
- Content changes frequently
- Need fuzzy search capabilities
- Advanced filtering is required
- Real-time search suggestions needed

### For Large Applications (Recommended: Hybrid)
✅ **Use when:**
- Have both static and dynamic content
- Need maximum search flexibility
- Performance is critical
- Advanced analytics required

### Current Project Recommendation
Based on your existing setup with Lunr.js and static Firebase hosting:

1. **Continue with Lunr.js** for main search functionality
2. **Add Fuse.js** for advanced filtering and real-time suggestions
3. **Implement progressive loading** to optimize performance
4. **Use build-time metadata extraction** for better SEO

### Next Steps
1. Enhance existing Lunr.js script with metadata extraction
2. Add Fuse.js for client-side filtering
3. Implement search UI components
4. Add service worker caching for search assets
5. Test performance with realistic content volumes

---

## Conclusion

This comprehensive guide provides multiple approaches to implementing search in Angular applications. The choice depends on your specific requirements:

- **Lunr.js**: Best for static content with SEO requirements
- **Fuse.js**: Best for dynamic content with advanced filtering
- **Hybrid**: Best for complex applications needing both approaches

Your current Lunr.js setup provides a solid foundation that can be enhanced with the examples and strategies outlined in this document.
