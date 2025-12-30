// Service examples for tutorial
export const UserServiceExample = `// Example service for MiniState tutorial
import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay, map } from 'rxjs/operators';

export interface User {
  id: number;
  name: string;
  email: string;
  bio?: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private users: User[] = [
    { id: 1, name: 'John Doe', email: 'john@example.com', bio: 'Software Developer' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', bio: 'Product Manager' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', bio: 'UI/UX Designer' }
  ];

  getAll(): Observable<User[]> {
    // Simulate API delay
    return of(this.users).pipe(delay(1000));
  }

  getById(id: string): Observable<User> {
    const user = this.users.find(u => u.id === parseInt(id));
    
    if (!user) {
      return throwError(() => new Error(\`User with ID \${id} not found\`));
    }
    
    return of(user).pipe(delay(800));
  }

  search(term: string): Observable<User[]> {
    if (!term.trim()) {
      return of([]);
    }
    
    const results = this.users.filter(user =>
      user.name.toLowerCase().includes(term.toLowerCase()) ||
      user.email.toLowerCase().includes(term.toLowerCase())
    );
    
    return of(results).pipe(delay(600));
  }

  create(user: User): Observable<User> {
    const newUser = {
      ...user,
      id: Math.max(...this.users.map(u => u.id)) + 1
    };
    
    this.users.push(newUser);
    return of(newUser).pipe(delay(500));
  }

  update(user: User): Observable<User> {
    const index = this.users.findIndex(u => u.id === user.id);
    
    if (index === -1) {
      return throwError(() => new Error(\`User with ID \${user.id} not found\`));
    }
    
    this.users[index] = user;
    return of(user).pipe(delay(500));
  }

  delete(id: number): Observable<void> {
    const index = this.users.findIndex(u => u.id === id);
    
    if (index === -1) {
      return throwError(() => new Error(\`User with ID \${id} not found\`));
    }
    
    this.users.splice(index, 1);
    return of(void 0).pipe(delay(500));
  }
}`;

export const InstallationExample = `# Install the MiniState package
npm install @spider-baby/mini-state
`;

export const ImportExample = `// Import the main classes
import { 
  MiniState, 
  MiniStateBuilder, 
  MiniCrudState,
  MiniStateCombined, 
  MiniStateUtility  
} from '@spider-baby/mini-state';`;
