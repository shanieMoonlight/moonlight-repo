import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { HighlightModule } from 'ngx-highlightjs';
import { HeroBannerComponent } from '../../../../shared/ui/banner/hero-banner.component';

interface Feature {
  title: string;
  description: string;
  route: string;
  icon: string;
}

interface Benefit {
  title: string;
  description: string;
  icon: string;
}

@Component({
  selector: 'sb-home',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatDividerModule,
    MatIconModule,
    HeroBannerComponent,
    HighlightModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainHomeComponent {
  
  title = 'Mini-State Demo';
  subtitle = 'A lightweight, signals-based state management library for Angular applications.';
  description = `Mini-State provides a simple, flexible API for managing state in a decalartive way in Angular applications. 
  It handles loading states, error messages, success notifications, and simplifies working with 
  asynchronous operations while leveraging Angular's signals for reactivity.`;
  heroImageUrl = 'images/tranparent/spider-baby-6.png'; // Path to your image
  heroImageAlt = 'Mini-State Logo';

  features: Feature[] = [
    {
      title: 'Simple State',
      description: 'Basic usage of MiniState for data fetching with automatic loading state and error handling',
      route: '/simple',
      icon: 'data_object'
    },
    {
      title: 'Detail View',
      description: 'Using MiniState with observable router parameters and form integration for detail pages',
      route: '/detail/1',
      icon: 'assignment'
    },
    {
      title: 'CRUD Operations',
      description: 'Full CRUD operations with MiniCrudState for efficient collection management',
      route: '/crud',
      icon: 'edit_note'
    },
    {
      title: 'Combined State',
      description: 'Build your own Custom functionality by combining multiple MiniState instances',
      route: '/crud',
      icon: 'build'
    },
    {
      title: 'Search',
      description: 'Use MiniState for search functionality with loading and error handling',
      route: '/search',
      icon: 'search'
    }
  ];

  benefits: Benefit[] = [
    {
      title: 'Reduced Boilerplate',
      description: 'Eliminate repetitive code for handling loading states, errors, and success messages',
      icon: 'code'
    },
    {
      title: 'Signals',
      description: 'Leverages Angular\'s signals for efficient, fine-grained reactivity',
      icon: 'bolt'
    },
    {
      title: 'Lightweight',
      description: 'Minimal footprint with no external dependencies',
      icon: 'compress'
    },
    {
      title: 'Flexible API',
      description: 'Multiple ways to create and combine state objects for different use cases',
      icon: 'extension'
    },
    {
      title: 'TypeScript First',
      description: 'Built with TypeScript for excellent type safety and developer experience',
      icon: 'terminal'
    },
    {
      title: 'Composable',
      description: 'Combine multiple state objects for combined scenarios with minimal effort',
      icon: 'layers'
    }
  ];
}
