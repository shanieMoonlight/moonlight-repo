import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

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
    MatIconModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainHomeComponent {
  
  title = 'Mini-State Demo';
  subtitle = 'A lightweight, signals-based state management library for Angular';
  description = `Mini-State provides a simple, flexible API for managing state in Angular applications. 
  It handles loading states, error messages, success notifications, and simplifies working with 
  asynchronous operations while leveraging Angular's signals for reactivity.`;

  features: Feature[] = [
    {
      title: 'Simple State',
      description: 'Basic usage of MiniState for data fetching with automatic loading state and error handling',
      route: '/simple',
      icon: 'data_object'
    },
    {
      title: 'Detail View',
      description: 'Using MiniState with router parameters and form integration for detail pages',
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
      title: 'Manual CRUD',
      description: 'Build your own CRUD functionality by combining multiple MiniState instances',
      route: '/manual-crud',
      icon: 'build'
    }
  ];

  benefits: Benefit[] = [
    {
      title: 'Reduced Boilerplate',
      description: 'Eliminate repetitive code for handling loading states, errors, and success messages',
      icon: 'code'
    },
    {
      title: 'Built on Signals',
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
      description: 'Combine multiple state objects for complex scenarios with minimal effort',
      icon: 'layers'
    }
  ];
}
