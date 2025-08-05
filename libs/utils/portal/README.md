# @spider-baby/utils-portal

A lightweight Angular library that provides a portal system for projecting content across component boundaries using Angular CDK portals with signal-based reactivity.

## Features

- 🎯 **Signal-based reactivity** - Built with Angular signals for optimal performance
- 🚀 **Simple API** - Easy-to-use components for portal management
- 🔄 **Dynamic content projection** - Project content from any component to any outlet
- 📦 **CDK Integration** - Built on Angular CDK Portal foundation
- 🧪 **Fully tested** - Comprehensive test suite with 49+ tests
- 🌍 **SSR Compatible** - Works with server-side rendering
- ⚡ **OnPush optimized** - Efficient change detection strategy

## Installation

```bash
npm install @spider-baby/utils-portal
```

### Peer Dependencies

```json
{
  "@angular/common": "^17.3.0 || ^18.0.0 || ^19.0.0 || ^20.0.0",
  "@angular/core": "^17.3.0 || ^18.0.0 || ^19.0.0 || ^20.0.0", 
  "@angular/cdk": "^17.3.0 || ^18.0.0 || ^19.0.0 || ^20.0.0",
  "rxjs": "^7.4.0 || ~7.5.0 || ~7.6.0 || ~7.8.0"
}
```

## Quick Start

### 1. Import the Components

```typescript
import { Component } from '@angular/core';
import { SbPortalInputComponent, SbPortalOutletComponent } from '@spider-baby/utils-portal';

@Component({
  standalone: true,
  imports: [SbPortalInputComponent, SbPortalOutletComponent],
  template: `
    <!-- Define content in a template -->
    <ng-template #myContentTemplate>
      <h2>This content will be projected!</h2>
    </ng-template>
    
    <!-- Project the template -->
    <sb-portal-input [portalTemplate]="myContentTemplate"></sb-portal-input>
    
    <!-- Where the content appears -->
    <sb-portal-outlet></sb-portal-outlet>
  `
})
export class AppComponent {}
```

## Core Components

### SbPortalInputComponent

Projects template content to a named portal outlet.

```html
<!-- Define templates -->
<ng-template #navigationTemplate>
  <my-navigation-buttons />
</ng-template>

<ng-template #sidebarTemplate>
  <my-sidebar-content />
</ng-template>

<!-- Project to default outlet -->
<sb-portal-input [portalTemplate]="navigationTemplate"></sb-portal-input>

<!-- Project to named outlet -->
<sb-portal-input name="sidebar" [portalTemplate]="sidebarTemplate"></sb-portal-input>
```

**Properties:**
- `portalTemplate` (required): TemplateRef to project
- `name` (optional): The portal name (defaults to 'default')

### SbPortalOutletComponent

Displays content from a named portal.

```html
<!-- Display default portal -->
<sb-portal-outlet></sb-portal-outlet>

<!-- Display named portal -->
<sb-portal-outlet name="sidebar"></sb-portal-outlet>
```

**Properties:**
- `name` (optional): The portal name to display (defaults to 'default')

## Real-World Example

Here's how you might use the portal system in a typical application:

### Navigation Component
```typescript
// navbar.component.ts
@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [SbPortalOutletComponent],
  template: `
    <nav class="navbar">
      <div class="navbar-brand">My App</div>
      
      <!-- Portal outlet for page-specific navigation -->
      <sb-portal-outlet name="navbar-actions"></sb-portal-outlet>
      
      <div class="navbar-end">
        <button>Settings</button>
      </div>
    </nav>
  `
})
export class NavbarComponent {}
```

### Page Component
```typescript
// blog-post.component.ts
@Component({
  selector: 'app-blog-post',
  standalone: true,
  imports: [SbPortalInputComponent],
  template: `
    <!-- Define templates -->
    <ng-template #navbarActionsTemplate>
      <button>Edit Post</button>
      <button>Share</button>
      <button>Print</button>
    </ng-template>
    
    <ng-template #sidebarTemplate>
      <div class="table-of-contents">
        <h3>Table of Contents</h3>
        <ul>
          <li><a href="#intro">Introduction</a></li>
          <li><a href="#details">Details</a></li>
        </ul>
      </div>
    </ng-template>

    <!-- Project templates to portals -->
    <sb-portal-input name="navbar-actions" [portalTemplate]="navbarActionsTemplate"></sb-portal-input>
    <sb-portal-input name="sidebar" [portalTemplate]="sidebarTemplate"></sb-portal-input>

    <!-- Main content -->
    <article>
      <h1>My Blog Post</h1>
      <p>Content goes here...</p>
    </article>
  `
})
export class BlogPostComponent {}
```

### Sidebar Component
```typescript
// sidebar.component.ts
@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [SbPortalOutletComponent],
  template: `
    <aside class="sidebar">
      <!-- Display sidebar-specific content -->
      <sb-portal-outlet name="sidebar"></sb-portal-outlet>
      
      <!-- Default sidebar content -->
      <div class="default-content">
        <h3>Recent Posts</h3>
        <!-- ... -->
      </div>
    </aside>
  `
})
export class SidebarComponent {}
```

