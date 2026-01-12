# Copilot Instructions: Workspace & Coding Preferences

This document outlines key workspace and coding preferences for this Nx Angular monorepo. These guidelines are intended for future AI/code assistants and contributors to ensure consistency and alignment with the project's standards.
You are an expert in TypeScript, Angular, and scalable web application development. You write maintainable, performant, and accessible code following Angular and TypeScript best practices.

## TypeScript Best Practices

- Use strict type checking
- Prefer type inference when the type is obvious
- Avoid the `any` type; use `unknown` when type is uncertain

## Components

- Keep components small and focused on a single responsibility
- Use `input()` and `output()` functions instead of decorators
- Use `computed()` for derived state
- Set `changeDetection: ChangeDetectionStrategy.OnPush` in `@Component` decorator
- Prefer inline templates for small components
- Prefer Reactive forms instead of Template-driven ones
- Do NOT use `ngClass`, use `class` bindings instead
- Do NOT use `ngStyle`, use `style` bindings instead

## State Management

- Use signals for local component state
- Use `computed()` for derived state
- Keep state transformations pure and predictable
- Do NOT use `mutate` on signals, use `update` or `set` instead

## Templates

- Keep templates simple and avoid complex logic
- Use native control flow (`@if`, `@for`, `@switch`) instead of `*ngIf`, `*ngFor`, `*ngSwitch`
- Use the async pipe to handle observables

## Services

- Design services around a single responsibility
- Use the `providedIn: 'root'` option for singleton services
- Use the `inject()` function instead of constructor injection



## Angular Best Practices

- Always use standalone components over NgModules
- Must NOT set `standalone: true` inside Angular decorators. It's the default.
- Use signals for state management
- Implement lazy loading for feature routes
- Do NOT use the `@HostBinding` and `@HostListener` decorators. Put host bindings inside the `host` object of the `@Component` or `@Directive` decorator instead
- Use `NgOptimizedImage` for all static images.
  - `NgOptimizedImage` does not work for inline base64 images.

---

## Angular & Workspace Preferences

1. **No CommonModule by Default**
   - Do not import `CommonModule` unless absolutely necessary. Use the new `@for` and `@if` template control flow blocks, which do not require `CommonModule`.
   - If `NgTemplateOutlet` is needed, import it directly.
   - References:
     - [@if](https://angular.dev/api/core/@if)
     - [@for](https://angular.dev/api/core/@for)

2. **Signal Inputs**
   - Use Angular's signal-based `@Input` for component inputs.
     - Reference: [Signal Input](https://angular.dev/api/core/input)

3. **Signal Outputs**
   - Use Angular's signal-based `@Output` for component outputs.
     - Reference: [Signal Output](https://angular.dev/api/core/output)

4. **Dependency Injection**
   - Prefer the `inject()` function for dependency injection over constructor injection.
     - Reference: [inject()](https://angular.dev/api/core/inject)

5. **Standalone Components & Testing**
   - Always use standalone components, directives, and pipes when possible.
   - For testing, use the standalone setup pattern:
     ```ts
     async function setup(config: import('@testing-library/angular').RenderComponentOptions<CustomThemeSavedComponent>)
     ```

6. **Testing Practices**
   - Use Jest for all unit testing.
   - Do not test private methods.

7. **Template Syntax**
   - Prefer self-closing tags (e.g., `<ml-theme-banner/>`) over expanded tags when possible.

8. **Control Flow**
   - Prefer early returns in `if` statements to reduce nesting and improve readability.

9. **Field Naming**
   - Prefix all private and protected fields with an underscore (`_`).

10. **No Magic Strings**
    - Avoid using magic strings. Use constants or enums for repeated string values.

11. **Code and Files**
    - If you're unsure about a code or file, open them.   
    - If you're unsure about a code or file structure, ask for clarification or guidance rather than making assumptions.   

12. **Process**
    --Think before each step and reflect about the implications of your changes.

---

These preferences are intended to keep the codebase modern, maintainable, and consistent. Please follow them for all new code and refactoring efforts.
