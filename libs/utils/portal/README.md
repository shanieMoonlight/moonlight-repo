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
  "@angular/common": "^17.3.0 || ^18.0.0 || ^19.0.0",
  "@angular/core": "^17.3.0 || ^18.0.0 || ^19.0.0", 
  "@angular/cdk": "^17.3.0 || ^18.0.0 || ^19.0.0"
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
    <!-- Content to be projected -->
    <sb-portal-input>
      <h2>This content will be projected!</h2>
    </sb-portal-input>
    
    <!-- Where the content appears -->
    <sb-portal-outlet></sb-portal-outlet>
  `
})
export class AppComponent {}
```

## Core Components

### SbPortalInputComponent

Projects content to a named portal outlet.

```html
<!-- Project to default outlet -->
<sb-portal-input>
  <my-navigation-buttons />
</sb-portal-input>

<!-- Project to named outlet -->
<sb-portal-input name="sidebar">
  <my-sidebar-content />
</sb-portal-input>
```

**Properties:**
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
    <!-- Project page-specific actions to navbar -->
    <sb-portal-input name="navbar-actions">
      <button>Edit Post</button>
      <button>Share</button>
      <button>Print</button>
    </sb-portal-input>
    
    <!-- Project sidebar content -->
    <sb-portal-input name="sidebar">
      <div class="table-of-contents">
        <h3>Table of Contents</h3>
        <ul>
          <li><a href="#intro">Introduction</a></li>
          <li><a href="#details">Details</a></li>
        </ul>
      </div>
    </sb-portal-input>

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
<!-- Both outlets will show the same content -->
<sb-portal-outlet name="shared-content"></sb-portal-outlet>
<sb-portal-outlet name="shared-content"></sb-portal-outlet>

<sb-portal-input name="shared-content">
  <p>This appears in both outlets!</p>
</sb-portal-input>
```

### Dynamic Portal Names

Use signal-based reactive portal names:

```typescript
@Component({
  template: `
    <sb-portal-outlet [name]="currentPortal()"></sb-portal-outlet>
    
    <button (click)="switchPortal()">Switch Portal</button>
    
    <sb-portal-input name="portal-a">Content A</sb-portal-input>
    <sb-portal-input name="portal-b">Content B</sb-portal-input>
  `
})
export class DynamicPortalComponent {
  currentPortal = signal('portal-a');
  
  switchPortal() {
    this.currentPortal.set(
      this.currentPortal() === 'portal-a' ? 'portal-b' : 'portal-a'
    );
  }
}
```

### Conditional Portal Content

```html
@if(showExtraActions()) {
  <sb-portal-input name="navbar-actions">
    <button>Extra Action</button>
  </sb-portal-input>
}
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
