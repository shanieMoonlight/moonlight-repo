# @moonlight/ssr-local-storage

[![Angular](https://img.shields.io/badge/Angular-DD0031?style=flat-square&logo=angular&logoColor=white)](https://angular.io/)
[![NX](https://img.shields.io/badge/Nx-143055?style=flat-square&logo=nx&logoColor=white)](https://nx.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

A lightweight Angular service that provides a wrapper around the browser's localStorage API with built-in support for Server-Side Rendering (SSR).

## Features

- 🔄 Full localStorage API implementation
- 🛡️ Type-safe methods for working with objects
- 🖥️ Server-side rendering compatible
- ⚠️ Error handling for all storage operations
- 🪶 Zero dependencies beyond Angular

## Installation

```bash
npm install @moonlight/ssr-local-storage
```

## Usage

### Setting up the module

```typescript
import { NgModule } from '@angular/core';
import { SsrLocalStorageModule } from '@moonlight/ssr-local-storage';

@NgModule({
  imports: [
    SsrLocalStorageModule.forRoot()
  ]
})
export class AppModule { }
```

### Basic operations

```typescript
import { Component } from '@angular/core';
import { SsrLocalStorageService } from '@moonlight/ssr-local-storage';

@Component({
  selector: 'app-example',
  template: `<div>{{ storedValue }}</div>`
})
export class ExampleComponent {
  storedValue: string;

  constructor(private storage: SsrLocalStorageService) {
    // Store a value
    this.storage.setItem('greeting', 'Hello, World!');
    
    // Retrieve a value
    this.storedValue = this.storage.getItem('greeting');
    
    // Remove a value
    this.storage.removeItem('oldKey');
    
    // Clear all values
    // this.storage.clear();
  }
}
```

### Working with objects

```typescript
import { SsrLocalStorageService } from '@moonlight/ssr-local-storage';

interface User {
  id: number;
  name: string;
  email: string;
}

// Store an object
const user: User = { id: 1, name: 'John Doe', email: 'john@example.com' };
this.storage.setObject<User>('currentUser', user);

// Retrieve an object
const storedUser = this.storage.getObject<User>('currentUser');
```

### Error handling

```typescript
try {
  const value = this.storage.getItem('key');
  // Use the value
} catch (error) {
  console.error('Storage operation failed:', error);
  // Handle the error appropriately
}
```

## API Reference

### SsrLocalStorageService

#### Basic Methods

| Method | Description | Parameters | Return |
|--------|-------------|------------|--------|
| `getItem(key: string)` | Retrieves an item from storage | `key`: Storage key | `string \| null` |
| `setItem(key: string, value: string)` | Stores a string value | `key`: Storage key<br>`value`: String to store | `void` |
| `removeItem(key: string)` | Removes an item from storage | `key`: Storage key | `void` |
| `clear()` | Clears all storage | None | `void` |
| `key(index: number)` | Gets the key at the specified index | `index`: Numeric position | `string \| null` |
| `length()` | Gets the number of items in storage | None | `number` |

#### Object Methods

| Method | Description | Parameters | Return |
|--------|-------------|------------|--------|
| `getObject<T>(key: string)` | Retrieves and parses a JSON object | `key`: Storage key | `T \| null` |
| `setObject<T>(key: string, value: T)` | Stringifies and stores an object | `key`: Storage key<br>`value`: Object to store | `void` |

## SSR Considerations

When running in server-side rendering mode, the service automatically uses an in-memory storage implementation that mimics localStorage behavior. This ensures your application works seamlessly in both client and server environments without modifications.

## Examples

### Usage with Angular Services

```typescript
@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private storage: SsrLocalStorageService) {}
  
  saveUserPreferences(prefs: UserPreferences): void {
    this.storage.setObject('userPreferences', prefs);
  }
  
  getUserPreferences(): UserPreferences | null {
    return this.storage.getObject('userPreferences');
  }
}
```

### Observable Pattern

```typescript
@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private themeSubject = new BehaviorSubject<string>('light');
  public theme$ = this.themeSubject.asObservable();
  
  constructor(private storage: SsrLocalStorageService) {
    const savedTheme = this.storage.getItem('theme') || 'light';
    this.themeSubject.next(savedTheme);
  }
  
  setTheme(theme: string): void {
    this.storage.setItem('theme', theme);
    this.themeSubject.next(theme);
  }
}
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

