import { Observable, of } from 'rxjs';

// Example DTOs and Item types for testing
interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface CreateUserDto {
  name: string;
  email: string;
  role: string;
}

interface UpdateUserDto {
  id: number;
  name?: string;
  email?: string;
  role?: string;
}

interface DeleteUserDto {
  id: number;
}

interface UserFilter {
  searchTerm?: string;
  role?: string;
}

// Mock service for testing
class UserService {
  private users: User[] = [
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'admin' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'user' }
  ];

  getAll(filter: UserFilter): Observable<User[]> {
    let filtered = this.users;
    if (filter.searchTerm) {
      filtered = filtered.filter(u => 
        u.name.toLowerCase().includes(filter.searchTerm!.toLowerCase()) ||
        u.email.toLowerCase().includes(filter.searchTerm!.toLowerCase())
      );
    }
    if (filter.role) {
      filtered = filtered.filter(u => u.role === filter.role);
    }
    return of(filtered);
  }

  create(dto: CreateUserDto): Observable<User> {
    const newUser: User = {
      id: Math.max(...this.users.map(u => u.id)) + 1,
      ...dto
    };
    this.users.push(newUser);
    return of(newUser);
  }

  update(dto: UpdateUserDto): Observable<User> {
    const userIndex = this.users.findIndex(u => u.id === dto.id);
    if (userIndex === -1) throw new Error('User not found');
    
    this.users[userIndex] = { ...this.users[userIndex], ...dto };
    return of(this.users[userIndex]);
  }

  delete(dto: DeleteUserDto): Observable<{ success: boolean }> {
    const userIndex = this.users.findIndex(u => u.id === dto.id);
    if (userIndex === -1) throw new Error('User not found');
    
    this.users.splice(userIndex, 1);
    return of({ success: true });
  }
}

// Example usage demonstrating the refactored generic types
function createUserCrudState(userService: UserService) {
  return MiniCrudState.Create<UserFilter, User, CreateUserDto, UpdateUserDto, DeleteUserDto>(
    (filter) => userService.getAll(filter)
  )
  .setAddState(
    (dto: CreateUserDto) => userService.create(dto),
    (dto, result) => `User ${result?.name || dto.name} was created successfully!`
  )
  .setUpdateState(
    (dto: UpdateUserDto) => userService.update(dto),
    (dto, result) => `User ${result?.name} was updated successfully!`
  )
  .setDeleteState(
    (dto: DeleteUserDto) => userService.delete(dto),
    (dto, result) => `User was deleted successfully!`,
    undefined,
    // Custom item compare function to extract the user from the delete DTO
    (dto) => ({ id: dto.id } as User)
  );
}

// Test the implementation
export function testMiniCrudState() {
  const userService = new UserService();
  const crudState = createUserCrudState(userService);

  // Load all users
  crudState.trigger({ searchTerm: '', role: '' });

  // Add a new user
  crudState.triggerAdd({
    name: 'Bob Johnson',
    email: 'bob@example.com',
    role: 'user'
  });

  // Update a user
  crudState.triggerUpdate({
    id: 1,
    name: 'John Updated',
    email: 'john.updated@example.com'
  });

  // Delete a user
  crudState.triggerDelete({
    id: 2
  });

  console.log('MiniCrudState test completed successfully!');
}
