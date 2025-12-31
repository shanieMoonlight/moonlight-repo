import { Tree } from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { EntryPointRoutesUtils } from './entry-point-routes-utils';

describe('EntryPointRoutesUtils', () => {
  let tree: Tree;

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace();
  });

  describe('addToRoutesArray', () => {
    const testFilePath = 'test-routes.ts';

    it('should add element to routes array with proper formatting', () => {
      // Arrange
      const routesFileContent = `import { Route } from '@angular/router';

export const testRoutes: Route[] = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    component: HomeComponent
  }
];`;

      tree.write(testFilePath, routesFileContent);
      const elementToAdd = '...existingRoutes';

      // Act
      const result = EntryPointRoutesUtils.addToRoutesArray(tree, testFilePath, elementToAdd);

      // Assert
      const updatedContent = tree.read(testFilePath, 'utf-8');
      expect(updatedContent).toContain('...existingRoutes,');
      expect(result).toBeDefined();
    });

    it('should automatically add comma if element does not end with comma', () => {
      // Arrange
      const routesFileContent = `export const testRoutes: Route[] = [
  {
    path: 'home',
    component: HomeComponent
  }
];`;

      tree.write(testFilePath, routesFileContent);
      const elementToAdd = '...spreadRoutes';

      // Act
      EntryPointRoutesUtils.addToRoutesArray(tree, testFilePath, elementToAdd);

      // Assert
      const updatedContent = tree.read(testFilePath, 'utf-8');
      expect(updatedContent).toContain('...spreadRoutes,');
    });

    it('should preserve existing comma if element already ends with comma', () => {
      // Arrange
      const routesFileContent = `export const testRoutes: Route[] = [
  {
    path: 'home',
    component: HomeComponent
  }
];`;

      tree.write(testFilePath, routesFileContent);
      const elementToAdd = '...spreadRoutes,';

      // Act
      EntryPointRoutesUtils.addToRoutesArray(tree, testFilePath, elementToAdd);

      // Assert
      const updatedContent = tree.read(testFilePath, 'utf-8');
      expect(updatedContent).toContain('...spreadRoutes,');
      expect(updatedContent).not.toContain('...spreadRoutes,,'); // No double comma
    });

    it('should handle routes array with multiple route objects', () => {
      // Arrange
      const routesFileContent = `export const adminRoutes: Route[] = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    component: DashboardComponent
  },
  {
    path: 'users',
    component: UsersComponent
  }
];`;

      tree.write(testFilePath, routesFileContent);
      const elementToAdd = '...sharedRoutes';

      // Act
      EntryPointRoutesUtils.addToRoutesArray(tree, testFilePath, elementToAdd);

      // Assert
      const updatedContent = tree.read(testFilePath, 'utf-8');
      expect(updatedContent).toContain('...sharedRoutes,');
      // Should be inserted before the first route object
      expect(updatedContent).toMatch(/\[\s*...sharedRoutes,\s*\{\s*path: '',/);
    });

    it('should preserve indentation from existing route objects', () => {
      // Arrange
      const routesFileContent = `export const testRoutes: Route[] = [
      {
        path: 'home',
        component: HomeComponent
      }
];`;

      tree.write(testFilePath, routesFileContent);
      const elementToAdd = '...spreadRoutes';

      // Act
      EntryPointRoutesUtils.addToRoutesArray(tree, testFilePath, elementToAdd);

      // Assert
      const updatedContent = tree.read(testFilePath, 'utf-8');
      // Should match the indentation of the existing route object (6 spaces)
      expect(updatedContent).toMatch(/\[\s*...spreadRoutes,\s*\{\s*path: 'home'/);
    });

    it('should handle routes array with different variable names', () => {
      // Arrange
      const routesFileContent = `export const blogSectionRoutes: Route[] = [
  {
    path: 'posts',
    component: PostsComponent
  }
];`;

      tree.write(testFilePath, routesFileContent);
      const elementToAdd = '...baseRoutes';

      // Act
      EntryPointRoutesUtils.addToRoutesArray(tree, testFilePath, elementToAdd);

      // Assert
      const updatedContent = tree.read(testFilePath, 'utf-8');
      expect(updatedContent).toContain('...baseRoutes,');
      expect(updatedContent).toMatch(/export const blogSectionRoutes: Route\[\] = \[\s*...baseRoutes,/);
    });

    it('should handle routes array with complex route objects', () => {
      // Arrange
      const routesFileContent = `export const testRoutes: Route[] = [
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'users',
        component: UsersComponent
      }
    ]
  }
];`;

      tree.write(testFilePath, routesFileContent);
      const elementToAdd = '...publicRoutes';

      // Act
      EntryPointRoutesUtils.addToRoutesArray(tree, testFilePath, elementToAdd);

      // Assert
      const updatedContent = tree.read(testFilePath, 'utf-8');
      expect(updatedContent).toContain('...publicRoutes,');
      expect(updatedContent).toMatch(/\[\s*...publicRoutes,\s*\{\s*path: 'admin'/);
    });

    it('should return undefined when file does not exist', () => {
      // Arrange
      const nonExistentPath = 'non-existent-file.ts';

      // Act
      const result = EntryPointRoutesUtils.addToRoutesArray(tree, nonExistentPath, '...routes');

      // Assert
      expect(result).toBeUndefined();
    });

    it('should return empty string when routes array pattern is not found', () => {
      // Arrange
      const invalidFileContent = `export const something = "not a routes array";`;
      tree.write(testFilePath, invalidFileContent);

      // Act
      const result = EntryPointRoutesUtils.addToRoutesArray(tree, testFilePath, '...routes');

      // Assert
      expect(result).toBe('');
    });

    it('should return empty string when no route objects are found in array', () => {
      // Arrange
      const emptyRoutesContent = `export const testRoutes: Route[] = [];`;
      tree.write(testFilePath, emptyRoutesContent);

      // Act
      const result = EntryPointRoutesUtils.addToRoutesArray(tree, testFilePath, '...routes');

      // Assert
      expect(result).toBe('');
    });

    it('should handle routes array with only spread operators initially', () => {
      // Arrange
      const spreadOnlyContent = `export const testRoutes: Route[] = [
  ...baseRoutes,
  {
    path: 'new',
    component: NewComponent
  }
];`;

      tree.write(testFilePath, spreadOnlyContent);
      const elementToAdd = '...additionalRoutes';

      // Act
      EntryPointRoutesUtils.addToRoutesArray(tree, testFilePath, elementToAdd);

      // Assert
      const updatedContent = tree.read(testFilePath, 'utf-8');
      expect(updatedContent).toContain('...additionalRoutes,');
      console.log('EntryPointRoutesUtils.addToRoutesArray - updatedContent', updatedContent);
      // Should be inserted before the first route object, after existing spreads
      // insertion order: additionalRoutes then baseRoutes
      expect(updatedContent).toMatch(/...additionalRoutes,\s*...baseRoutes,\s*\{/);
    });

    it('should handle multiline route objects correctly', () => {
      // Arrange
      const multilineRoutesContent = `export const testRoutes: Route[] = [
  {
    path: 'feature',
    loadComponent: () => 
      import('./feature/feature.component').then(
        m => m.FeatureComponent
      ),
    data: {
      title: 'Feature Page'
    }
  }
];`;

      tree.write(testFilePath, multilineRoutesContent);
      const elementToAdd = '...coreRoutes';

      // Act
      EntryPointRoutesUtils.addToRoutesArray(tree, testFilePath, elementToAdd);

      // Assert
      const updatedContent = tree.read(testFilePath, 'utf-8');
      expect(updatedContent).toContain('...coreRoutes,');
      expect(updatedContent).toMatch(/\[\s*...coreRoutes,\s*\{\s*path: 'feature'/);
    });

    it('should handle routes with different spacing and formatting', () => {
      // Arrange
      const irregularSpacingContent = `export const testRoutes: Route[] = [
    {path:'home',component:HomeComponent},
  {
    path: 'about', 
    component: AboutComponent  
  }
];`;

      tree.write(testFilePath, irregularSpacingContent);
      const elementToAdd = '...baseRoutes';

      // Act
      EntryPointRoutesUtils.addToRoutesArray(tree, testFilePath, elementToAdd);

      // Assert
      const updatedContent = tree.read(testFilePath, 'utf-8');
      expect(updatedContent).toContain('...baseRoutes,');
      // Should find the first object despite irregular formatting
      expect(updatedContent).toMatch(/\[\s*...baseRoutes,\s*\{path:'home'/);
    });

  });
});
