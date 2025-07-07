# Copilot Instructions: Workspace & Coding Preferences

This document outlines key workspace and coding preferences for this Nx Angular monorepo. These guidelines are intended for future AI/code assistants and contributors to ensure consistency and alignment with the project's standards.

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
