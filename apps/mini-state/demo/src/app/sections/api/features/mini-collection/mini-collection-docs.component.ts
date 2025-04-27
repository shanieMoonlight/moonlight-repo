import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTabsModule } from '@angular/material/tabs';
import { HighlightModule } from 'ngx-highlightjs';

@Component({
  selector: 'sb-mini-collection-docs',
  templateUrl: './mini-collection-docs.component.html',
  styleUrls: ['./mini-collection-docs.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [MatExpansionModule, MatTabsModule, HighlightModule]
})
export class MiniCollectionDocsComponent {
  // Core concept example
  conceptExample = `import { MiniCollection } from '@spider-baby/mini-state';

// Create a collection for managing a list of todos
interface Todo {
  id: string;
  title: string;
  completed: boolean;
}

// Initialize an empty collection
const todosCollection = new MiniCollection<Todo>();

// Initialize with initial values
const initialTodos: Todo[] = [
  { id: '1', title: 'Learn MiniState', completed: false },
  { id: '2', title: 'Build app', completed: false }
];
const preloadedCollection = new MiniCollection<Todo>(initialTodos);`;

  // Key operations examples
  addExample = `// Add a single item
todosCollection.add({ 
  id: '3', 
  title: 'Write documentation', 
  completed: false 
});

// Add multiple items
todosCollection.addMany([
  { id: '4', title: 'Test app', completed: false },
  { id: '5', title: 'Deploy app', completed: false }
]);`;

  updateExample = `// Update a single item by ID
todosCollection.update('1', { completed: true });

// Update with a callback function
todosCollection.update('2', todo => ({
  ...todo,
  title: \`\${todo.title} (in progress)\`,
  completed: true
}));`;

  removeExample = `// Remove an item by ID
todosCollection.remove('3');

// Remove multiple items by ID
todosCollection.removeMany(['4', '5']);

// Remove items by predicate function
todosCollection.removeWhere(todo => todo.completed);

// Clear the entire collection
todosCollection.clear();`;

  queryExample = `// Get the entire collection as an array
const allTodos = todosCollection.all();

// Get a single item by ID
const todo = todosCollection.get('1');

// Check if the collection contains an item with a specific ID
const hasTodo = todosCollection.has('2');

// Get the size of the collection
const count = todosCollection.size;

// Find items that match a predicate
const completedTodos = todosCollection.where(todo => todo.completed);`;

  // Signals example
  signalsExample = `// All collection properties are signals that can be used in templates
@Component({
  selector: 'app-todo-list',
  template: \`
    <h2>Todos ({{ collection.size }})</h2>
    <ul>
      <li *ngFor="let todo of collection.all()">
        {{ todo.title }} - {{ todo.completed ? 'Done' : 'Pending' }}
      </li>
    </ul>
    <div *ngIf="collection.size === 0">No todos found</div>
  \`
})
export class TodoListComponent {
  collection = new MiniCollection<Todo>(initialTodos);
}`;

  // Connecting to API example
  apiExample = `import { Component, inject, OnInit } from '@angular/core';
import { MiniCollection, MiniStateBuilder } from '@spider-baby/mini-state';
import { TodoService } from './todo.service';

@Component({
  selector: 'app-todo-manager',
  template: \`
    <div *ngIf="fetchState.loading()">Loading todos...</div>
    <div *ngIf="fetchState.errorMsg()">Error: {{ fetchState.errorMsg() }}</div>
    
    <div *ngIf="!fetchState.loading() && todos.size > 0">
      <h2>My Todos ({{ todos.size }})</h2>
      <ul>
        <li *ngFor="let todo of todos.all()">
          <input 
            type="checkbox" 
            [checked]="todo.completed" 
            (change)="toggleTodo(todo.id, $event.target.checked)"
          />
          {{ todo.title }}
          <button (click)="deleteTodo(todo.id)">Delete</button>
        </li>
      </ul>
    </div>
    
    <form (ngSubmit)="addTodo()">
      <input [(ngModel)]="newTodoTitle" placeholder="Add new todo" />
      <button type="submit" [disabled]="!newTodoTitle">Add</button>
    </form>
  \`
})
export class TodoManagerComponent implements OnInit {
  private todoService = inject(TodoService);
  
  // Collection to store all todos
  todos = new MiniCollection<Todo>();
  
  // MiniState for fetching todos
  fetchState = MiniStateBuilder
    .Create(() => this.todoService.getAllTodos())
    .setSuccessMsgFn(todos => \`Loaded \${todos.length} todos\`)
    .build();
    
  // MiniState for adding a todo
  addState = MiniStateBuilder
    .CreateWithInput((title: string) => this.todoService.createTodo(title))
    .setSuccessMsgFn((title, todo) => \`Added todo: \${title}\`)
    .build();
    
  // MiniState for toggling todo completion status
  toggleState = MiniStateBuilder
    .CreateWithInput((params: {id: string, completed: boolean}) => 
      this.todoService.updateTodo(params.id, { completed: params.completed })
    )
    .build();
    
  // MiniState for deleting a todo
  deleteState = MiniStateBuilder
    .CreateWithInput((id: string) => this.todoService.deleteTodo(id))
    .setSuccessMsgFn(id => \`Deleted todo\`)
    .build();
  
  newTodoTitle = '';
  
  ngOnInit() {
    // Load todos and update collection
    this.fetchState.data.subscribe(todos => {
      if (todos) {
        this.todos.clear();
        this.todos.addMany(todos);
      }
    });
    
    // Add a new todo when created
    this.addState.data.subscribe(newTodo => {
      if (newTodo) {
        this.todos.add(newTodo);
        this.newTodoTitle = '';
      }
    });
    
    // Update a todo in the collection
    this.toggleState.data.subscribe(updatedTodo => {
      if (updatedTodo) {
        this.todos.update(updatedTodo.id, updatedTodo);
      }
    });
    
    // Remove a todo from the collection
    this.deleteState.data.subscribe(result => {
      if (result && result.id) {
        this.todos.remove(result.id);
      }
    });
    
    // Load todos initially
    this.fetchState.trigger();
  }
  
  addTodo() {
    if (this.newTodoTitle.trim()) {
      this.addState.trigger(this.newTodoTitle);
    }
  }
  
  toggleTodo(id: string, completed: boolean) {
    this.toggleState.trigger({ id, completed });
  }
  
  deleteTodo(id: string) {
    this.deleteState.trigger(id);
  }
}`; 

  // Advanced usage
  advancedExample = `// Using derived collections
import { computed } from '@angular/core';
import { MiniCollection } from '@spider-baby/mini-state';

@Component({
  template: \`
    <h2>Task Management</h2>
    
    <div class="stats">
      <div>Total: {{ allTasks.size }}</div>
      <div>Pending: {{ pendingTasks().length }}</div>
      <div>Completed: {{ completedTasks().length }}</div>
    </div>
    
    <h3>Pending Tasks</h3>
    <ul>
      <li *ngFor="let task of pendingTasks()">
        {{ task.title }}
        <button (click)="completeTask(task.id)">Complete</button>
      </li>
    </ul>
    
    <h3>Completed Tasks</h3>
    <ul>
      <li *ngFor="let task of completedTasks()">
        <s>{{ task.title }}</s>
        <button (click)="reopenTask(task.id)">Reopen</button>
      </li>
    </ul>
  \`
})
export class TaskManagerComponent {
  // Main collection
  allTasks = new MiniCollection<Task>([
    { id: '1', title: 'Research', completed: false },
    { id: '2', title: 'Planning', completed: false },
    { id: '3', title: 'Setup project', completed: true }
  ]);
  
  // Derived collections using computed signals
  pendingTasks = computed(() => 
    this.allTasks.where(task => !task.completed)
  );
  
  completedTasks = computed(() => 
    this.allTasks.where(task => task.completed)
  );
  
  completeTask(id: string) {
    this.allTasks.update(id, { completed: true });
  }
  
  reopenTask(id: string) {
    this.allTasks.update(id, { completed: false });
  }
}`;
}