## Advanced Usage

### Multiple Outlets with Same Name

Multiple outlets can share the same portal name, causing the same content to appear in multiple locations:

```html
<!-- Define template -->
<ng-template #sharedContentTemplate>
  <p>This appears in both outlets!</p>
</ng-template>

<!-- Both outlets will show the same content -->
<sb-portal-outlet name="shared-content"></sb-portal-outlet>
<sb-portal-outlet name="shared-content"></sb-portal-outlet>

<!-- Project template to both outlets -->
<sb-portal-input name="shared-content" [portalTemplate]="sharedContentTemplate"></sb-portal-input>
```


### Conditional Portal Content

```typescript
@Component({
  standalone: true,
  imports: [SbPortalInputComponent],
  template: `<!-- Conditional Portal Rendering -->
  <div class="demo-container">
       <div class="demo-source">
      <h4>Portal Input (Source)</h4>
      <p>Click the button below to teleport this content:</p>

      <div class="demo-actions">
        <!-- Change TemplateRef -->
        <button mat-flat-button class="primary" 
          (click)="_selectedPortal = _demoTemplate1()"   
          [disabled]="_selectedPortal === _demoTemplate1()">
          Display 1
        </button>

        <!-- Change TemplateRef -->
        <button mat-flat-button class="secondary" 
          (click)="_selectedPortal = _demoTemplate2()"
          [disabled]="_selectedPortal === _demoTemplate2()">
          Display 2
        </button>

        <!-- Remove TemplateRef -->
        <button mat-flat-button class="tertiary" 
          (click)="_selectedPortal = undefined"
          [disabled]="!_selectedPortal">
          Hide
        </button>

        <!-- Change Template content in realtime -->
        <button 
          mat-flat-button class="error" 
          (click)="_toggleDynamicText()">
          Dynamic Text 
        </button>
      </div>
      
      <!-- Define Templates to render -->
      <ng-template #demoPortalTemplate1>
        <div class="demo-content primary">
          <h3>🚀 Primary Portal Content</h3>
          <p>This is the primary content portal - it demonstrates basic portal functionality with a clean, modern design.</p>
          <h3 class="dynamic"> Dynamic Text: {{_dynamicText}}</h3>
        </div>
      </ng-template>

      <ng-template #demoPortalTemplate2>
        <div class="demo-content secondary">
          <h3>⭐ Secondary Portal Content</h3>
          <p>This is the secondary content portal - showcasing alternative styling and content to demonstrate portal flexibility.</p>
          <h3 class="dynamic"> Dynamic Text: {{_dynamicText}}</h3>
        </div>
      </ng-template>


      <!-- Conditional Rendering -->
      @if(_selectedPortal; as portal){  
        <sb-portal-input [portalTemplate]="portal" name="demo-portal" />
      }
    </div>


  </div>
  `
})
export class ConditionalPortalComponent {

  protected _demoTemplate1 = viewChild.required<TemplateRef<unknown>>('demoPortalTemplate1')
  protected _demoTemplate2 = viewChild.required<TemplateRef<unknown>>('demoPortalTemplate2')


  protected _selectedPortal?: TemplateRef<unknown>

  protected _dynamicText = "Hello"
  protected _toggleDynamicText = () => 
    this._dynamicText = this._dynamicText === "Hello" ? "GoodBye" : "Hello"
}


// some-other.component.ts
@Component({
  selector: 'some-other-component',
  standalone: true,
  imports: [SbPortalOutletComponent],
  template: `    
      <!-- Render the portal-->
    <div class="demo-destination">
      <h4>Portal Outlet (Destination)</h4>
      <h5>Could be anywhere in your application</h5>
      <div class="outlet-container">
        <sb-portal-outlet name="demo-portal"></sb-portal-outlet>
      </div>
    </div>
  `
})
export class SomeOtherComponent {}
```

## API Reference

### Constants

- `DEFAULT_NAME: 'default'` - The default portal name used when none is specified

### Services

The library includes `SbPortalBridgeService` for advanced portal management, though typically you'll use the components directly.

## Browser Support

- Angular 17.3+
- Modern browsers (ES2022+)
- SSR/Universal support

## Development

This library is built with:
- Angular 19
- Angular CDK Portal
- Signal-based reactivity
- OnPush change detection
- Comprehensive testing with Jest

## Contributing

1. Clone the repository
2. Install dependencies: `npm install`
3. Run tests: `nx test spider-baby-utils-portal`
4. Build: `nx build spider-baby-utils-portal`

## License

MIT License - see LICENSE file for details.

## Related Packages

- `@angular/cdk` - Angular Component Dev Kit
- `@spider-baby/mini-state` - State management utilities
- `@spider-baby/theming` - Material Design theming utilities

---

Made with ❤️ by the Spider Baby team 🕷️
